from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
from sqlalchemy.orm import selectinload
from db import get_session, session_generator
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from models.users import TrainerModel, UserConfig, UserModel
from passlib.context import CryptContext
from pydantic import BaseModel
from schemas.config_schema import MobileAppConfigSchema
from schemas.user_schema import UserSchema
from sqlmodel import Session, select

ALGORITHM = "HS256"
OAUTH2_SECRET_KEY = "jordiplanellesperez"


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    uuid: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
router = APIRouter(prefix="/auth")


def _verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def _get_password_hash(password):
    return pwd_context.hash(password)


def get_user_by_username(username: str):
    with session_generator as session:
        query = select(UserModel).where(UserModel.username == username)
        item = session.exec(query).first()
        return item


def get_user_by_uuid(uuid: str):
    with session_generator as session:
        query = select(UserModel).where(UserModel.uuid == uuid)
        item = session.exec(query).first()
        return item


def _authenticate_user(username: str, password: str):
    user = get_user_by_username(username)
    if user and _verify_password(password, user.hashed_password):
        return user


def _create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, OAUTH2_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def _get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, OAUTH2_SECRET_KEY, algorithms=[ALGORITHM])
        token_user_uuid = payload.get("sub")
        if token_user_uuid is None:
            raise credentials_exception
        token_data = TokenData(uuid=token_user_uuid)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user_by_uuid(uuid=token_data.uuid)
    if user is None:
        raise credentials_exception
    return user


async def get_current_user_settings(
    current_user: UserModel = Depends(_get_current_user),
    session: Session = Depends(get_session),
):
    query = select(UserConfig).where(UserConfig.user_uuid == current_user.uuid)
    item = session.exec(query).first()
    return item


async def get_current_active_user(
    current_user: UserModel = Depends(_get_current_user),
    current_user_settings: UserConfig = Depends(get_current_user_settings),
):
    if current_user_settings.is_disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_trainer_user(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> UserModel:
    query = select(TrainerModel).where(TrainerModel.user_uuid == current_user.uuid)
    item = session.exec(query).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is not a Trainer. Register first.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return current_user


@router.post("/token", name="Get OAuth2 token", tags=["Authentication"])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    user = _authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = _create_access_token(data={"sub": str(user.uuid)})
    return Token(access_token=access_token, token_type="bearer")


@router.post("/register", name="Create a user", tags=["Authentication"])
async def create_user(
    username: str,
    password: str,  # TODO: Fer hasing al client
    session: Session = Depends(get_session),
):
    user_in_db = get_user_by_username(username)
    if user_in_db:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )

    new_user = UserModel(
        uuid=uuid4(),
        username=username,
        full_name=username,
        biography="",
        hashed_password=_get_password_hash(password=password),
    )
    session.add(new_user)

    new_user_config = UserConfig(
        user_uuid=new_user.uuid, mobile_app_config=MobileAppConfigSchema().model_dump()
    )
    session.add(new_user_config)
    session.commit()


@router.get("/profile", name="Get current user data", tags=["Authentication"])
async def get_profile(
    current_user: UserModel = Depends(get_current_active_user),
) -> UserModel:
    return current_user


@router.post("/profile", name="Update user profile data", tags=["Authentication"])
async def change_profile(
    updated_fields: UserSchema,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> UserSchema:
    if updated_fields.username is not None:
        if get_user_by_username(updated_fields.username):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already taken",
            )

    current_user.sqlmodel_update(updated_fields.model_dump(exclude_none=True))

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return current_user


@router.post("/disable", name="Disable a user account", tags=["Authentication"])
async def disable_user(
    current_user_settings: UserConfig = Depends(get_current_user_settings),
    session: Session = Depends(get_session),
):
    current_user_settings.is_disabled = True
    session.add(current_user_settings)
    session.commit()


@router.post(
    "/register/trainer",
    name="Register as a trainer",
    tags=["Authentication", "Trainer"],
)
async def register_as_trainer(
    session: Session = Depends(get_session),
    current_user: UserModel = Depends(get_current_active_user),
):
    query = select(TrainerModel).where(TrainerModel.user_uuid == current_user.uuid)
    trainer_in_db = session.exec(query).first()
    if trainer_in_db:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a trainer.",
        )

    new_trainer = TrainerModel(user_uuid=current_user.uuid)
    session.add(new_trainer)
    session.commit()
