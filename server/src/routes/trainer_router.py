from datetime import datetime
from typing import List
from uuid import UUID

from db import get_session
from fastapi import APIRouter, Depends, HTTPException
from models.trainer import (
    TrainerRecommendationModel,
    TrainerRequestModel,
    UserInterestLinkModel,
    UserInterestModel,
)
from models.users import TrainerModel, UserConfig, UserModel
from models.workout import WorkoutContentModel, WorkoutInstanceModel
from schemas.trainer_scehma import TrainerRequestSchema, UserInterestSchema
from schemas.types.enums import TrainerRequestActions
from schemas.user_schema import UserSchema
from schemas.workout_schema import WorkoutContentSchema
from security import get_current_active_user, get_trainer_user, get_user_by_uuid
from sqlalchemy import and_
from sqlmodel import Session, func, select

router = APIRouter() # Creació d'un router FastAPI per agrupar les rutes


@router.get(
    "/trainer/requests",
    response_model=List[TrainerRequestSchema], # La resposta serà una llista de TrainerRequestSchema
    name="Get pending trainer requests",
    tags=["Trainer"],
)
async def get_requests(
    trainer_user: UserModel = Depends(get_trainer_user), # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> List[TrainerRequestModel]: # El tipus de retorn de la funció és una llista de models TrainerRequestModel
    """
    Obté totes les sol·licituds pendents (no processades) dirigides a l'entrenador actual.

    Args:
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista de sol·licituds d'entrenador pendents.
    """
    # Construeix una consulta per seleccionar les sol·licituds no processades per a l'entrenador actual
    query = (
        select(TrainerRequestModel)
        .where(TrainerRequestModel.trainer_uuid == trainer_user.uuid) # Filtra per l'UUID de l'entrenador
        .where(TrainerRequestModel.is_processed == False) # Filtra per sol·licituds no processades
    )
    requests = session.exec(query).all() # Executa la consulta i obté tots els resultats
    return requests


@router.post(
    "/trainer/requests/{user_uuid}",
    name="Handle user request to trainer",
    tags=["Trainer"],
)
async def handle_requests(
    user_uuid: str, # UUID de l'usuari que va fer la sol·licitud (paràmetre de ruta)
    action: TrainerRequestActions, # Acció a realitzar (accept/deny), com a paràmetre de consulta
    trainer_user: UserModel = Depends(get_trainer_user), # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
):
    """
    Gestiona una sol·licitud d'un usuari a l'entrenador actual (acceptar o rebutjar).

    Args:
        user_uuid: L'UUID de l'usuari que va enviar la sol·licitud.
        action: L'acció a realitzar sobre la sol·licitud (ACCEPT o DENY).
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si la sol·licitud no es troba (404), si l'usuari no es troba (404
                       en cas d'acceptació), o si l'usuari ja té un entrenador (409
                       en cas d'acceptació).
    """
    # Cerca la sol·licitud específica no processada
    query = (
        select(TrainerRequestModel)
        .where(TrainerRequestModel.trainer_uuid == trainer_user.uuid) # De l'entrenador actual
        .where(TrainerRequestModel.user_uuid == UUID(user_uuid)) # De l'usuari especificat
        .where(TrainerRequestModel.is_processed == False) # Que no estigui processada
    )
    request = session.exec(query).first() # Obté la primera (i única esperada) sol·licitud

    if not request:
        raise HTTPException(status_code=404, detail="Request not found") # Sol·licitud no trobada

    if action == TrainerRequestActions.ACCEPT: # Si l'acció és acceptar
        user = get_user_by_uuid(user_uuid) # Obté l'usuari que va fer la sol·licitud

        if not user:
            raise HTTPException(status_code=404, detail="User not found.") # Usuari no trobat

        if user.trainer_uuid is not None: # Comprova si l'usuari ja té un entrenador assignat
            raise HTTPException(
                status_code=409, detail="The user already has a trainer." # L'usuari ja té un entrenador
            )

        user.trainer_uuid = trainer_user.uuid # Assigna l'entrenador actual a l'usuari
        session.add(user) # Afegeix l'usuari actualitzat a la sessió

    request.is_processed = True # Marca la sol·licitud com a processada
    session.add(request) # Afegeix la sol·licitud actualitzada a la sessió
    session.commit() # Guarda els canvis a la base de dades


@router.get(
    "/trainer/users",
    response_model=List[UserSchema], # La resposta serà una llista d'UserSchema
    name="Get users paired with trainer",
    tags=["Trainer"],
)
async def get_paired_users(
    trainer_user: UserModel = Depends(get_trainer_user), # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> List[UserModel]: # El tipus de retorn és una llista de UserModel
    """
    Obté una llista de tots els usuaris actualment vinculats (entrenats per) l'entrenador actual.

    Args:
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista d'usuaris vinculats a l'entrenador.
    """
    # Cerca tots els usuaris que tenen aquest entrenador assignat
    query = select(UserModel).where(UserModel.trainer_uuid == trainer_user.uuid)
    users = session.exec(query).all() # Executa la consulta
    return users


@router.get(
    "/trainer/users/{user_uuid}/info",
    response_model=UserSchema, # La resposta serà un UserSchema
    name="Get info of a specific paired user", # Nom de la ruta
    tags=["Trainer"],
)
async def get_paired_user_info(
    user_uuid: str, # UUID de l'usuari del qual obtenir informació
    trainer_user: UserModel = Depends(get_trainer_user), # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> UserModel: # El tipus de retorn és UserModel
    """
    Obté informació detallada d'un usuari específic que està vinculat a l'entrenador actual.

    Args:
        user_uuid: L'UUID de l'usuari a consultar.
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari no es troba o no està vinculat a aquest entrenador (404).

    Returns:
        La informació de l'usuari vinculat.
    """
    # Cerca l'usuari específic que està assignat a l'entrenador actual
    query = (
        select(UserModel)
        .where(UserModel.uuid == UUID(user_uuid)) # Filtra per l'UUID de l'usuari
        .where(UserModel.trainer_uuid == trainer_user.uuid) # Assegura que estigui vinculat a aquest entrenador
    )
    user = session.exec(query).first() # Obté l'usuari

    if not user:
        raise HTTPException(status_code=404, detail="User not found or not paired with this trainer.") # Usuari no trobat o no vinculat

    return user


@router.post(
    "/trainer/users/{user_uuid}/unpair",
    name="Unpair trainer from user",
    tags=["Trainer"],
)
async def unpair_user(
    user_uuid: str, # UUID de l'usuari a desvincular
    trainer_user: UserModel = Depends(get_trainer_user), # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
):
    """
    Desvincula un usuari de l'entrenador actual.
    Això també elimina totes les recomanacions d'entrenament fetes per aquest entrenador a aquest usuari.

    Args:
        user_uuid: L'UUID de l'usuari a desvincular.
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari no es troba o no està vinculat a aquest entrenador (404).
    """
    # Cerca l'usuari per desvincular
    query = (
        select(UserModel)
        .where(UserModel.uuid == UUID(user_uuid))
        .where(UserModel.trainer_uuid == trainer_user.uuid)
    )
    user = session.exec(query).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found or not paired with this trainer.") # Usuari no trobat o no vinculat

    user.trainer_uuid = None # Elimina la vinculació de l'entrenador amb l'usuari

    session.add(user) # Afegeix l'usuari actualitzat

    # Cerca totes les recomanacions fetes per aquest entrenador a aquest usuari
    recommendations_query = (
        select(TrainerRecommendationModel)
        .where(TrainerRecommendationModel.user_uuid == UUID(user_uuid))
        .where(TrainerRecommendationModel.trainer_uuid == trainer_user.uuid)
    )
    recommendations_results = session.exec(recommendations_query).all()

    for recommendation in recommendations_results: # Elimina cada recomanació
        session.delete(recommendation)

    session.commit() # Guarda els canvis


@router.get(
    "/trainer/users/{user_uuid}/recommendation",
    response_model=list[WorkoutContentSchema], # La resposta és una llista de WorkoutContentSchema
    name="Get recommendations assigned to user by trainer",
    tags=["Trainer"],
)
async def view_recommendations(
    user_uuid: str, # UUID de l'usuari per al qual veure les recomanacions
    trainer_user: UserModel = Depends(get_trainer_user), # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> List[WorkoutContentModel]: # El tipus de retorn és una llista de WorkoutContentModel
    """
    Visualitza totes les recomanacions d'entrenament que l'entrenador actual ha assignat a un usuari específic.

    Args:
        user_uuid: L'UUID de l'usuari.
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista de continguts d'entrenament recomanats.
    """
    # Construeix la consulta per obtenir els entrenaments recomanats
    query = (
        select(WorkoutContentModel) # Selecciona el contingut de l'entrenament
        .join(
            TrainerRecommendationModel, # Fa un join amb la taula de recomanacions
            WorkoutContentModel.uuid == TrainerRecommendationModel.workout_uuid,  # Condició del join # pyright: ignore[]
        )
        .where(TrainerRecommendationModel.user_uuid == UUID(user_uuid)) # Filtra per l'usuari
        .where(TrainerRecommendationModel.trainer_uuid == trainer_user.uuid) # Filtra per l'entrenador actual
    )
    results = session.exec(query).all() # Executa la consulta
    return results


@router.post(
    "/trainer/users/{user_uuid}/recommendation",
    name="Create workout recommendation for user",
    tags=["Trainer"],
)
async def create_recommendation(
    user_uuid: str, # UUID de l'usuari a qui recomanar
    workout_uuid: str, # UUID de l'entrenament a recomanar (paràmetre de consulta)
    trainer_user: UserModel = Depends(get_trainer_user), # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
):
    """
    Crea una nova recomanació d'entrenament per a un usuari específic, feta per l'entrenador actual.

    Args:
        user_uuid: L'UUID de l'usuari que rebrà la recomanació.
        workout_uuid: L'UUID de l'entrenament a recomanar.
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari no es troba o no està vinculat a aquest entrenador (404).
    """
    # Verifica que l'usuari existeix i està vinculat a l'entrenador
    query = (
        select(UserModel)
        .where(UserModel.uuid == UUID(user_uuid))
        .where(UserModel.trainer_uuid == trainer_user.uuid)
    )
    user = session.exec(query).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found or not paired with this trainer.") # Usuari no trobat o no vinculat

    # Crea la nova recomanació
    new_recommendation = TrainerRecommendationModel(
        user_uuid=UUID(user_uuid),
        trainer_uuid=trainer_user.uuid,
        workout_uuid=UUID(workout_uuid),
    )
    session.add(new_recommendation) # Afegeix a la sessió
    session.commit() # Guarda a la BD


@router.delete(
    "/trainer/users/{user_uuid}/recommendation",
    name="Delete workout recommendation for user", 
    tags=["Trainer"],
)
async def delete_recommendation(
    user_uuid: str, # UUID de l'usuari
    workout_uuid: str, # UUID de l'entrenament de la recomanació a eliminar (paràmetre de consulta o cos)
    trainer_user: UserModel = Depends(get_trainer_user), # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
):
    """
    Elimina una recomanació d'entrenament específica feta per l'entrenador actual a un usuari.

    Args:
        user_uuid: L'UUID de l'usuari.
        workout_uuid: L'UUID de l'entrenament recomanat a eliminar.
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si la recomanació no es troba (404).
    """
    # Cerca la recomanació específica
    query = (
        select(TrainerRecommendationModel)
        .where(TrainerRecommendationModel.trainer_uuid == trainer_user.uuid)
        .where(TrainerRecommendationModel.user_uuid == UUID(user_uuid))
        .where(TrainerRecommendationModel.workout_uuid == UUID(workout_uuid))
    )
    recommendation = session.exec(query).first()

    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found") # Recomanació no trobada

    session.delete(recommendation) # Elimina la recomanació
    session.commit() # Guarda els canvis


@router.get(
    "/trainer/users/{user_uuid}/templates",
    response_model=list[WorkoutContentSchema], # La resposta és una llista de WorkoutContentSchema
    name="Get unrecommended workout templates for user", # Nom de la ruta
    tags=["Trainer"],
)
async def get_unrecommended_templates(
    user_uuid: str, # UUID de l'usuari per al qual buscar plantilles no recomanades
    trainer_user: UserModel = Depends(get_trainer_user), # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> List[WorkoutContentModel]: # El tipus de retorn és una llista de WorkoutContentModel
    """
    Obté una llista de plantilles d'entrenament creades per l'entrenador actual
    que encara no han estat recomanades a un usuari específic.

    Args:
        user_uuid: L'UUID de l'usuari.
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista de plantilles d'entrenament no recomanades a l'usuari.
    """
    # Construeix una consulta complexa per trobar plantilles no recomanades
    query = (
        select(WorkoutContentModel)
        # Outer join per identificar plantilles (no tenen instància)
        .outerjoin(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        # Outer join per identificar plantilles no recomanades a aquest usuari per aquest entrenador
        .outerjoin(
            TrainerRecommendationModel,
            and_( # Condicions múltiples per a l'outer join de recomanacions
                TrainerRecommendationModel.workout_uuid == WorkoutContentModel.uuid,  # pyright: ignore[]
                TrainerRecommendationModel.user_uuid == UUID(user_uuid),  # pyright: ignore[]
                TrainerRecommendationModel.trainer_uuid == trainer_user.uuid,  # pyright: ignore[]
            ),
        )
        .where(WorkoutInstanceModel.workout_uuid == None) # Filtra per plantilles (sense instància)
        .where(TrainerRecommendationModel.workout_uuid == None) # Filtra per no recomanades (no hi ha entrada a TrainerRecommendationModel)
        .where(WorkoutContentModel.creator_uuid == trainer_user.uuid) # Filtra per plantilles creades per l'entrenador actual
        .order_by(WorkoutContentModel.name) # Ordena per nom de la plantilla
    )
    results = session.exec(query).all() # Executa la consulta
    return results


@router.get(
    "/user/trainer/search",
    response_model=list[UserModel], # La resposta és una llista de UserModel (representant entrenadors)
    name="Search for trainers by user interests", 
    tags=["Trainer/User"], 
)
async def search_trainers(
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> List[UserModel]: # El tipus de retorn és una llista de UserModel
    """
    Permet a un usuari cercar entrenadors que comparteixin els seus interessos seleccionats.
    Retorna entrenadors que tinguin tots els interessos que l'usuari ha marcat.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista d'usuaris (que són entrenadors) que coincideixen amb els criteris de cerca.
    """
    # Obté els UUIDs dels interessos seleccionats per l'usuari actual
    selected_interests_query = (
        select(UserInterestLinkModel.interest_uuid).where( # Selecciona només l'interest_uuid
            UserInterestLinkModel.user_uuid == current_user.uuid
        )  # pyright: ignore[]
    )
    selected_interests_uuids = [
        item for item in session.exec(selected_interests_query).all() # Obté una llista d'UUIDs
    ]

    if not selected_interests_uuids: # Si l'usuari no té interessos seleccionats, retorna llista buida
        return []

    # Subconsulta per trobar usuaris (potencials entrenadors) que tenen TOTS els interessos seleccionats per l'usuari actual
    users_with_all_selected_interests_subquery = (
        select(UserInterestLinkModel.user_uuid) # Selecciona l'UUID de l'usuari (entrenador potencial)
        .where(UserInterestLinkModel.interest_uuid.in_(selected_interests_uuids))  # Filtra per interessos que coincideixen amb els de l'usuari # pyright: ignore[]
        .group_by(UserInterestLinkModel.user_uuid)  # Agrupa per usuari (entrenador potencial) # pyright: ignore[]
        .having( # Comprobar que el nombre d'interessos diferents ha de ser igual al nombre d'interessos seleccionats per l'usuari
            func.count(func.distinct(UserInterestLinkModel.interest_uuid))
            == len(selected_interests_uuids)
        )
    )

    # Consulta principal per obtenir els detalls dels entrenadors
    query = (
        select(UserModel) # Selecciona el model d'usuari complet
        .join(
            TrainerModel, # Assegura que l'usuari sigui un entrenador
            UserModel.uuid == TrainerModel.user_uuid,  # pyright: ignore[]
        )
        .join(
            UserConfig, # Per comprovar si el compte de l'entrenador està actiu
            UserModel.uuid == UserConfig.user_uuid,  # pyright: ignore[]
        )
        .where(UserConfig.is_disabled == False) # Filtra per entrenadors actius
        .where(UserModel.uuid.in_(users_with_all_selected_interests_subquery))  # Filtra per entrenadors que compleixen el criteri d'interessos # pyright: ignore[]
        .where(UserModel.uuid != current_user.uuid) # Exclou l'usuari actual dels resultats
    )

    users = session.exec(query).all() # Executa la consulta
    return users


@router.post(
    "/user/trainer/request",
    name="Create a request",
    tags=["Trainer/User"],
)
async def create_request(
    trainer_uuid: str, # UUID de l'entrenador a qui s'envia la sol·licitud (paràmetre de consulta)
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
):
    """
    Permet a un usuari enviar una sol·licitud a un entrenador específic.

    Args:
        trainer_uuid: L'UUID de l'entrenador a qui s'envia la sol·licitud.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari ja té un entrenador (409) o si ja té una sol·licitud pendent (409).
    """
    if current_user.trainer_uuid: # Comprova si l'usuari ja té un entrenador
        raise HTTPException(
            status_code=409, detail="You are already paired with a trainer." # Ja estàs vinculat a un entrenador
        )

    # Comprova si ja existeix una sol·licitud pendent d'aquest usuari
    query_existing_request = (
        select(TrainerRequestModel)
        .where(TrainerRequestModel.user_uuid == current_user.uuid)
        .where(TrainerRequestModel.is_processed == False) # Sol·licitud no processada
    )
    existing_request = session.exec(query_existing_request).first()

    if existing_request:
        raise HTTPException(
            status_code=409, detail="You already have a pending request." 
        )

    # Crea la nova sol·licitud
    new_request = TrainerRequestModel(
        trainer_uuid=UUID(trainer_uuid), # UUID de l'entrenador destinatari
        user_uuid=current_user.uuid, # UUID de l'usuari que fa la sol·licitud
        created_at=int(datetime.now().timestamp()), # Marca de temps de creació, en mil·lisegons (convertida a enter)
    )

    session.add(new_request) # Afegeix a la sessió
    session.commit() # Persisteix a la BD


@router.get(
    "/user/trainer/status",
    response_model=UserModel, # La resposta és UserModel (de l'entrenador a qui es va fer la sol·licitud)
    name="Get user's request status to a trainer",
    tags=["Trainer/User"],
)
async def get_request_status(
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> UserModel: # El tipus de retorn és UserModel
    """
    Obté l'estat de la sol·licitud pendent de l'usuari actual a un entrenador.
    Si hi ha una sol·licitud pendent, retorna la informació de l'entrenador sol·licitat.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari ja té un entrenador (409) o si no es troba cap sol·licitud pendent (404).

    Returns:
        La informació de l'entrenador a qui s'ha enviat la sol·licitud pendent.
    """
    if current_user.trainer_uuid: # Si l'usuari ja té un entrenador, no hauria de tenir sol·licituds pendents
        raise HTTPException(
            status_code=409, detail="You are already paired with a trainer." # Ja estàs vinculat a un entrenador
        )

    # Cerca la informació de l'entrenador a partir de la sol·licitud pendent de l'usuari
    query = (
        select(UserModel) # Selecciona la informació de l'entrenador (UserModel)
        .join(TrainerRequestModel, UserModel.uuid == TrainerRequestModel.trainer_uuid)  # Fa un join amb TrainerRequestModel per enllaçar l'entrenador # pyright: ignore[]
        .where(TrainerRequestModel.user_uuid == current_user.uuid) # Filtra per la sol·licitud de l'usuari actual
        .where(TrainerRequestModel.is_processed == False) # Assegura que la sol·licitud estigui pendent
    )
    trainer_of_pending_request = session.exec(query).first() # Obté l'entrenador

    if not trainer_of_pending_request:
        raise HTTPException(status_code=404, detail="No pending request found.") # No s'ha trobat cap sol·licitud pendent

    return trainer_of_pending_request


@router.get(
    "/user/trainer/info",
    response_model=UserModel, # La resposta és UserModel (de l'entrenador vinculat)
    name="Get user's current trainer info",
    tags=["Trainer/User"],
)
async def get_trainer_info(
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> UserModel: # El tipus de retorn és UserModel
    """
    Obté informació sobre l'entrenador actualment vinculat a l'usuari.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari no està vinculat a cap entrenador (404) o si l'entrenador no es troba (404).

    Returns:
        La informació de l'entrenador vinculat.
    """
    if not current_user.trainer_uuid: # Comprova si l'usuari té un entrenador assignat
        raise HTTPException(
            status_code=404, detail="You are not paired with a trainer." # No estàs vinculat a cap entrenador
        )

    # Obté la informació de l'entrenador a partir de l'UUID emmagatzemat a l'usuari
    query = select(UserModel).where(UserModel.uuid == current_user.trainer_uuid)
    trainer = session.exec(query).first()

    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found.")

    return trainer


@router.post(
    "/user/trainer/cancel-request",
    name="User cancels their request to a trainer",
    tags=["Trainer/User"],
)
async def cancel_request(
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
):
    """
    Permet a un usuari cancel·lar la seva sol·licitud pendent a un entrenador.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari ja està vinculat a un entrenador (409) o si no es troba cap sol·licitud pendent (404).
    """
    if current_user.trainer_uuid: # Si ja té entrenador, no hauria de poder cancel·lar una sol·licitud
        raise HTTPException(
            status_code=409, detail="You are already paired with a trainer."
        )

    # Cerca la sol·licitud pendent de l'usuari
    query = (
        select(TrainerRequestModel)
        .where(TrainerRequestModel.user_uuid == current_user.uuid)
        .where(TrainerRequestModel.is_processed == False)
    )
    request = session.exec(query).first()

    if not request:
        raise HTTPException(status_code=404, detail="No pending request found to cancel.") # No s'ha trobat cap sol·licitud pendent per cancel·lar

    request.is_processed = True # Marca la sol·licitud com a processada (efectivament cancelant-la)

    session.add(request) # Afegeix la sol·licitud actualitzada
    session.commit() # Guarda els canvis


@router.post(
    "/user/trainer/unpair",
    name="User unpairs with their current trainer",
    tags=["Trainer/User"],
)
async def unpair_with_trainer(
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
):
    """
    Permet a un usuari desvincular-se del seu entrenador actual.
    Això també elimina totes les recomanacions rebudes d'aquest entrenador.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari no està vinculat a cap entrenador (404).
    """
    if not current_user.trainer_uuid: # Comprova si l'usuari té un entrenador
        raise HTTPException(
            status_code=404, detail="You are not paired with a trainer to unpair."
        )

    # Cerca i elimina totes les recomanacions entre l'usuari i el seu entrenador actual
    recommendations_query = (
        select(TrainerRecommendationModel)
        .where(TrainerRecommendationModel.user_uuid == current_user.uuid)
        .where(TrainerRecommendationModel.trainer_uuid == current_user.trainer_uuid)
    )
    recommendations_results = session.exec(recommendations_query).all()

    for recommendation in recommendations_results: # Elimina cada recomanació
        session.delete(recommendation)

    current_user.trainer_uuid = None # Elimina la vinculació de l'entrenador a l'usuari

    session.add(current_user) # Afegeix l'usuari actualitzat
    session.commit() # Guarda tots els canvis


@router.get(
    "/user/trainer/recommendation",
    response_model=list[WorkoutContentSchema], # La resposta és una llista de WorkoutContentSchema
    name="Get workout recommendations for user from their trainer", # Nom de la ruta
    tags=["Trainer/User"],
)
async def view_user_recommendations(
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> List[WorkoutContentModel]: # El tipus de retorn és una llista de WorkoutContentModel
    """
    Obté totes les recomanacions d'entrenament que l'usuari actual ha rebut del seu entrenador vinculat.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista de continguts d'entrenament recomanats.
    """
    if not current_user.trainer_uuid: # Si no té entrenador, no pot tenir recomanacions d'un
        return []

    # Construeix la consulta per obtenir les recomanacions
    query = (
        select(WorkoutContentModel) # Selecciona el contingut de l'entrenament
        .join(
            TrainerRecommendationModel, # Fa un join amb la taula de recomanacions
            WorkoutContentModel.uuid == TrainerRecommendationModel.workout_uuid,  # pyright: ignore[]
        )
        .where(TrainerRecommendationModel.user_uuid == current_user.uuid) # Filtra per l'usuari actual
        .where(TrainerRecommendationModel.trainer_uuid == current_user.trainer_uuid) # Filtra per l'entrenador de l'usuari actual
    )
    results = session.exec(query).all() # Executa la consulta
    return results


@router.get(
    "/user/trainer/recommendation/{workout_uuid}",
    response_model=WorkoutContentSchema, # La resposta és un WorkoutContentSchema
    name="Get specific workout recommendation for user",
    tags=["Trainer/User"],
)
async def view_user_recommendation(
    workout_uuid: str, # UUID de l'entrenament recomanat a visualitzar
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> WorkoutContentModel: # El tipus de retorn és WorkoutContentModel
    """
    Obté una recomanació d'entrenament específica rebuda per l'usuari actual del seu entrenador.

    Args:
        workout_uuid: L'UUID de l'entrenament recomanat.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'entrenament recomanat no es troba (404) o l'usuari no té entrenador.

    Returns:
        El contingut de l'entrenament recomanat.
    """
    if not current_user.trainer_uuid:
        raise HTTPException(status_code=404, detail="User is not paired with a trainer.") # L'usuari no està vinculat a un entrenador

    # Construeix la consulta per a una recomanació específica
    query = (
        select(WorkoutContentModel)
        .join(
            TrainerRecommendationModel,
            WorkoutContentModel.uuid == TrainerRecommendationModel.workout_uuid,  # pyright: ignore[]
        )
        .where(TrainerRecommendationModel.user_uuid == current_user.uuid)
        .where(TrainerRecommendationModel.trainer_uuid == current_user.trainer_uuid)
        .where(TrainerRecommendationModel.workout_uuid == UUID(workout_uuid)) # Filtra per l'UUID de l'entrenament específic
    )
    result = session.exec(query).first() # Obté el resultat

    if not result:
        raise HTTPException(status_code=404, detail="Recommended workout not found.") # Entrenament recomanat no trobat

    return result


@router.get(
    "/user/trainer/interests",
    response_model=list[UserInterestSchema], # La resposta és una llista de UserInterestSchema
    name="Get all available interests and user's selected interests",
    tags=["Trainer/User"],
)
async def get_interests(
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
) -> List[UserInterestSchema]: # El tipus de retorn és una llista de UserInterestSchema
    """
    Obté una llista de tots els interessos disponibles en el sistema,
    indicant quins d'ells ha seleccionat l'usuari actual.

    Args:
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista d'interessos, cadascun amb un camp 'selected' que indica si l'usuari l'ha triat.
    """
    # Obté tots els interessos disponibles del sistema
    all_interests = session.exec(select(UserInterestModel)).all()

    # Obté els UUIDs dels interessos seleccionats per l'usuari actual
    selected_interests_link_query = (
        select(UserInterestLinkModel.interest_uuid) # Selecciona només l'interest_uuid
        .where(UserInterestLinkModel.user_uuid == current_user.uuid)
    )
    selected_interests_uuids = { # Utilitza un set per a una cerca eficient
        link_uuid for link_uuid in session.exec(selected_interests_link_query).all()
    }

    # Construeix la llista de resultats, marcant cada interès com a seleccionat o no
    result_list = []
    for interest in all_interests:
        is_selected = interest.uuid in selected_interests_uuids # Comprova si l'UUID de l'interès està en el set d'interessos seleccionats
        interest_schema = UserInterestSchema(
            uuid=interest.uuid,
            name=interest.name,
            selected=is_selected,
        )
        result_list.append(interest_schema)

    return result_list


@router.post(
    "/user/trainer/interests",
    name="Update user's selected interests",
    tags=["Trainer/User"],
)
async def set_interests(
    selected_interests_uuid: list[str], # Llista d'UUIDs dels interessos seleccionats (del cos de la petició)
    current_user: UserModel = Depends(get_current_active_user), # Injecta l'usuari actiu actual
    session: Session = Depends(get_session), # Injecta una sessió de base de dades
):
    """
    Actualitza la llista d'interessos seleccionats per l'usuari actual.
    Els interessos anteriors s'eliminen i es reemplacen pels nous.

    Args:
        selected_interests_uuid: Una llista d'UUIDs (com a cadenes) que representen els nous interessos seleccionats.
        current_user: L'usuari actualment autenticat.
        session: La sessió de base de dades.
    """
    # Elimina tots els enllaços d'interès existents per a l'usuari actual
    current_user_interest_links_query = (
        select(UserInterestLinkModel).where(
            UserInterestLinkModel.user_uuid == current_user.uuid
        )  # pyright: ignore[]
    )
    existing_links = session.exec(current_user_interest_links_query).all()

    for link in existing_links: # Elimina cada enllaç existent
        session.delete(link)

    # Afegeix els nous enllaços d'interès basats en la llista proporcionada
    for interest_uuid_str in selected_interests_uuid:
        new_link = UserInterestLinkModel(
            user_uuid=current_user.uuid, interest_uuid=UUID(interest_uuid_str) # Converteix la cadena UUID a objecte UUID
        )
        session.add(new_link) # Afegeix el nou enllaç

    session.commit() # Guarda tots els canvis 