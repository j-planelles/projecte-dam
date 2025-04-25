from uuid import UUID as UUID_TYPE
from sqlalchemy import func
from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

from models.users import TrainerModel, UserModel
from models.workout import WorkoutContentModel


class TrainerRecommendationModel(SQLModel, table=True):
    __tablename__ = "recommendation"  # pyright: ignore[]
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)
    trainer_uuid: UUID_TYPE = Field(foreign_key="trainer.user_uuid", primary_key=True)
    workout_uuid: UUID_TYPE = Field(
        foreign_key="workout_content.uuid", primary_key=True
    )

    user: UserModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRecommendationModel.user_uuid]",
        }
    )
    trainer: TrainerModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRecommendationModel.trainer_uuid]",
        }
    )
    workout: WorkoutContentModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRecommendationModel.workout_uuid]",
        }
    )

    __table_args__ = (UniqueConstraint("user_uuid", "trainer_uuid", "workout_uuid"),)


class TrainerRequestModel(SQLModel, table=True):
    __tablename__ = "trainer_request"  # pyright: ignore[]
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)
    trainer_uuid: UUID_TYPE = Field(foreign_key="trainer.user_uuid", primary_key=True)

    user: UserModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRequestModel.user_uuid]",
        }
    )
    trainer: "TrainerModel" = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRequestModel.trainer_uuid]",
        }
    )
    created_at: int = Field(primary_key=True)

    is_processed: bool = False

    # __table_args__ = (UniqueConstraint("user_uuid", "trainer_uuid", "created_at"),)
