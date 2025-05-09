from uuid import uuid4

import jwt
from db import get_session, session_generator
from encryption import decrypt_message, export_public_key
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from models.users import TrainerModel, UserConfig, UserModel
from passlib.context import CryptContext
from pydantic import BaseModel
from schemas.config_schema import MobileAppConfigSchema
from schemas.user_schema import UserInfoSchema, UserInputSchema, UserSchema
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


def get_user_settings_by_uuid(uuid: str):
    with session_generator as session:
        query = select(UserConfig).where(UserConfig.user_uuid == uuid)
        item = session.exec(query).first()
        return item


def _authenticate_user(username: str, password: str):
    user = get_user_by_username(username)

    if user:
        config = get_user_settings_by_uuid(str(user.uuid))

        if config:
            if user and _verify_password(password, config.hashed_password):
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
    plain_password = decrypt_message(form_data.password)
    user = _authenticate_user(form_data.username, plain_password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    config = get_user_settings_by_uuid(str(user.uuid))
    if not config or config.is_disabled:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = _create_access_token(data={"sub": str(user.uuid)})
    return Token(access_token=access_token, token_type="bearer")


@router.post("/register", name="Create a user", tags=["Authentication"])
async def create_user(
    username: str,
    password: str,
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
    )
    session.add(new_user)

    plain_password = decrypt_message(password)

    new_user_config = UserConfig(
        user_uuid=new_user.uuid,
        mobile_app_config=MobileAppConfigSchema().model_dump(),
        hashed_password=_get_password_hash(password=plain_password),
    )
    session.add(new_user_config)
    session.commit()


@router.get(
    "/profile",
    response_model=UserInfoSchema,
    name="Get current user data",
    tags=["Authentication"],
)
async def get_profile(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> UserInfoSchema:
    query = select(TrainerModel).where(TrainerModel.user_uuid == current_user.uuid)
    item = session.exec(query).first()

    is_trainer = item is not None
    user = UserInfoSchema(**current_user.model_dump(), is_trainer=is_trainer)

    return user


@router.post("/profile", name="Update user profile data", tags=["Authentication"])
async def change_profile(
    updated_fields: UserInputSchema,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> UserSchema:
    if updated_fields.username == "" or updated_fields.full_name == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid input",
        )

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


@router.post("/change-password", name="Change password", tags=["Authentication"])
async def change_password(
    password: str,
    current_user_settings: UserConfig = Depends(get_current_user_settings),
    session: Session = Depends(get_session),
):
    plain_password = decrypt_message(password)
    current_user_settings.hashed_password = _get_password_hash(password=plain_password)
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


@router.get(
    "/publickey", name="Get public key", tags=["Authentication"], response_model=str
)
async def get_public_key():
    return export_public_key()
