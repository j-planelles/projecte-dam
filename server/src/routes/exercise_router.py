from uuid import UUID
from db import get_session
from fastapi import APIRouter, Depends, HTTPException, status
from models.exercise import DefaultExerciseModel, ExerciseModel
from models.users import UserModel
from models.workout import WorkoutContentModel, WorkoutEntryModel, WorkoutInstanceModel
from schemas.exercise_schema import DefaultExerciseSchema, ExerciseSchema
from schemas.workout_schema import WorkoutEntrySchema
from security import get_current_active_user
from sqlmodel import Session, desc, select

router = APIRouter()


@router.get(
    "/default-exercises",
    name="Get default exercises",
    tags=["Exercises", "Default exercises"],
)
async def get_default_exercises(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> list[DefaultExerciseModel]:
    query = select(DefaultExerciseModel)
    exercises = list(session.exec(query).all())
    return exercises


@router.get(
    "/default-exercises/{exercise_uuid}",
    name="Get default exercise",
    tags=["Exercises", "Default exercises"],
)
async def get_default_exercise(
    exercise_uuid: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> DefaultExerciseModel:
    query = select(DefaultExerciseModel).where(
        DefaultExerciseModel.uuid == exercise_uuid
    )
    exercise = session.exec(query).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    return exercise


@router.get(
    "/user/exercises",
    name="Get user enabled exercises",
    tags=["Exercises"],
)
async def get_exercises(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> list[ExerciseModel]:
    query = (
        select(ExerciseModel)
        .where(ExerciseModel.creator_uuid == current_user.uuid)
        .where(ExerciseModel.is_disabled == False)
    )
    exercises = list(session.exec(query).all())
    return exercises


@router.get(
    "/user/exercises/{exercise_uuid}",
    name="Get exercise",
    tags=["Exercises"],
)
async def get_exercise(
    exercise_uuid: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> ExerciseModel:
    query = (
        select(ExerciseModel)
        .where(ExerciseModel.creator_uuid == current_user.uuid)
        .where(ExerciseModel.uuid == exercise_uuid)
    )
    exercise = session.exec(query).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    return exercise


@router.post(
    "/user/exercises",
    name="Create exercise",
    tags=["Exercises"],
)
async def create_exercise(
    new_exercise: ExerciseSchema,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(ExerciseModel)
        .where(ExerciseModel.creator_uuid == current_user.uuid)
        .where(ExerciseModel.uuid == new_exercise.uuid)
    )
    exercise = session.exec(query).first()

    if exercise:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An exercise with the same UUID already exists.",
        )

    new_exercise_dict = new_exercise.model_dump(
        exclude_none=True, exclude={"is_disabled"}
    )
    new_exercise_model = ExerciseModel(
        **new_exercise_dict, creator_uuid=current_user.uuid
    )
    session.add(new_exercise_model)
    session.commit()

    session.refresh(new_exercise_model)
    return new_exercise_model


@router.put(
    "/user/exercises/{exercise_uuid}",
    name="Update exercise",
    tags=["Exercises"],
)
async def update_exercise(
    exercise_uuid: str,
    fields_to_edit: ExerciseSchema,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(ExerciseModel)
        .where(ExerciseModel.creator_uuid == current_user.uuid)
        .where(ExerciseModel.uuid == exercise_uuid)
        .where(ExerciseModel.is_disabled == False)
    )
    exercise = session.exec(query).first()

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found"
        )

    fields_to_edit_dict = fields_to_edit.model_dump(
        exclude_none=True, exclude={"default_exercise_uuid", "is_disabled", "uuid"}
    )
    exercise.sqlmodel_update(fields_to_edit_dict)
    session.add(exercise)
    session.commit()

    session.refresh(exercise)
    return exercise


@router.delete(
    "/user/exercises/{exercise_uuid}",
    name="Delete exercise",
    tags=["Exercises"],
)
async def delete_exercise(
    exercise_uuid: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(ExerciseModel)
        .where(ExerciseModel.creator_uuid == current_user.uuid)
        .where(ExerciseModel.uuid == exercise_uuid)
        .where(ExerciseModel.is_disabled == False)
    )
    exercise = session.exec(query).first()

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found"
        )

    exercise.is_disabled = True
    session.add(exercise)
    session.commit()


@router.get(
    "/user/exercises/{exercise_uuid}/last",
    name="Get exercise",
    tags=["Exercises"],
    response_model=WorkoutEntrySchema,
)
async def get_last_exercise(
    exercise_uuid: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(WorkoutEntryModel)
        .join(
            WorkoutContentModel,
            WorkoutEntryModel.workout_uuid == WorkoutContentModel.uuid,  # pyright: ignore[]
        )
        .join(
            WorkoutInstanceModel,
            WorkoutInstanceModel.workout_uuid == WorkoutContentModel.uuid,  # pyright: ignore[]
        )
        .where(WorkoutContentModel.creator_uuid == current_user.uuid)
        .where(WorkoutEntryModel.exercise_uuid == exercise_uuid)
        .order_by(desc(WorkoutInstanceModel.timestamp_start))
        .limit(1)
    )
    workout_entry = session.exec(query).first()

    if not workout_entry:
        raise HTTPException(status_code=404, detail="Exercise not found")

    return workout_entry


@router.get(
    "/user/archived-exercises",
    name="Get user archived (disabled) exercises",
    tags=["Exercises"],
)
async def get_disabled_exercises(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> list[ExerciseModel]:
    query = (
        select(ExerciseModel)
        .where(ExerciseModel.creator_uuid == current_user.uuid)
        .where(ExerciseModel.is_disabled == True)
    )
    exercises = list(session.exec(query).all())
    return exercises
