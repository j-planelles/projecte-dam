from datetime import datetime
from sqlmodel import SQLModel

from models.users import TrainerModel, UserModel
from models.workout import WorkoutContentModel


class TrainerRecommendationSchema(SQLModel):
    user: UserModel
    trainer: TrainerModel
    workout: WorkoutContentModel


class TrainerRequestSchema(SQLModel):
    user: UserModel
    trainer: TrainerModel

    is_processed: bool = False
    created_at: datetime
