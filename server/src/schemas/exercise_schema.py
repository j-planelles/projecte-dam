from uuid import UUID as UUID_TYPE

from pydantic import BaseModel
from sqlmodel import Field, SQLModel

from schemas.types.enums import BodyPart, ExerciseType


class DefaultExerciseSchema(SQLModel):
    name: str
    description: str | None = None


class ExerciseSchema(DefaultExerciseSchema):
    uuid: UUID_TYPE
    userNote: str | None = None
    isDisabled: bool = Field(default=False)
    deafult_exercise_uuid: UUID_TYPE | None = Field(
        foreign_key="default_exercise.uuid", default=None
    )


class ExerciseInputSchema(BaseModel):
    uuid: UUID_TYPE | None = None
    userNote: str | None = None
    name: str
    description: str | None = None
    bodyPart: BodyPart
    type: ExerciseType
