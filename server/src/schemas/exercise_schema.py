from uuid import UUID as UUID_TYPE

import sqlalchemy as sa
from sqlmodel import Field, SQLModel, Enum

from schemas.types.enums import BodyPart, ExerciseType


class DefaultExerciseSchema(SQLModel):
    name: str
    description: str | None = None
    # bodyPart: BodyPart = Field(sa_column=sa.Column(Enum(BodyPart), nullable=False))
    # type: ExerciseType = Field(sa_column=sa.Column(Enum(ExerciseType), nullable=False))
    deafult_exercise_uuid: UUID_TYPE | None = Field(
        foreign_key="default_exercise.uuid", default=None
    )


class ExerciseSchema(DefaultExerciseSchema):
    userNote: str | None = None
    isDisabled: bool = Field(default=False)
