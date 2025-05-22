from datetime import datetime, timedelta
from uuid import uuid4

from db import get_session
from fastapi import APIRouter, Depends, HTTPException
from models.users import UserModel
from models.workout import (
    WorkoutContentModel,
    WorkoutEntryModel,
    WorkoutInstanceModel,
    WorkoutSetModel,
)
from schemas.workout_schema import WorkoutContentSchema, WorkoutStatsSchema
from security import get_current_active_user
from sqlmodel import Session, desc, func, select

# Creació d'un router FastAPI per agrupar les rutes relacionades amb els entrenaments
router = APIRouter()


@router.get(
    "/user/workouts",
    response_model=list[
        WorkoutContentSchema
    ],  # El tipus de resposta esperat és una llista d'objectes WorkoutContentSchema
    name="Get user workouts",  # Nom de la ruta per a la documentació OpenAPI
    tags=["Workouts"],  # Etiqueta per agrupar rutes a la documentació OpenAPI
)
async def get_user_workouts(
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
    offset: int = 0,  # Paràmetre de consulta per a la paginació: desplaçament inicial
    limit: int = 25,  # Paràmetre de consulta per a la paginació: nombre màxim d'elements a retornar
) -> list[WorkoutContentSchema]:
    """
    Obté una llista dels entrenaments de l'usuari actual,
    ordenats pel més recent primer.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.
        offset: El nombre d'entrenaments a ometre (per a paginació).
        limit: El nombre màxim d'entrenaments a retornar.

    Returns:
        Una llista d'objectes WorkoutContentSchema que representen els entrenaments de l'usuari.
    """
    # Construeix la consulta per seleccionar els entrenaments de l'usuari
    query = (
        select(
            WorkoutContentModel, WorkoutInstanceModel
        )  # Selecciona els models de contingut i instància de l'entrenament
        .join(
            WorkoutInstanceModel
        )  # Fa un join amb WorkoutInstanceModel per poder ordenar per data d'inici
        .where(
            WorkoutContentModel.creator_uuid == current_user.uuid
        )  # Filtra pels entrenaments creats per l'usuari actual
        .order_by(
            desc(WorkoutInstanceModel.timestamp_start)
        )  # Ordena els resultats per la data d'inici de la instància en ordre descendent (més recents primer) # pyright: ignore[]
        .offset(offset)  # Aplica el desplaçament per a la paginació
        .limit(limit)  # Limita el nombre de resultats
    )
    # Executa la consulta i obté tots els resultats
    workouts_with_instances = session.exec(query).all()
    # Retorna només la part de WorkoutContentModel de cada tupla resultant
    return [workout_content for workout_content, _ in workouts_with_instances]  # pyright: ignore[]


