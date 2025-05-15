from uuid import UUID as UUID_TYPE

from pydantic import BaseModel
from sqlmodel import Field, SQLModel

from schemas.types.enums import BodyPart, ExerciseType


class DefaultExerciseSchema(SQLModel):
    name: str
    description: str | None = None


class ExerciseSchema(DefaultExerciseSchema):
    uuid: UUID_TYPE
    is_disabled: bool = Field(default=False)
    default_exercise_uuid: UUID_TYPE | None = Field(
        foreign_key="default_exercise.uuid", default=None
    )
    body_part: BodyPart
    type: ExerciseType


class ExerciseInputSchema(BaseModel):
    uuid: UUID_TYPE | None = None
    name: str
    description: str | None = None
    body_part: BodyPart
    type: ExerciseType
    default_exercise_uuid: UUID_TYPE | None = None
