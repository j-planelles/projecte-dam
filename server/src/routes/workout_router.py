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
from schemas.workout_schema import WorkoutContentSchema
from security import get_current_active_user
from sqlmodel import Session, desc, select

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
    # TODO: Relacionar gym, entries i sets (afegir indexes), creator
    workout_entry = WorkoutContentModel(
        uuid=uuid4(),
        creator_uuid=current_user.uuid,
        gym_id=input_workout.gym_id,
        **input_workout.model_dump(
            exclude_none=True, include={"name", "description", "isPublic"}
        ),
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
                    "note",
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
