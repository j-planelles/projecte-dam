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
