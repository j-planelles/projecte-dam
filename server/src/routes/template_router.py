from uuid import uuid4, UUID

from db import get_session
from fastapi import APIRouter, Depends, HTTPException
from models.users import UserModel
from models.workout import (
    WorkoutContentModel,
    WorkoutEntryModel,
    WorkoutInstanceModel,
    WorkoutSetModel,
)
from schemas.workout_schema import WorkoutContentSchema, WorkoutTemplateSchema
from security import get_current_active_user
from sqlmodel import Session, desc, select

router = APIRouter()


@router.get(
    "/user/templates",
    response_model=list[WorkoutContentSchema],
    name="Get user templates",
    tags=["Templates"],
)
async def get_user_templates(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> list[WorkoutContentSchema]:
    query = (
        select(WorkoutContentModel)
        .outerjoin(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(WorkoutInstanceModel.workout_uuid == None)
        .where(WorkoutContentModel.creator_uuid == current_user.uuid)
        .order_by(WorkoutContentModel.name)
    )
    templates = session.exec(query).all()
    return templates  # pyright: ignore[]


@router.get(
    "/user/templates/{template_uuid}",
    response_model=WorkoutContentSchema,
    name="Get user template",
    tags=["Templates"],
)
async def get_user_template(
    template_uuid: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> WorkoutContentSchema:
    query = (
        select(WorkoutContentModel)
        .outerjoin(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(WorkoutInstanceModel.workout_uuid == None)
        .where(WorkoutContentModel.creator_uuid == current_user.uuid)
        .where(WorkoutContentModel.uuid == template_uuid)
    )
    template = session.exec(query).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    return template  # pyright: ignore[]


@router.post(
    "/user/templates",
    response_model=WorkoutContentSchema,
    name="Create template",
    tags=["Templates"],
)
async def add_user_workout(
    input_workout: WorkoutTemplateSchema,
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

    session.commit()

    session.refresh(workout_entry)
    return workout_entry


@router.delete(
    "/user/templates/{template_uuid}",
    name="Delete user template",
    tags=["Templates"],
)
async def delete_user_template(
    template_uuid: str,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(WorkoutContentModel)
        .outerjoin(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(WorkoutInstanceModel.workout_uuid == None)
        .where(WorkoutContentModel.creator_uuid == current_user.uuid)
        .where(WorkoutContentModel.uuid == template_uuid)
    )
    template = session.exec(query).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    session.delete(template)
    session.commit()


@router.put(
    "/user/templates/{template_uuid}",
    response_model=WorkoutContentSchema,
    name="Update template",
    tags=["Templates"],
)
async def update_user_workout(
    template_uuid: str,
    input_workout: WorkoutTemplateSchema,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
):
    query = (
        select(WorkoutContentModel)
        .outerjoin(
            WorkoutInstanceModel,
            WorkoutContentModel.uuid == WorkoutInstanceModel.workout_uuid,  # pyright: ignore[]
        )
        .where(WorkoutInstanceModel.workout_uuid == None)
        .where(WorkoutContentModel.creator_uuid == current_user.uuid)
        .where(WorkoutContentModel.uuid == template_uuid)
    )
    template = session.exec(query).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    # Eliminar sets i entries per evitar conflictes amb els nous
    sets = session.exec(
        select(WorkoutSetModel).where(WorkoutSetModel.workout_uuid == template_uuid)
    ).all()

    for w_set in sets:
        session.delete(w_set)

    entries = session.exec(
        select(WorkoutEntryModel).where(WorkoutEntryModel.workout_uuid == template_uuid)
    ).all()

    for entry in entries:
        session.delete(entry)

    template.sqlmodel_update(
        input_workout.model_dump(exclude_none=True, include={"name", "description"})
    )

    for i, input_entry in enumerate(input_workout.entries):
        entry = WorkoutEntryModel(
            workout_uuid=UUID(template_uuid),
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
                workout_uuid=UUID(template_uuid),
                entry_index=i,
                index=j,
                **input_set.model_dump(include={"reps", "weight", "set_type"}),
            )

            session.add(w_set)

        session.add(entry)

    session.add(template)

    session.commit()

    session.refresh(template)
    return template
