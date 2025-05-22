from uuid import uuid4, UUID

from db import get_session
from fastapi import APIRouter, Depends, HTTPException
from models.users import UserModel
from models.workout import (
    WorkoutContentModel,
    WorkoutEntryModel,
    WorkoutInstanceModel,
    WorkoutSetModel,
)
from schemas.workout_schema import WorkoutContentSchema, WorkoutTemplateSchema
from security import get_current_active_user
from sqlmodel import Session, select


# Creació d'un router FastAPI per agrupar les rutes
router = APIRouter()


@router.get(
    "/user/templates",
    response_model=list[WorkoutContentSchema], # El tipus de resposta esperat és una llista de WorkoutContentSchema
    name="Get user workout templates", # Nom de la ruta per a la documentació OpenAPI
    tags=["Templates"], # Etiqueta per agrupar rutes a la documentació OpenAPI
)
async def get_user_templates(
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> list[WorkoutContentModel]: # El tipus de retorn de la funció és una llista de WorkoutContentModel
    """
    Obté una llista de totes les plantilles d'entrenament creades per l'usuari actual.
    Les plantilles es distingeixen dels entrenaments realitzats perquè no tenen una instància associada.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista d'objectes WorkoutContentModel que representen les plantilles de l'usuari.
    """
    # Construeix la consulta per seleccionar les plantilles de l'usuari
    query = (
        select(WorkoutContentModel) # Selecciona el model de contingut de l'entrenament
        .outerjoin( # Utilitza un outer join per incloure WorkoutContentModel que no tenen correspondència a WorkoutInstanceModel
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # Condició del join # pyright: ignore[]
        )
        .where(WorkoutInstanceModel.workout_uuid == None) # Filtra per aquells que NO tenen una instància (són plantilles)
        .where(WorkoutContentModel.creator_uuid == current_user.uuid) # Filtra per les plantilles creades per l'usuari actual
        .order_by(WorkoutContentModel.name) # Ordena els resultats pel nom de la plantilla
    )
    # Executa la consulta i obté tots els resultats
    templates = session.exec(query).all()
    return templates # pyright: ignore[]


@router.get(
    "/user/templates/{template_uuid}",
    response_model=WorkoutContentSchema, # El tipus de resposta esperat és un únic objecte WorkoutContentSchema
    name="Get user workout template by UUID",
    tags=["Templates"],
)
async def get_user_template(
    template_uuid: str, # L'UUID de la plantilla a obtenir, passat com a paràmetre de ruta
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> WorkoutContentModel: # El tipus de retorn de la funció és WorkoutContentModel
    """
    Obté una plantilla d'entrenament específica de l'usuari actual pel seu UUID.

    Args:
        template_uuid: L'UUID de la plantilla a recuperar.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si la plantilla no es troba (codi 404).

    Returns:
        L'objecte WorkoutContentModel de la plantilla sol·licitada.
    """
    # Construeix la consulta per seleccionar una plantilla específica
    query = (
        select(WorkoutContentModel)
        .outerjoin(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(WorkoutInstanceModel.workout_uuid == None) # Assegura que sigui una plantilla
        .where(WorkoutContentModel.creator_uuid == current_user.uuid) # Pertany a l'usuari actual
        .where(WorkoutContentModel.uuid == UUID(template_uuid)) # Filtra per l'UUID de la plantilla proporcionat
    )
    # Executa la consulta i obté el primer resultat (o None si no es troba)
    template = session.exec(query).first()

    # Si no es troba la plantilla, llança una excepció HTTP 404
    if not template:
        raise HTTPException(status_code=404, detail="Template not found") # Plantilla no trobada

    return template # pyright: ignore[]


@router.post(
    "/user/templates",
    response_model=WorkoutContentSchema, # La resposta serà la plantilla creada
    name="Create workout template",
    tags=["Templates"],
    status_code=201, # Codi d'estat per a creació reeixida
)
async def add_user_template( # Nom de la funció corregit per reflectir que es tracta de plantilles
    input_workout: WorkoutTemplateSchema, # Les dades de la plantilla a afegir, validades per WorkoutTemplateSchema
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> WorkoutContentModel: # El tipus de retorn és la plantilla creada
    """
    Crea una nova plantilla d'entrenament per a l'usuari actual.
    Les plantilles no tenen instàncies d'execució associades.

    Args:
        input_workout: Les dades de la plantilla a crear (nom, descripció, entrades, sèries).
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        L'objecte WorkoutContentModel de la plantilla creada.
    """
    # Crea l'objecte principal de la plantilla (WorkoutContentModel)
    workout_content_entry = WorkoutContentModel(
        uuid=uuid4(), # Genera un nou UUID per a la plantilla
        creator_uuid=current_user.uuid, # Assigna l'UUID de l'usuari actual com a creador
        # Extreu 'name' i 'description' de l'objecte d'entrada, excloent valors None
        **input_workout.model_dump(exclude_none=True, include={"name", "description"}),
    )

    # Itera sobre cada entrada (exercici) de la plantilla d'entrada
    for i, input_entry in enumerate(input_workout.entries):
        # Crea un objecte WorkoutEntryModel per a cada exercici de la plantilla
        entry = WorkoutEntryModel(
            workout_uuid=workout_content_entry.uuid, # Enllaça amb l'UUID de la plantilla principal
            index=i, # Assigna un índex a l'entrada dins de la plantilla
            # Si l'exercici d'entrada no té UUID (nou exercici), en genera un de nou.
            # Altrament, utilitza l'UUID proporcionat (exercici existent).
            exercise_uuid=uuid4()
            if input_entry.exercise.uuid is None
            else input_entry.exercise.uuid,
            # Extreu camps rellevants de l'entrada de l'exercici
            **input_entry.model_dump(
                include={
                    "rest_countdown_duration",
                    "weight_unit",
                }
            ),
        )

        # Itera sobre cada sèrie (set) de l'entrada de l'exercici actual
        for j, input_set in enumerate(input_entry.sets):
            # Crea un objecte WorkoutSetModel per a cada sèrie
            w_set = WorkoutSetModel(
                workout_uuid=workout_content_entry.uuid, # Enllaça amb l'UUID de la plantilla principal
                entry_index=i, # Enllaça amb l'índex de l'entrada de l'exercici
                index=j, # Assigna un índex a la sèrie dins de l'entrada
                # Extreu camps rellevants de la sèrie
                **input_set.model_dump(include={"reps", "weight", "set_type"}),
            )
            # Afegeix la sèrie a la sessió de base de dades per ser guardada
            session.add(w_set)

        # Afegeix l'entrada de l'exercici a la sessió de base de dades
        session.add(entry)

    # Afegeix l'objecte principal de la plantilla a la sessió
    session.add(workout_content_entry)

    session.commit() # Persisteix els canvis
    # Refresca l'objecte des de la BD per assegurar que totes les relacions estiguin carregades
    session.refresh(workout_content_entry)
    return workout_content_entry


@router.delete(
    "/user/templates/{template_uuid}",
    name="Delete user workout template",
    tags=["Templates"],
)
async def delete_user_template(
    template_uuid: str, # L'UUID de la plantilla a eliminar
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
):
    """
    Elimina una plantilla d'entrenament específica de l'usuari actual.
    També s'eliminaran les entrades i sèries associades a aquesta plantilla.

    Args:
        template_uuid: L'UUID de la plantilla a eliminar.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si la plantilla no es troba (codi 404).
    """
    # Cerca la plantilla per eliminar
    query = (
        select(WorkoutContentModel)
        .outerjoin(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(WorkoutInstanceModel.workout_uuid == None) # Assegura que és una plantilla
        .where(WorkoutContentModel.creator_uuid == current_user.uuid) # Pertany a l'usuari actual
        .where(WorkoutContentModel.uuid == UUID(template_uuid)) # Filtra per l'UUID
    )
    template = session.exec(query).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found") # Plantilla no trobada

    # SQLModel gestiona l'eliminació en cascada, ja que les relacions estan configurades amb `cascade_delete=True`.
    # Si no, caldria eliminar manualment WorkoutEntryModel i WorkoutSetModel associats.
    session.delete(template) # Elimina la plantilla
    session.commit() # Guarda els canvis


@router.put(
    "/user/templates/{template_uuid}",
    response_model=WorkoutContentSchema, # La resposta serà la plantilla actualitzada
    name="Update workout template",
    tags=["Templates"],
)
async def update_user_template(
    template_uuid: str, # L'UUID de la plantilla a actualitzar
    input_workout: WorkoutTemplateSchema, # Les noves dades per a la plantilla
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> WorkoutContentModel: # El tipus de retorn és la plantilla actualitzada
    """
    Actualitza una plantilla d'entrenament existent de l'usuari actual.
    Les entrades i sèries existents de la plantilla s'eliminen i es reemplacen
    per les noves proporcionades.

    Args:
        template_uuid: L'UUID de la plantilla a actualitzar.
        input_workout: Les noves dades per a la plantilla.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si la plantilla no es troba (codi 404).

    Returns:
        L'objecte WorkoutContentModel de la plantilla actualitzada.
    """
    # Cerca la plantilla per actualitzar
    query = (
        select(WorkoutContentModel)
        .outerjoin(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(WorkoutInstanceModel.workout_uuid == None) # Assegura que és una plantilla
        .where(WorkoutContentModel.creator_uuid == current_user.uuid) # Pertany a l'usuari actual
        .where(WorkoutContentModel.uuid == UUID(template_uuid)) # Filtra per l'UUID
    )
    template = session.exec(query).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found") # Plantilla no trobada

    # Elimina les sèries (sets) existents associades a aquesta plantilla
    existing_sets = session.exec(
        select(WorkoutSetModel).where(WorkoutSetModel.workout_uuid == UUID(template_uuid))
    ).all()
    for w_set in existing_sets:
        session.delete(w_set)

    # Elimina les entrades (entries) existents associades a aquesta plantilla
    existing_entries = session.exec(
        select(WorkoutEntryModel).where(WorkoutEntryModel.workout_uuid == UUID(template_uuid))
    ).all()
    for entry in existing_entries:
        session.delete(entry)

    # Actualitza els camps principals de la plantilla (nom, descripció)
    template.sqlmodel_update(
        input_workout.model_dump(exclude_none=True, include={"name", "description"})
    )

    # Afegeix les noves entrades i sèries de la plantilla d'entrada
    for i, input_entry in enumerate(input_workout.entries):
        entry = WorkoutEntryModel(
            workout_uuid=UUID(template_uuid), # Enllaça amb l'UUID de la plantilla
            index=i,
            exercise_uuid=uuid4()
            if input_entry.exercise.uuid is None
            else input_entry.exercise.uuid,
            **input_entry.model_dump(
                include={
                    "rest_countdown_duration",
                    "weight_unit",
                }
            ),
        )

        for j, input_set in enumerate(input_entry.sets):
            w_set = WorkoutSetModel(
                workout_uuid=UUID(template_uuid), # Enllaça amb l'UUID de la plantilla
                entry_index=i, # Enllaça amb l'objecte entry
                index=j,
                **input_set.model_dump(include={"reps", "weight", "set_type"}),
            )
            session.add(w_set) # Afegeix la nova sèrie

        session.add(entry) # Afegeix la nova entrada

    session.add(template) # Afegeix la plantilla actualitzada a la sessió

    session.commit() # Guarda tots els canvis 
    session.refresh(template) # Refresca l'objecte des de la BD
    return template
