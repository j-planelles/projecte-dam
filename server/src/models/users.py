from typing import Optional
from uuid import UUID as UUID_TYPE
from uuid import uuid4

from schemas.user_schema import UserSchema
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Column, Field, Relationship, SQLModel


class UserModel(UserSchema, table=True):
    __tablename__ = "users"  # pyright: ignore[]
    uuid: UUID_TYPE = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True),
            primary_key=True,
            default=uuid4,
            index=True,
            nullable=False,
        )
    )
    hashed_password: str
    is_disabled: bool = Field(default=False)

    trainer: Optional["TrainerModel"] = Relationship()

    regular_gym_id: Optional[UUID_TYPE] = Field(default=None, foreign_key="gym.uuid")
    regular_gym: Optional["GymModel"] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[UserModel.regular_gym_id]"}
    )


class TrainerModel(SQLModel, table=True):
    __tablename__ = "trainer"  # pyright: ignore[]
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)

    user: "UserModel" = Relationship(
        sa_relationship_kwargs={"uselist": False, "overlaps": "trainer"}
    )


class GymOwnerModel(SQLModel, table=True):
    __tablename__ = "gym_owner"  # pyright: ignore[]
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)

    user: UserModel = Relationship(sa_relationship_kwargs={"uselist": False})

    gyms: list["GymModel"] = Relationship(
        back_populates="owner",
        sa_relationship_kwargs={"foreign_keys": "[GymModel.owner_uuid]"},
    )


class AdminModel(SQLModel, table=True):
    __tablename__ = "admin"  # pyright: ignore[]
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)

    user: UserModel = Relationship(sa_relationship_kwargs={"uselist": False})


from models.gym import GymModel
