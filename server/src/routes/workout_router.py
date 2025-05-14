from uuid import uuid4

from db import get_session
from fastapi import APIRouter, Depends, HTTPException
from models.users import UserModel
from models.workout import (
    WorkoutContentModel,
    WorkoutEntryModel,
    WorkoutInstanceModel,
    WorkoutSetModel,
)
from schemas.workout_schema import WorkoutContentSchema, WorkoutStatsSchema
from security import get_current_active_user
from sqlmodel import Session, desc, func, select
from datetime import datetime, timedelta

router = APIRouter()


@router.get(
    "/user/workouts",
    response_model=list[WorkoutContentSchema],
    name="Get user workouts",
    tags=["Workouts"],
)
async def get_user_workouts(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = 25,
) -> list[WorkoutContentSchema]:
    # TODO: Les dades relacionades no es carreguen, transformar a WorkoutSchema
    query = (
        select(WorkoutContentModel, WorkoutInstanceModel)
        .join(WorkoutInstanceModel)
        .where(WorkoutContentModel.creator_uuid == current_user.uuid)
        .order_by(desc(WorkoutInstanceModel.timestamp_start))  # pyright: ignore[]
        .offset(offset)
        .limit(limit)
    )
    workouts = session.exec(query).all()
    return [workout[0] for workout in workouts]  # pyright: ignore[]


@router.get(
    "/user/workouts/{workout_uuid}",
    response_model=WorkoutContentSchema,
    name="Get user workouts",
    tags=["Workouts"],
)
async def get_user_workout(
    workout_uuid: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> WorkoutContentSchema:
    query = (
        select(WorkoutContentModel, WorkoutInstanceModel)
        .join(WorkoutInstanceModel)
        .where(WorkoutContentModel.creator_uuid == current_user.uuid)
        .where(WorkoutContentModel.uuid == workout_uuid)
    )
    workout = session.exec(query).first()

    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    return workout[0]  # pyright: ignore[]


@router.post(
    "/user/workouts",
    name="Add user workout to history",
    tags=["Workouts"],
)
async def add_user_workout(
    input_workout: WorkoutContentSchema,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    workout_entry = WorkoutContentModel(
        uuid=uuid4(),
        creator_uuid=current_user.uuid,
        **input_workout.model_dump(exclude_none=True, include={"name", "description"}),
    )

    for i, input_entry in enumerate(input_workout.entries):
        entry = WorkoutEntryModel(
            workout_uuid=workout_entry.uuid,
            index=i,
            exercise_uuid=uuid4()
            if input_entry.exercise.uuid is None
            else input_entry.exercise.uuid,
            **input_entry.model_dump(
                include={
                    "rest_countdown_duration",
                    "weight_unit",
                }
            ),
        )

        for j, input_set in enumerate(input_entry.sets):
            w_set = WorkoutSetModel(
                workout_uuid=workout_entry.uuid,
                entry_index=i,
                index=j,
                **input_set.model_dump(include={"reps", "weight", "set_type"}),
            )

            session.add(w_set)

        session.add(entry)

    session.add(workout_entry)

    if input_workout.instance:
        workout_instance = WorkoutInstanceModel(
            workout_uuid=workout_entry.uuid,
            **input_workout.instance.model_dump(  # pyright: ignore[]
                exclude_none=True, include={"timestamp_start", "duration"}
            ),
        )
        session.add(workout_instance)

    session.commit()


@router.get(
    "/user/stats",
    response_model=WorkoutStatsSchema,
    name="Get user statistics",
    tags=["Workouts"],
)
async def get_user_stats(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> WorkoutStatsSchema:
    now = datetime.combine(datetime.now().date(), datetime.min.time())
    start_of_week = now - timedelta(days=now.weekday())

    workouts = session.exec(
        select(func.count())
        .select_from(WorkoutContentModel)
        .join(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(WorkoutContentModel.creator_uuid == current_user.uuid)
    ).first()

    workouts_last_week = session.exec(
        select(func.count())
        .select_from(WorkoutContentModel)
        .join(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(WorkoutInstanceModel.timestamp_start >= start_of_week.timestamp() * 1000)
        .where(WorkoutContentModel.creator_uuid == current_user.uuid)
    ).first()

    if workouts is None or workouts_last_week is None:
        raise HTTPException(status_code=500, detail="Internal server error")

    workouts_per_week = [workouts_last_week]

    for i in range(7):
        date = now - timedelta(weeks=i + 1)
        start_of_week_period = date - timedelta(days=date.weekday())
        end_of_week_period = start_of_week_period + timedelta(days=7)

        workouts_period = session.exec(
            select(func.count())
            .select_from(WorkoutContentModel)
            .join(
                WorkoutInstanceModel,
                WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
            )
            .where(WorkoutContentModel.creator_uuid == current_user.uuid)
            .where(
                WorkoutInstanceModel.timestamp_start
                >= start_of_week_period.timestamp() * 1000
            )
            .where(
                WorkoutInstanceModel.timestamp_start
                < end_of_week_period.timestamp() * 1000
            )
        ).first()

        if workouts_period is not None:
            workouts_per_week.append(workouts_period)

    return WorkoutStatsSchema(
        workouts=workouts,
        workouts_last_week=workouts_last_week,
        workouts_per_week=workouts_per_week,
    )
