from uuid import UUID as UUID_TYPE
from uuid import uuid4

import sqlalchemy as sa
from schemas.exercise_schema import DefaultExerciseSchema, ExerciseSchema
from schemas.types.enums import BodyPart, ExerciseType
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Column, Enum, Field


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
