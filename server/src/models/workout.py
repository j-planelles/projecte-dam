from uuid import UUID as UUID_TYPE
from uuid import uuid4

import sqlalchemy as sa
from schemas.types.enums import WeightUnit
from schemas.workout_schema import (
    WorkoutInstanceSchema,
    WorkoutTemplateSchema,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import (
    Column,
    Enum,
    Field,
    ForeignKeyConstraint,
    Relationship,
    SQLModel,
)


class WorkoutContentModel(WorkoutTemplateSchema, table=True):
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

    instance: "WorkoutInstanceModel" = Relationship(
        sa_relationship_kwargs={"uselist": False}
    )

    entries: list["WorkoutEntryModel"] = Relationship()

    gym: "GymModel | None" = Relationship()


class WorkoutInstanceModel(WorkoutInstanceSchema, table=True):
    __tablename__ = "workout_instance"  # pyright: ignore[]
    workout_uuid: UUID_TYPE = Field(
        foreign_key="workout_content.uuid", primary_key=True
    )


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
    exercise: "ExerciseModel" = Relationship(sa_relationship_kwargs={"uselist": False})

    sets: list["WorkoutSetModel"] = Relationship(back_populates="entry")


class WorkoutSetModel(SQLModel, table=True):
    __tablename__ = "workout_set"  # pyright: ignore[]
    workout_uuid: UUID_TYPE = Field(primary_key=True)
    entry_index: int = Field(primary_key=True)
    index: int = Field(primary_key=True)

    reps: int | None = None
    weight: float | None = None

    entry: "WorkoutEntryModel" = Relationship(back_populates="sets")

    __table_args__ = (
        ForeignKeyConstraint(
            ["workout_uuid", "entry_index"],
            ["workout_entry.workout_uuid", "workout_entry.index"],
        ),
    )


from models.gym import GymModel
from models.exercise import ExerciseModel
