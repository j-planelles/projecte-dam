from datetime import datetime
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import Session, asc, select

from db import get_session
from models.chat import MessageModel
from models.users import UserModel
from security import get_current_active_user, get_trainer_user


router = APIRouter()


@router.get(
    "/user/trainer/messages",
    name="Get messages from trainer",
    tags=["Trainer/User"],
    response_model=list[MessageModel],
)
async def get_messages_user(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(MessageModel)
        .where(MessageModel.user_uuid == current_user.uuid)
        .where(MessageModel.trainer_uuid == current_user.trainer_uuid)
        .order_by(asc(MessageModel.timestamp))
    )

    users = session.exec(query).all()

    return users


@router.post(
    "/user/trainer/messages",
    name="Send message to trainer",
    tags=["Trainer/User"],
)
async def send_message_user(
    content: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    new_message = MessageModel(
        user_uuid=current_user.uuid,
        trainer_uuid=current_user.trainer_uuid,  # pyright: ignore[]
        timestamp=int(datetime.now().timestamp()),
        content=content,
        is_sent_by_trainer=False,
    )

    session.add(new_message)
    session.commit()


@router.get(
    "/trainer/users/{user_uuid}/messages",
    name="Get messages from user",
    tags=["Trainer"],
    response_model=list[MessageModel],
)
async def get_messages_trainer(
    user_uuid: str,
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = (
        select(MessageModel)
        .where(MessageModel.user_uuid == user_uuid)
        .where(MessageModel.trainer_uuid == trainer_user.uuid)
        .order_by(asc(MessageModel.timestamp))
    )

    users = session.exec(query).all()

    return users


@router.post(
    "/trainer/users/{user_uuid}/messages",
    name="Send message to user",
    tags=["Trainer"],
)
async def send_message_trainer(
    user_uuid: str,
    content: str,
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    print(f"trainer: {trainer_user}")
    new_message = MessageModel(
        user_uuid=UUID(user_uuid),
        trainer_uuid=trainer_user.uuid,
        timestamp=int(datetime.now().timestamp()),
        content=content,
        is_sent_by_trainer=True,
    )

    session.add(new_message)
    session.commit()
