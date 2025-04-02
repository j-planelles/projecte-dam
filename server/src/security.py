from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
from config import OAUTH2_SECRET_KEY, OAUTH2_TOKEN_EXPIRE_MINUTES
from db import get_session, session_generator
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from models.users import UserConfig, UserModel
from passlib.context import CryptContext
from pydantic import BaseModel
from schemas.config_schema import MobileAppConfigSchema
from schemas.user_schema import UserSchema
from sqlmodel import Session, select

ALGORITHM = "HS256"


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


def _get_user_by_uuid(uuid: str):
    with session_generator as session:
        query = select(UserModel).where(UserModel.uuid == uuid)
        item = session.exec(query).first()
        return item


def _authenticate_user(username: str, password: str):
    user = get_user_by_username(username)
    if user and _verify_password(password, user.hashed_password):
        return user


def _create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
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
    user = _get_user_by_uuid(uuid=token_data.uuid)
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

    access_token_expires = timedelta(minutes=OAUTH2_TOKEN_EXPIRE_MINUTES)
    access_token = _create_access_token(
        data={"sub": str(user.uuid)}, expires_delta=access_token_expires
    )
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
