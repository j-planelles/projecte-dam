from datetime import datetime
from uuid import UUID

from db import get_session
from fastapi import APIRouter, Depends, HTTPException
from models.chat import MessageModel
from models.users import UserModel
from security import get_current_active_user, get_trainer_user
from sqlmodel import Session, asc, select

# Creació d'un router FastAPI per agrupar les rutes relacionades amb els missatges
router = APIRouter()


@router.get(
    "/user/trainer/messages",
    name="Get messages from trainer for current user",  # Nom de la ruta per a la documentació OpenAPI
    tags=["Trainer/User"],  # Etiqueta per agrupar rutes a la documentació OpenAPI
    response_model=list[
        MessageModel
    ],  # El tipus de resposta esperat és una llista de MessageModel
)
async def get_messages_user(
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> list[
    MessageModel
]:  # El tipus de retorn de la funció és una llista de MessageModel
    """
    Obté tots els missatges entre l'usuari actual i el seu entrenador vinculat,
    ordenats cronològicament.

    Args:
        current_user: L'usuari actualment autenticat. Ha de tenir un entrenador vinculat.
        session: La sessió de base de dades.

    Returns:
        Una llista de missatges. Retorna una llista buida si no hi ha entrenador o missatges.
    """
    if not current_user.trainer_uuid:  # Comprova si l'usuari té un entrenador assignat
        return []  # Si no té entrenador, no pot haver-hi missatges amb ell

    # Construeix la consulta per seleccionar els missatges
    query = (
        select(MessageModel)
        .where(
            MessageModel.user_uuid == current_user.uuid
        )  # Filtra pels missatges on l'usuari és el 'user_uuid'
        .where(
            MessageModel.trainer_uuid == current_user.trainer_uuid
        )  # Filtra pels missatges on l'entrenador és el 'trainer_uuid' de l'usuari
        .order_by(
            asc(MessageModel.timestamp)
        )  # Ordena els missatges per la marca de temps en ordre ascendent (més antics primer)
    )

    messages = session.exec(
        query
    ).all()  # Executa la consulta i obté tots els resultats

    return messages


@router.post(
    "/user/trainer/messages",
    name="Send message from current user to their trainer",
    tags=["Trainer/User"],
)
async def send_message_user(
    content: str,  # Contingut del missatge (paràmetre de cerca)
    current_user: UserModel = Depends(
        get_current_active_user
    ),  # Injecta l'usuari actiu actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
):
    """
    Permet a l'usuari actual enviar un missatge al seu entrenador vinculat.

    Args:
        content: El text del missatge a enviar.
        current_user: L'usuari actualment autenticat. Ha de tenir un entrenador vinculat.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari no està vinculat a cap entrenador (codi 400).
    """
    if not current_user.trainer_uuid:  # Comprova si l'usuari té un entrenador
        raise HTTPException(
            status_code=400, detail="User is not paired with a trainer."
        )  # L'usuari no està vinculat a un entrenador

    # Crea un nou objecte MessageModel
    new_message = MessageModel(
        user_uuid=current_user.uuid,  # L'UUID de l'usuari actual
        trainer_uuid=current_user.trainer_uuid,  # L'UUID de l'entrenador de l'usuari actual # pyright: ignore[]
        timestamp=int(
            datetime.now().timestamp()
        ),  # Marca de temps actual (convertida a enter)
        content=content,  # El contingut del missatge
        is_sent_by_trainer=False,  # El missatge és enviat per l'usuari, no per l'entrenador
    )

    session.add(new_message)  # Afegeix el nou missatge a la sessió
    session.commit()  # Guarda el missatge a la base de dades


@router.get(
    "/trainer/users/{user_uuid}/messages",
    name="Get messages from a specific user for current trainer",  # Nom de la ruta
    tags=["Trainer"],  # Etiqueta per a la documentació
    response_model=list[MessageModel],  # La resposta serà una llista de MessageModel
)
async def get_messages_trainer(
    user_uuid: str,  # L'UUID de l'usuari del qual obtenir els missatges (paràmetre de ruta)
    trainer_user: UserModel = Depends(
        get_trainer_user
    ),  # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
) -> list[MessageModel]:  # El tipus de retorn és una llista de MessageModel
    """
    Obté tots els missatges entre un usuari específic (vinculat a l'entrenador)
    i l'entrenador actual, ordenats cronològicament.

    Args:
        user_uuid: L'UUID de l'usuari amb qui l'entrenador vol veure els missatges.
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.

    Returns:
        Una llista de missatges.
    """
    # Construeix la consulta per seleccionar els missatges
    query = (
        select(MessageModel)
        .where(
            MessageModel.user_uuid == UUID(user_uuid)
        )  # Filtra pels missatges de l'usuari especificat
        .where(
            MessageModel.trainer_uuid == trainer_user.uuid
        )  # Filtra pels missatges on l'entrenador és l'entrenador actual
        .order_by(
            asc(MessageModel.timestamp)
        )  # Ordena els missatges per marca de temps ascendent
    )

    messages = session.exec(query).all()  # Executa la consulta

    return messages


@router.post(
    "/trainer/users/{user_uuid}/messages",
    name="Send message from current trainer to a specific user",
    tags=["Trainer"],
)
async def send_message_trainer(
    user_uuid: str,  # L'UUID de l'usuari a qui enviar el missatge (paràmetre de ruta)
    content: str,  # Contingut del missatge (paràmetre de cerca)
    trainer_user: UserModel = Depends(
        get_trainer_user
    ),  # Injecta l'usuari entrenador actual
    session: Session = Depends(get_session),  # Injecta una sessió de base de dades
):
    """
    Permet a l'entrenador actual enviar un missatge a un usuari específic
    que té vinculat.

    Args:
        user_uuid: L'UUID de l'usuari destinatari.
        content: El text del missatge a enviar.
        trainer_user: L'usuari entrenador actualment autenticat.
        session: La sessió de base de dades.
    """
    # Crea un nou objecte MessageModel
    new_message = MessageModel(
        user_uuid=UUID(user_uuid),  # L'UUID de l'usuari destinatari
        trainer_uuid=trainer_user.uuid,  # L'UUID de l'entrenador actual (remitent)
        timestamp=int(datetime.now().timestamp()),  # Marca de temps actual
        content=content,  # El contingut del missatge
        is_sent_by_trainer=True,  # El missatge és enviat per l'entrenador
    )

    session.add(new_message)  # Afegeix el nou missatge a la sessió
    session.commit()  # Guarda el missatge a la base de dades
