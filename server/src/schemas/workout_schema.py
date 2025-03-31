from datetime import datetime

from sqlmodel import Field, SQLModel


class WorkoutTemplateSchema(SQLModel):
    name: str
    description: str | None = None
    isPublic: bool = Field(default=False)


class WorkoutInstanceSchema(SQLModel):
    timestamp_start: datetime
    duration: datetime


class WorkoutSchema(WorkoutTemplateSchema, WorkoutInstanceSchema):
    pass  # TODO: Separar schemas dels models d'entry i sets, aquest model s'utilitzara per l'entrada de dades.
