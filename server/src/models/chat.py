from uuid import UUID as UUID_TYPE
from sqlmodel import BigInteger, Column, Field, Relationship, SQLModel, UniqueConstraint

from models.users import TrainerModel, UserModel


class MessageModel(SQLModel, table=True):
    __tablename__ = "message"  # pyright: ignore[]
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)
    trainer_uuid: UUID_TYPE = Field(foreign_key="trainer.user_uuid", primary_key=True)

    user: UserModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[MessageModel.user_uuid]",
        }
    )
    trainer: TrainerModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[MessageModel.trainer_uuid]",
        }
    )

    timestamp: int = Field(sa_column=Column(BigInteger(), primary_key=True))

    content: str

    is_sent_by_trainer: bool

    __table_args__ = (UniqueConstraint("user_uuid", "trainer_uuid", "timestamp"),)
