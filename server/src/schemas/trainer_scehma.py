from uuid import UUID as UUID_TYPE
from models.users import TrainerModel, UserModel
from models.workout import WorkoutContentModel
from sqlmodel import SQLModel


class TrainerRecommendationSchema(SQLModel):
    user: UserModel
    trainer: TrainerModel
    workout: WorkoutContentModel


class TrainerRequestSchema(SQLModel):
    user: UserModel
    trainer: TrainerModel

    is_processed: bool = False
    created_at: int


class UserInterestSchema(SQLModel):
    uuid: UUID_TYPE
    name: str
    selected: bool
