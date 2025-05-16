from datetime import datetime
from typing import List
from uuid import UUID

from db import get_session
from fastapi import APIRouter, Depends, HTTPException
from models.trainer import (
    TrainerRecommendationModel,
    TrainerRequestModel,
    UserInterestModel,
    UserInterestLinkModel,
)
from models.users import TrainerModel, UserModel, UserConfig
from models.workout import WorkoutContentModel, WorkoutInstanceModel
from schemas.trainer_scehma import TrainerRequestSchema, UserInterestSchema
from schemas.types.enums import TrainerRequestActions
from schemas.user_schema import UserSchema
from schemas.workout_schema import WorkoutContentSchema
from security import get_current_active_user, get_trainer_user, get_user_by_uuid
from sqlmodel import Session, func, select
from sqlalchemy import and_

router = APIRouter()


@router.get(
    "/trainer/requests",
    response_model=List[TrainerRequestSchema],
    name="Get requests",
    tags=["Trainer"],
)
async def get_requests(
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = (
        select(TrainerRequestModel)
        .where(TrainerRequestModel.trainer_uuid == trainer_user.uuid)
        .where(TrainerRequestModel.is_processed == False)
    )
    requests = session.exec(query).all()
    return requests


@router.post(
    "/trainer/requests/{user_uuid}",
    name="Handle request",
    tags=["Trainer"],
)
async def handle_requests(
    user_uuid: str,
    action: TrainerRequestActions,
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = (
        select(TrainerRequestModel)
        .where(TrainerRequestModel.trainer_uuid == trainer_user.uuid)
        .where(TrainerRequestModel.user_uuid == user_uuid)
        .where(TrainerRequestModel.is_processed == False)
    )
    request = session.exec(query).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if action == TrainerRequestActions.ACCEPT:
        user = get_user_by_uuid(user_uuid)

        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        if user.trainer_uuid is not None:
            raise HTTPException(
                status_code=409, detail="The user already has a trainer."
            )

        user.trainer_uuid = trainer_user.uuid
        session.add(user)

    request.is_processed = True
    session.add(request)
    session.commit()


@router.get(
    "/trainer/users",
    response_model=List[UserSchema],
    name="Get paired users",
    tags=["Trainer"],
)
async def get_paired_users(
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = select(UserModel).where(UserModel.trainer_uuid == trainer_user.uuid)
    users = session.exec(query).all()

    return users


@router.get(
    "/trainer/users/{user_uuid}/info",
    response_model=UserSchema,
    name="Get paired users",
    tags=["Trainer"],
)
async def get_paired_user_info(
    user_uuid: str,
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = (
        select(UserModel)
        .where(UserModel.uuid == user_uuid)
        .where(UserModel.trainer_uuid == trainer_user.uuid)
    )
    user = session.exec(query).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


@router.post(
    "/trainer/users/{user_uuid}/unpair",
    name="Unpair with user",
    tags=["Trainer"],
)
async def unpair_user(
    user_uuid: str,
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = (
        select(UserModel)
        .where(UserModel.uuid == user_uuid)
        .where(UserModel.trainer_uuid == trainer_user.uuid)
    )
    user = session.exec(query).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    recommendations_query = (
        select(TrainerRecommendationModel)
        .where(TrainerRecommendationModel.user_uuid == user_uuid)
        .where(TrainerRecommendationModel.trainer_uuid == trainer_user.uuid)
    )
    recommendations_results = session.exec(recommendations_query).all()

    user.trainer_uuid = None

    session.add(user)
    for recommendation in recommendations_results:
        session.delete(recommendation)

    session.commit()


@router.get(
    "/trainer/users/{user_uuid}/recommendation",
    response_model=list[WorkoutContentSchema],
    name="Get assigned recommendations",
    tags=["Trainer"],
)
async def view_recommendations(
    user_uuid: str,
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = (
        select(WorkoutContentModel)
        .join(
            TrainerRecommendationModel,
            WorkoutContentModel.uuid == TrainerRecommendationModel.workout_uuid,  # pyright: ignore[]
        )
        .where(TrainerRecommendationModel.user_uuid == user_uuid)
        .where(TrainerRecommendationModel.trainer_uuid == trainer_user.uuid)
    )
    results = session.exec(query).all()

    return results


@router.post(
    "/trainer/users/{user_uuid}/recommendation",
    name="Create recommendation",
    tags=["Trainer"],
)
async def create_recommendation(
    user_uuid: str,
    workout_uuid: str,
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = (
        select(UserModel)
        .where(UserModel.uuid == user_uuid)
        .where(UserModel.trainer_uuid == trainer_user.uuid)
    )
    user = session.exec(query).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    new_recommendation = TrainerRecommendationModel(
        user_uuid=UUID(user_uuid),
        trainer_uuid=trainer_user.uuid,
        workout_uuid=UUID(workout_uuid),
    )
    session.add(new_recommendation)
    session.commit()


@router.delete(
    "/trainer/users/{user_uuid}/recommendation",
    name="Create recommendation",
    tags=["Trainer"],
)
async def delete_recommendation(
    user_uuid: str,
    workout_uuid: str,
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = (
        select(TrainerRecommendationModel)
        .where(TrainerRecommendationModel.trainer_uuid == trainer_user.uuid)
        .where(TrainerRecommendationModel.user_uuid == user_uuid)
        .where(TrainerRecommendationModel.workout_uuid == workout_uuid)
    )
    recommendation = session.exec(query).first()

    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    session.delete(recommendation)
    session.commit()


@router.get(
    "/trainer/users/{user_uuid}/templates",
    response_model=list[WorkoutContentSchema],
    name="Get unrecommended templates",
    tags=["Trainer"],
)
async def get_unrecommended_templates(
    user_uuid: str,
    trainer_user: UserModel = Depends(get_trainer_user),
    session: Session = Depends(get_session),
):
    query = (
        select(WorkoutContentModel)
        .outerjoin(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .outerjoin(
            TrainerRecommendationModel,
            and_(
                TrainerRecommendationModel.workout_uuid == WorkoutContentModel.uuid,  # pyright: ignore[]
                TrainerRecommendationModel.user_uuid == user_uuid,  # pyright: ignore[]
                TrainerRecommendationModel.trainer_uuid == trainer_user.uuid,  # pyright: ignore[]
            ),
        )
        .where(WorkoutInstanceModel.workout_uuid == None)
        .where(TrainerRecommendationModel.workout_uuid == None)
        .where(WorkoutContentModel.creator_uuid == trainer_user.uuid)
        .order_by(WorkoutContentModel.name)
    )
    results = session.exec(query).all()

    return results


@router.get(
    "/user/trainer/search",
    response_model=list[UserModel],
    name="Search for trainers",
    tags=["Trainer/User"],
)
async def search_trainers(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    selected_interests_query = (
        select(UserInterestLinkModel).where(
            UserInterestLinkModel.user_uuid == current_user.uuid
        )  # pyright: ignore[]
    )
    selected_interests = [
        item.interest_uuid for item in session.exec(selected_interests_query).all()
    ]

    users_query = (
        select(UserInterestLinkModel.user_uuid)
        .where(UserInterestLinkModel.interest_uuid.in_(selected_interests))  # pyright: ignore[]
        .group_by(UserInterestLinkModel.user_uuid)  # pyright: ignore[]
        .having(
            func.count(func.distinct(UserInterestLinkModel.interest_uuid))
            == len(selected_interests)
        )
    )

    query = (
        select(UserModel)
        .join(
            TrainerModel,
            UserModel.uuid == TrainerModel.user_uuid,  # pyright: ignore[]
        )
        .join(
            UserConfig,
            UserModel.uuid == UserConfig.user_uuid,  # pyright: ignore[]
        )
        .where(UserConfig.is_disabled == False)
        .where(UserModel.uuid.in_(users_query))  # pyright: ignore[]
        .where(UserModel.uuid != current_user.uuid)
    )

    users = session.exec(query).all()

    return users


@router.post(
    "/user/trainer/request",
    name="Create a request",
    tags=["Trainer/User"],
)
async def create_request(
    trainer_uuid: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    if current_user.trainer_uuid:
        raise HTTPException(
            status_code=409, detail="You have already registered for a trainer."
        )

    query = (
        select(TrainerRequestModel)
        .where(TrainerRequestModel.user_uuid == current_user.uuid)
        .where(TrainerRequestModel.is_processed == False)
    )
    existing_request = session.exec(query).first()

    if existing_request:
        raise HTTPException(
            status_code=409, detail="You have already created a request."
        )

    new_request = TrainerRequestModel(
        trainer_uuid=UUID(trainer_uuid),
        user_uuid=current_user.uuid,
        created_at=datetime.now().timestamp(),
    )

    session.add(new_request)
    session.commit()


@router.get(
    "/user/trainer/status",
    response_model=UserModel,
    name="Get request status",
    tags=["Trainer/User"],
)
async def get_request_status(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    if current_user.trainer_uuid:
        raise HTTPException(
            status_code=409, detail="You have already registered for a trainer."
        )

    query = (
        select(UserModel)
        .join(TrainerRequestModel, UserModel.uuid == TrainerRequestModel.trainer_uuid)  # pyright: ignore[]
        .where(TrainerRequestModel.user_uuid == current_user.uuid)
        .where(TrainerRequestModel.is_processed == False)
    )
    request = session.exec(query).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    return request


@router.get(
    "/user/trainer/info",
    response_model=UserModel,
    name="Get trainer info",
    tags=["Trainer/User"],
)
async def get_trainer_info(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    if not current_user.trainer_uuid:
        raise HTTPException(
            status_code=404, detail="You have not registered for a trainer."
        )

    query = select(UserModel).where(UserModel.uuid == current_user.trainer_uuid)
    trainer = session.exec(query).first()

    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")

    return trainer


@router.post(
    "/user/trainer/cancel-request",
    name="Cancel trainer request",
    tags=["Trainer/User"],
)
async def cancel_request(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    if current_user.trainer_uuid:
        raise HTTPException(
            status_code=409, detail="You have already registered for a trainer."
        )

    query = (
        select(TrainerRequestModel)
        .where(TrainerRequestModel.user_uuid == current_user.uuid)
        .where(TrainerRequestModel.is_processed == False)
    )
    request = session.exec(query).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    request.is_processed = True

    session.add(request)
    session.commit()


@router.post(
    "/user/trainer/unpair",
    name="Unpair with trainer",
    tags=["Trainer/User"],
)
async def unpair_with_trainer(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    if not current_user.trainer_uuid:
        raise HTTPException(
            status_code=404, detail="You have not registered for a trainer."
        )

    recommendations_query = (
        select(TrainerRecommendationModel)
        .where(TrainerRecommendationModel.user_uuid == current_user.uuid)
        .where(TrainerRecommendationModel.trainer_uuid == current_user.trainer_uuid)
    )
    recommendations_results = session.exec(recommendations_query).all()

    current_user.trainer_uuid = None

    session.add(current_user)
    for recommendation in recommendations_results:
        session.delete(recommendation)

    session.commit()


@router.get(
    "/user/trainer/recommendation",
    response_model=list[WorkoutContentSchema],
    name="Get recommendations",
    tags=["Trainer/User"],
)
async def view_user_recommendations(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(WorkoutContentModel)
        .join(
            TrainerRecommendationModel,
            WorkoutContentModel.uuid == TrainerRecommendationModel.workout_uuid,  # pyright: ignore[]
        )
        .where(TrainerRecommendationModel.user_uuid == current_user.uuid)
        .where(TrainerRecommendationModel.trainer_uuid == current_user.trainer_uuid)
    )
    results = session.exec(query).all()

    return results


@router.get(
    "/user/trainer/recommendation/{workout_uuid}",
    response_model=WorkoutContentSchema,
    name="Get recommendation",
    tags=["Trainer/User"],
)
async def view_user_recommendation(
    workout_uuid: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(WorkoutContentModel)
        .join(
            TrainerRecommendationModel,
            WorkoutContentModel.uuid == TrainerRecommendationModel.workout_uuid,  # pyright: ignore[]
        )
        .where(TrainerRecommendationModel.user_uuid == current_user.uuid)
        .where(TrainerRecommendationModel.trainer_uuid == current_user.trainer_uuid)
        .where(TrainerRecommendationModel.workout_uuid == workout_uuid)
    )
    result = session.exec(query).first()

    if not result:
        raise HTTPException(status_code=404, detail="Workout not found.")

    return result


@router.get(
    "/user/trainer/interests",
    response_model=list[UserInterestSchema],
    name="Get interests",
    tags=["Trainer/User"],
)
async def get_interests(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    interests = session.exec(select(UserInterestModel)).all()

    selected_interests_query = (
        select(UserInterestModel)
        .join(
            UserInterestLinkModel,
            UserInterestModel.uuid == UserInterestLinkModel.interest_uuid,  # pyright: ignore[]
        )
        .where(UserInterestLinkModel.user_uuid == current_user.uuid)  # pyright: ignore[]
    )
    selected_interests = session.exec(selected_interests_query).all()
    selected_interests_uuid = [item.uuid for item in selected_interests]

    result = [
        UserInterestSchema(
            **item.model_dump(), selected=item.uuid in selected_interests_uuid
        )
        for item in interests
    ]

    return result


@router.post(
    "/user/trainer/interests",
    name="Update interests",
    tags=["Trainer/User"],
)
async def set_interests(
    selected_interests_uuid: list[str],
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    selected_interests_query = (
        select(UserInterestLinkModel).where(
            UserInterestLinkModel.user_uuid == current_user.uuid
        )  # pyright: ignore[]
    )
    selected_interests = session.exec(selected_interests_query).all()

    for interest in selected_interests:
        session.delete(interest)
    session.commit()

    for interest in selected_interests_uuid:
        link = UserInterestLinkModel(
            user_uuid=current_user.uuid, interest_uuid=UUID(interest)
        )
        session.add(link)
    session.commit()
