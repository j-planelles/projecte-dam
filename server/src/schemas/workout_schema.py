from datetime import datetime
from typing import List
from uuid import uuid4

from pydantic import BaseModel
from sqlmodel import Field, SQLModel

from schemas.exercise_schema import ExerciseInputSchema
from schemas.types.enums import BodyPart, ExerciseType, WeightUnit


class WorkoutTemplateSchema(SQLModel):
    name: str
    description: str | None = None
    isPublic: bool = Field(default=False)


class WorkoutInstanceSchema(SQLModel):
    timestamp_start: datetime
    duration: datetime


class WorkoutSetSchema(BaseModel):
    reps: int | None = None
    weight: float


class WorkoutEntrySchema(BaseModel):
    rest_countdown_duration: int | None = None
    note: str | None = None
    weight_unit: WeightUnit | None = None

    exercise: ExerciseInputSchema
    sets: List[WorkoutSetSchema]


class WorkoutSchema(BaseModel):
    name: str
    description: str | None = None
    isPublic: bool = False

    timestamp_start: datetime
    duration: datetime

    entries: list[WorkoutEntrySchema]
