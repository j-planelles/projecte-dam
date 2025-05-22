from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, desc, select

from db import get_session
from models.exercise import DefaultExerciseModel, ExerciseModel
from models.users import UserModel
from models.workout import WorkoutContentModel, WorkoutEntryModel, WorkoutInstanceModel
from schemas.exercise_schema import ExerciseSchema
from schemas.workout_schema import WorkoutEntrySchema
from security import get_current_active_user

# Creació d'un router FastAPI per agrupar les rutes relacionades amb els exercicis
router = APIRouter()


@router.get(
    "/default-exercises",
    name="Get all default exercises",  # Nom de la ruta per a la documentació OpenAPI
    tags=[
        "Exercises",
        "Default exercises",
    ],  # Etiquetes per agrupar rutes a la documentació OpenAPI
    response_model=list[
        DefaultExerciseModel
    ],  # El tipus de resposta esperat és una llista de DefaultExerciseModel
)
async def get_default_exercises(
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual (per assegurar l'autenticació)
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> list[
    DefaultExerciseModel
]:  # El tipus de retorn de la funció és una llista de DefaultExerciseModel
    """
    Obté una llista de tots els exercicis per defecte disponibles en el sistema.
    Aquests són exercicis predefinits que els usuaris poden utilitzar.

    Args:
        current_user: L'usuari actualment autenticat (per protegir l'endpoint).
        session: La sessió de base de dades.

    Returns:
        Una llista d'objectes DefaultExerciseModel.
    """
    query = select(
        DefaultExerciseModel
    )  # Construeix una consulta per seleccionar tots els exercicis per defecte
    exercises = list(
        session.exec(query).all()
    )  # Executa la consulta i converteix el resultat a una llista
    return exercises


@router.get(
    "/default-exercises/{exercise_uuid}",
    name="Get a specific default exercise by UUID",  # Nom de la ruta
    tags=["Exercises", "Default exercises"],
    response_model=DefaultExerciseModel,  # El tipus de resposta esperat és un únic DefaultExerciseModel
)
async def get_default_exercise(
    exercise_uuid: str,  # L'UUID de l'exercici per defecte a obtenir (paràmetre de ruta)
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> DefaultExerciseModel:  # El tipus de retorn és DefaultExerciseModel
    """
    Obté un exercici per defecte específic pel seu UUID.

    Args:
        exercise_uuid: L'UUID de l'exercici per defecte a recuperar.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'exercici per defecte no es troba (codi 404).

    Returns:
        L'objecte DefaultExerciseModel de l'exercici sol·licitat.
    """
    # Construeix la consulta per seleccionar un exercici per defecte específic
    query = select(DefaultExerciseModel).where(
        DefaultExerciseModel.uuid
        == UUID(
            exercise_uuid
        )  # Filtra per l'UUID proporcionat (convertit a objecte UUID)
    )
    exercise = session.exec(
        query
    ).first()  # Executa la consulta i obté el primer resultat

    if not exercise:  # Si no es troba l'exercici
        raise HTTPException(status_code=404, detail="Default exercise not found")

    return exercise


@router.get(
    "/user/exercises",
    name="Get user's enabled custom exercises",
    tags=["Exercises"],
    response_model=list[ExerciseModel],  # La resposta serà una llista d'ExerciseModel
)
async def get_exercises(
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> list[ExerciseModel]:  # El tipus de retorn és una llista d'ExerciseModel
    """
    Obté una llista de tots els exercicis personalitzats i habilitats
    creats per l'usuari actual.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista d'objectes ExerciseModel que representen els exercicis de l'usuari.
    """
    # Construeix la consulta per seleccionar els exercicis de l'usuari
    query = (
        select(ExerciseModel)
        .where(
            ExerciseModel.creator_uuid == current_user.uuid
        )  # Filtra pels exercicis creats per l'usuari actual
        .where(
            ExerciseModel.is_disabled == False
        )  # Filtra només pels exercicis habilitats (no arxivats)
    )
    exercises = list(session.exec(query).all())  # Executa la consulta
    return exercises


@router.get(
    "/user/exercises/{exercise_uuid}",
    name="Get a specific user's custom exercise",
    tags=["Exercises"],
    response_model=ExerciseModel,  # La resposta serà un ExerciseModel
)
async def get_exercise(
    exercise_uuid: str,  # L'UUID de l'exercici personalitzat a obtenir
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> ExerciseModel:  # El tipus de retorn és ExerciseModel
    """
    Obté un exercici personalitzat específic creat per l'usuari actual, pel seu UUID.

    Args:
        exercise_uuid: L'UUID de l'exercici a recuperar.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'exercici no es troba (codi 404).

    Returns:
        L'objecte ExerciseModel de l'exercici sol·licitat.
    """
    # Construeix la consulta per seleccionar un exercici específic de l'usuari
    query = (
        select(ExerciseModel)
        .where(
            ExerciseModel.creator_uuid == current_user.uuid
        )  # Assegura que l'exercici pertanyi a l'usuari actual
        .where(
            ExerciseModel.uuid == UUID(exercise_uuid)
        )  # Filtra per l'UUID de l'exercici
    )
    exercise = session.exec(query).first()  # Executa la consulta

    if not exercise:  # Si no es troba l'exercici
        raise HTTPException(
            status_code=404, detail="Exercise not found"
        )  # Exercici no trobat

    return exercise


@router.post(
    "/user/exercises",
    name="Create a custom exercise for the user",
    tags=["Exercises"],
    response_model=ExerciseModel,  # La resposta serà l'exercici creat
)
async def create_exercise(
    new_exercise: ExerciseSchema,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(ExerciseModel)
        .where(ExerciseModel.creator_uuid == current_user.uuid)
        .where(ExerciseModel.uuid == new_exercise.uuid)
    )
    exercise = session.exec(query).first()

    if exercise:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An exercise with the same UUID already exists.",
        )

    # Prepara el diccionari de dades per crear el model, excloent camps no desitjats
    new_exercise_dict = new_exercise.model_dump(
        exclude_none=True,
        exclude={"is_disabled"},  # `is_disabled` per defecte és False en el model
    )

    new_exercise_model = ExerciseModel(
        **new_exercise_dict,
        creator_uuid=current_user.uuid,  # Afegeix el creador
    )
    session.add(new_exercise_model)  # Afegeix el nou exercici a la sessió
    session.commit()  # Guarda a la BD

    session.refresh(new_exercise_model)  # Refresca l'objecte des de la BD
    return new_exercise_model


@router.put(
    "/user/exercises/{exercise_uuid}",
    name="Update a user's custom exercise",  # Nom de la ruta
    tags=["Exercises"],
    response_model=ExerciseModel,  # La resposta serà l'exercici actualitzat
)
async def update_exercise(
    exercise_uuid: str,  # L'UUID de l'exercici a actualitzar
    fields_to_edit: ExerciseSchema,  # Dades amb els camps a editar
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> ExerciseModel:  # El tipus de retorn és l'ExerciseModel actualitzat
    """
    Actualitza un exercici personalitzat existent de l'usuari actual.

    Args:
        exercise_uuid: L'UUID de l'exercici a actualitzar.
        fields_to_edit: Un objecte ExerciseSchema amb els camps a modificar.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'exercici no es troba o està desactivat (codi 404).

    Returns:
        L'objecte ExerciseModel de l'exercici actualitzat.
    """
    # Cerca l'exercici habilitat per actualitzar
    query = (
        select(ExerciseModel)
        .where(ExerciseModel.creator_uuid == current_user.uuid)  # Pertany a l'usuari
        .where(ExerciseModel.uuid == UUID(exercise_uuid))  # Coincideix amb l'UUID
        .where(ExerciseModel.is_disabled == False)  # Ha d'estar habilitat
    )
    exercise = session.exec(query).first()

    if not exercise:  # Si no es troba l'exercici
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enabled exercise not found",  # Exercici habilitat no trobat
        )

    # Prepara el diccionari de camps a actualitzar
    # Exclou camps que no s'haurien de modificar (com default_exercise_uuid, is_disabled, uuid)
    fields_to_edit_dict = fields_to_edit.model_dump(
        exclude_none=True, exclude={"default_exercise_uuid", "is_disabled", "uuid"}
    )
    exercise.sqlmodel_update(fields_to_edit_dict)  # Aplica les actualitzacions al model
    session.add(exercise)  # Afegeix l'exercici actualitzat a la sessió
    session.commit()  # Guarda els canvis

    session.refresh(exercise)  # Refresca l'objecte
    return exercise


@router.delete(
    "/user/exercises/{exercise_uuid}",
    name="Archive (disable) a user's custom exercise",
    tags=["Exercises"],
)
async def delete_exercise(
    exercise_uuid: str,  # L'UUID de l'exercici a "eliminar" (desactivar)
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
):
    """
    Desactiva (arxiva) un exercici personalitzat de l'usuari actual.
    Això és una eliminació suau; l'exercici no s'elimina de la base de dades,
    sinó que es marca com a `is_disabled = True`.

    Args:
        exercise_uuid: L'UUID de l'exercici a desactivar.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'exercici no es troba o ja està desactivat (codi 404).
    """
    # Cerca l'exercici habilitat per desactivar
    query = (
        select(ExerciseModel)
        .where(ExerciseModel.creator_uuid == current_user.uuid)
        .where(ExerciseModel.uuid == UUID(exercise_uuid))
        .where(
            ExerciseModel.is_disabled == False
        )  # Només es poden eliminar els que estan habilitats
    )
    exercise = session.exec(query).first()

    if not exercise:  # Si no es troba l'exercici habilitat
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enabled exercise not found to disable",  # Exercici habilitat no trobat per desactivar
        )

    exercise.is_disabled = True  # Marca l'exercici com a desactivat
    session.add(exercise)  # Afegeix a la sessió
    session.commit()  # Guarda el canvi


@router.get(
    "/user/exercises/{exercise_uuid}/last",
    name="Get last recorded entry for a specific exercise",
    tags=["Exercises"],
    response_model=WorkoutEntrySchema,  # La resposta serà un WorkoutEntrySchema
)
async def get_last_exercise(
    exercise_uuid: str,  # L'UUID de l'exercici del qual obtenir l'última entrada
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> WorkoutEntryModel:  # El tipus de retorn és WorkoutEntryModel
    """
    Obté l'última entrada registrada (exercici dins d'un entrenament) per a un
    exercici específic realitzat per l'usuari actual.

    Args:
        exercise_uuid: L'UUID de l'exercici.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si no es troba cap entrada per a aquest exercici (codi 404).

    Returns:
        L'objecte WorkoutEntryModel de l'última vegada que es va realitzar l'exercici.
    """
    # Construeix una consulta per trobar l'última entrada d'un exercici
    query = (
        select(WorkoutEntryModel)  # Selecciona l'entrada de l'entrenament
        .join(
            WorkoutContentModel,  # Fa un join amb el contingut de l'entrenament
            WorkoutEntryModel.workout_uuid == WorkoutContentModel.uuid,  # pyright: ignore[]
        )
        .join(
            WorkoutInstanceModel,  # Fa un join amb la instància de l'entrenament per ordenar per data
            WorkoutInstanceModel.workout_uuid == WorkoutContentModel.uuid,  # pyright: ignore[]
        )
        .where(
            WorkoutContentModel.creator_uuid == current_user.uuid
        )  # Filtra per entrenaments de l'usuari actual
        .where(
            WorkoutEntryModel.exercise_uuid == UUID(exercise_uuid)
        )  # Filtra per l'exercici específic
        .order_by(
            desc(WorkoutInstanceModel.timestamp_start)
        )  # Ordena per la data d'inici de l'entrenament en ordre descendent
        .limit(1)  # Pren només el resultat més recent
    )
    workout_entry = session.exec(query).first()  # Executa la consulta

    if not workout_entry:  # Si no es troba cap entrada
        raise HTTPException(
            status_code=404, detail="No previous entry found for this exercise"
        )  # No s'ha trobat cap entrada anterior per a aquest exercici

    return workout_entry


@router.get(
    "/user/archived-exercises",
    name="Get user's archived (disabled) custom exercises",
    tags=["Exercises"],
    response_model=list[ExerciseModel],  # La resposta serà una llista d'ExerciseModel
)
async def get_disabled_exercises(
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> list[ExerciseModel]:  # El tipus de retorn és una llista d'ExerciseModel
    """
    Obté una llista de tots els exercicis personalitzats creats per l'usuari actual
    que han estat arxivats (marcats com `is_disabled = True`).

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista d'objectes ExerciseModel que representen els exercicis arxivats de l'usuari.
    """
    # Construeix la consulta per seleccionar els exercicis arxivats de l'usuari
    query = (
        select(ExerciseModel)
        .where(
            ExerciseModel.creator_uuid == current_user.uuid
        )  # Filtra pels exercicis creats per l'usuari actual
        .where(
            ExerciseModel.is_disabled == True
        )  # Filtra només pels exercicis desactivats (arxivats)
    )
    exercises = list(session.exec(query).all())  # Executa la consulta
    return exercises