@router.get(
    "/user/workouts/{workout_uuid}",
    response_model=WorkoutContentSchema,  # El tipus de resposta esperat és un únic objecte WorkoutContentSchema
    name="Get user workout by UUID",
    tags=["Workouts"],
)
async def get_user_workout(
    workout_uuid: str,  # L'UUID de l'entrenament a obtenir, passat com a paràmetre de ruta
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> WorkoutContentSchema:
    """
    Obté un entrenament específic de l'usuari actual pel seu UUID.

    Args:
        workout_uuid: L'UUID de l'entrenament a recuperar.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'entrenament no es troba (codi 404).

    Returns:
        L'objecte WorkoutContentSchema de l'entrenament sol·licitat.
    """
    # Construeix la consulta per seleccionar un entrenament específic
    query = (
        select(WorkoutContentModel, WorkoutInstanceModel)
        .join(WorkoutInstanceModel)  # Join amb WorkoutInstanceModel
        .where(
            WorkoutContentModel.creator_uuid == current_user.uuid
        )  # Filtra per l'usuari actual
        .where(
            WorkoutContentModel.uuid == workout_uuid
        )  # Filtra per l'UUID de l'entrenament proporcionat
    )
    # Executa la consulta i obté el primer resultat (o None si no es troba)
    workout_with_instance = session.exec(query).first()

    # Si no es troba l'entrenament, llança una excepció HTTP 404
    if not workout_with_instance:
        raise HTTPException(
            status_code=404, detail="Workout not found"
        )  # Entrenament no trobat

    # Retorna la part de WorkoutContentModel de la tupla resultant
    return workout_with_instance[0]  # pyright: ignore[]


@router.post(
    "/user/workouts",
    name="Add user workout to history", 
    tags=["Workouts"],
)
async def add_user_workout(
    input_workout: WorkoutContentSchema,  # Les dades de l'entrenament a afegir, validades per WorkoutContentSchema
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
):
    """
    Afegeix un nou entrenament a l'historial de l'usuari actual.
    Això inclou el contingut de l'entrenament, les seves entrades (exercicis) i les sèries.

    Args:
        input_workout: Les dades de l'entrenament a afegir.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.
    """
    # Crea l'objecte principal de l'entrenament (WorkoutContentModel)
    workout_content_entry = WorkoutContentModel(
        uuid=uuid4(),  # Genera un nou UUID per a l'entrenament
        creator_uuid=current_user.uuid,  # Assigna l'UUID de l'usuari actual com a creador
        # Extreu 'name' i 'description' de l'objecte d'entrada, excloent valors None
        **input_workout.model_dump(exclude_none=True, include={"name", "description"}),
    )

    # Itera sobre cada entrada (exercici) de l'entrenament d'entrada
    for i, input_entry in enumerate(input_workout.entries):
        # Crea un objecte WorkoutEntryModel per a cada exercici
        entry = WorkoutEntryModel(
            workout_uuid=workout_content_entry.uuid,  # Enllaça amb l'UUID de l'entrenament principal
            index=i,  # Assigna un índex a l'entrada dins de l'entrenament
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
                workout_uuid=workout_content_entry.uuid,  # Enllaça amb l'UUID de l'entrenament principal
                entry_index=i,  # Enllaça amb l'índex de l'entrada de l'exercici
                index=j,  # Assigna un índex a la sèrie dins de l'entrada
                # Extreu camps rellevants de la sèrie
                **input_set.model_dump(include={"reps", "weight", "set_type"}),
            )
            # Afegeix la sèrie a la sessió de base de dades per ser guardada
            session.add(w_set)

        # Afegeix l'entrada de l'exercici a la sessió de base de dades
        session.add(entry)

    # Afegeix l'objecte principal de l'entrenament a la sessió
    session.add(workout_content_entry)

    # Si l'entrenament d'entrada té informació d'instància (temps d'inici, durada)
    if input_workout.instance:
        # Crea un objecte WorkoutInstanceModel
        workout_instance = WorkoutInstanceModel(
            workout_uuid=workout_content_entry.uuid,  # Enllaça amb l'UUID de l'entrenament principal
            # Extreu camps rellevants de la instància de l'entrenament # pyright: ignore[]
            **input_workout.instance.model_dump(
                exclude_none=True, include={"timestamp_start", "duration"}
            ),
        )
        # Afegeix la instància de l'entrenament a la sessió
        session.add(workout_instance)

    # Confirma (commit) tots els canvis a la base de dades
    session.commit()


@router.get(
    "/user/stats",
    response_model=WorkoutStatsSchema,  # El tipus de resposta esperat és WorkoutStatsSchema
    name="Get user statistics",  # Nom de la ruta
    tags=["Workouts"],
)
async def get_user_stats(
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> WorkoutStatsSchema:
    """
    Obté estadístiques d'entrenaments per a l'usuari actual, incloent el total
    d'entrenaments, entrenaments de l'última setmana i un historial setmanal.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si hi ha un error intern en obtenir les dades (codi 500).

    Returns:
        Un objecte WorkoutStatsSchema amb les estadístiques de l'usuari.
    """
    # Obté la data i hora actuals, ajustades a l'inici del dia (00:00:00)
    now = datetime.combine(datetime.now().date(), datetime.min.time())
    # Calcula l'inici de la setmana actual (Dilluns)
    start_of_week = now - timedelta(days=now.weekday())

    # Consulta per obtenir el nombre total d'entrenaments de l'usuari
    total_workouts_count = session.exec(
        select(
            func.count(WorkoutContentModel.uuid)
        )  # Compta els UUIDs dels entrenaments
        .select_from(WorkoutContentModel)  # Des de la taula WorkoutContentModel
        .join(
            WorkoutInstanceModel,  # Fa un join amb WorkoutInstanceModel
            WorkoutContentModel.uuid
            == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(
            WorkoutContentModel.creator_uuid == current_user.uuid
        )  # Filtra per l'usuari actual
    ).first()

    # Consulta per obtenir el nombre d'entrenaments de l'usuari en l'última setmana (des de l'inici de la setmana actual)
    workouts_last_week_count = session.exec(
        select(func.count(WorkoutContentModel.uuid))
        .select_from(WorkoutContentModel)
        .join(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        # Filtra per instàncies d'entrenament que van començar des de l'inici de la setmana actual
        # Transformar el timestamp de datetime (segons) a milisegons (DB).
        .where(WorkoutInstanceModel.timestamp_start >= start_of_week.timestamp() * 1000)
        .where(
            WorkoutContentModel.creator_uuid == current_user.uuid
        )  # Filtra per l'usuari actual
    ).first()

    # Si alguna de les consultes no retorna un resultat 
    if total_workouts_count is None or workouts_last_week_count is None:
        raise HTTPException(
            status_code=500, detail="Internal server error"
        ) 

    # Inicialitza la llista d'entrenaments per setmana amb el recompte de l'última setmana
    workouts_per_week_counts = [workouts_last_week_count]

    # Itera sobre les 7 setmanes anteriors per recopilar estadístiques setmanals
    for i in range(
        7
    ):  # Per a les setmanes -1, -2, ..., -7 respecte a la setmana actual
        # Calcula la data de referència per a la setmana anterior
        previous_week_ref_date = now - timedelta(weeks=i + 1)
        # Calcula l'inici d'aquella setmana
        start_of_period_week = previous_week_ref_date - timedelta(
            days=previous_week_ref_date.weekday()
        )
        # Calcula el final d'aquella setmana (inici de la següent)
        end_of_period_week = start_of_period_week + timedelta(days=7)

        # Consulta per obtenir el nombre d'entrenaments en el període setmanal calculat
        workouts_in_period_count = session.exec(
            select(func.count(WorkoutContentModel.uuid))
            .select_from(WorkoutContentModel)
            .join(
                WorkoutInstanceModel,
                WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
            )
            .where(
                WorkoutContentModel.creator_uuid == current_user.uuid
            )  # Filtra per l'usuari actual
            # Filtra per instàncies dins del rang de la setmana
            .where(
                WorkoutInstanceModel.timestamp_start
                >= start_of_period_week.timestamp() * 1000
            )
            .where(
                WorkoutInstanceModel.timestamp_start
                < end_of_period_week.timestamp()
                * 1000
            )
        ).first()

        # Si s'obté un resultat per al període, l'afegeix a la llista
        if workouts_in_period_count is not None:
            workouts_per_week_counts.append(workouts_in_period_count)
        else:
            # Si no hi ha entrenaments en aquella setmana, afegeix 0
            workouts_per_week_counts.append(0)

    # Retorna l'objecte WorkoutStatsSchema amb totes les dades recopilades
    return WorkoutStatsSchema(
        workouts=total_workouts_count,
        workouts_last_week=workouts_last_week_count,
        workouts_per_week=workouts_per_week_counts,
    )
