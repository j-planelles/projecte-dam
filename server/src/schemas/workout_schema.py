from typing import List
from uuid import UUID as UUID_TYPE

from sqlmodel import BigInteger, Column, Field, Numeric, SQLModel

from schemas.exercise_schema import ExerciseInputSchema
from schemas.gym_schema import GymSchema
from schemas.types.enums import WeightUnit


class WorkoutSetSchema(SQLModel):
    reps: int | None = None
    weight: float


class WorkoutEntrySchema(SQLModel):
    rest_countdown_duration: int | None = None
    note: str | None = None
    weight_unit: WeightUnit | None = None

    exercise: ExerciseInputSchema
    sets: List[WorkoutSetSchema]


class WorkoutInstanceSchema(SQLModel):
    timestamp_start: int = Field(sa_column=Column(BigInteger()))
    duration: int


class WorkoutContentSchema(SQLModel):
    uuid: UUID_TYPE | None = None
    name: str
    description: str | None = None
    isPublic: bool = Field(default=False)

    instance: WorkoutInstanceSchema | None = None
    entries: list[WorkoutEntrySchema]

    gym_id: UUID_TYPE | None = None
    gym: GymSchema | None = None


class WorkoutTemplateSchema(WorkoutContentSchema):
    instance: None = None
