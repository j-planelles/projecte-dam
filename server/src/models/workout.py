from typing import Optional
from uuid import UUID as UUID_TYPE
from uuid import uuid4

from pydantic import ConfigDict

from schemas.types.enums import SetType, WeightUnit
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import (
    BigInteger,
    Column,
    Enum,
    Field,
    ForeignKeyConstraint,
    Numeric,
    Relationship,
    SQLModel,
)


class WorkoutContentModel(SQLModel, table=True):
    __tablename__ = "workout_content"  # pyright: ignore[]
    uuid: UUID_TYPE = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True),  # Use the PG UUID type
            primary_key=True,
            default=uuid4,
            index=True,
            nullable=False,
        )
    )

    name: str
    description: str | None = None
    isPublic: bool = Field(default=False)

    creator_uuid: UUID_TYPE = Field(foreign_key="users.uuid")

    instance: "WorkoutInstanceModel" = Relationship(
        sa_relationship_kwargs={"uselist": False}
    )

    entries: list["WorkoutEntryModel"] = Relationship()

    gym_id: Optional[UUID_TYPE] = Field(default=None, foreign_key="gym.uuid")
    gym: Optional["GymModel"] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[WorkoutContentModel.gym_id]"}
    )


class WorkoutInstanceModel(SQLModel, table=True):
    __tablename__ = "workout_instance"  # pyright: ignore[]
    # model_config = ConfigDict(arbitrary_types_allowed=True)  # pyright: ignore[]
    workout_uuid: UUID_TYPE = Field(
        foreign_key="workout_content.uuid", primary_key=True
    )
    timestamp_start: int = Field(sa_column=Column(BigInteger()))
    duration: int


class WorkoutEntryModel(SQLModel, table=True):
    __tablename__ = "workout_entry"  # pyright: ignore[]
    workout_uuid: UUID_TYPE = Field(
        foreign_key="workout_content.uuid", primary_key=True
    )
    index: int = Field(primary_key=True)

    rest_countdown_duration: int | None = None
    note: str | None = None

    weight_unit: WeightUnit | None = Field(
        sa_column=Column(Enum(WeightUnit), nullable=True), default=None
    )
    exercise_uuid: UUID_TYPE = Field(foreign_key="exercise.uuid")
    exercise: "ExerciseModel" = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[WorkoutEntryModel.exercise_uuid]"}
    )

    sets: list["WorkoutSetModel"] = Relationship(back_populates="entry")


class WorkoutSetModel(SQLModel, table=True):
    __tablename__ = "workout_set"  # pyright: ignore[]
    workout_uuid: UUID_TYPE = Field(primary_key=True)
    entry_index: int = Field(primary_key=True)
    index: int = Field(primary_key=True)

    reps: int | None = None
    weight: float | None = None
    set_type: SetType = Field(sa_column=Column(Enum(SetType)), default=SetType.NORMAL)

    entry: "WorkoutEntryModel" = Relationship(back_populates="sets")

    __table_args__ = (
        ForeignKeyConstraint(
            ["workout_uuid", "entry_index"],
            ["workout_entry.workout_uuid", "workout_entry.index"],
        ),
    )


from models.exercise import ExerciseModel
from models.gym import GymModel
