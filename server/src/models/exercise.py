from uuid import UUID as UUID_TYPE
import sqlalchemy as sa
from uuid import uuid4

from schemas.exercise_schema import DefaultExerciseSchema, ExerciseSchema
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Column, Enum, Field

from schemas.types.enums import BodyPart, ExerciseType


class ExerciseModel(ExerciseSchema, table=True):
    __tablename__ = "exercise"  # pyright: ignore[]
    uuid: UUID_TYPE = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True),  # Use the PG UUID type
            primary_key=True,
            default=uuid4,
            index=True,
            nullable=False,
        )
    )
    bodyPart: BodyPart = Field(sa_column=sa.Column(Enum(BodyPart), nullable=False))
    type: ExerciseType = Field(sa_column=sa.Column(Enum(ExerciseType), nullable=False))


class DefaultExerciseModel(DefaultExerciseSchema, table=True):
    __tablename__ = "default_exercise"  # pyright: ignore[]
    uuid: UUID_TYPE = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True),  # Use the PG UUID type
            primary_key=True,
            default=uuid4,
            index=True,
            nullable=False,
        )
    )
    bodyPart: BodyPart = Field(sa_column=sa.Column(Enum(BodyPart), nullable=False))
    type: ExerciseType = Field(sa_column=sa.Column(Enum(ExerciseType), nullable=False))
