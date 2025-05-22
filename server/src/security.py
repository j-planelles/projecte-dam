from uuid import uuid4

import jwt
from config import OAUTH2_SECRET_KEY
from db import get_session, session_generator
from encryption import decrypt_message, export_public_key
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from models.chat import MessageModel
from models.exercise import ExerciseModel
from models.trainer import (
    TrainerRecommendationModel,
    TrainerRequestModel,
    UserInterestLinkModel,
)
from models.users import AdminModel, TrainerModel, UserConfig, UserModel
from models.workout import (
    WorkoutContentModel,
    WorkoutEntryModel,
    WorkoutInstanceModel,
    WorkoutSetModel,
)
from passlib.context import CryptContext
from pydantic import BaseModel
from schemas.user_schema import UserInfoSchema, UserInputSchema, UserSchema
from sqlmodel import Session, select

ALGORITHM = "HS256"  # Algorisme utilitzat per a la signatura de JWT


class Token(BaseModel):
    """
    Model Pydantic que representa un token d'accés JWT.
    """

    access_token: str  # Contingut encriptat del token
    token_type: str  # Tipus de token


class TokenData(BaseModel):
    """
    Model Pydantic que representa les dades contingudes dins d'un token JWT.
    """

    uuid: str  # UUID de l'usuari (UserModel)


# Context per a l'encriptació i verificació de contrasenyes, utilitzant bcrypt
# El sistema bcrypt ja utilitza un sistema de salting intern, així que no es necessari implementar-ho
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Objecte OAuth2 per a la gestió de tokens JWT
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/token"  # Esmenem l'endpoint per la generació del token.
)
# Router per a les rutes d'autenticació
router = APIRouter(prefix="/auth")


def _verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si una contrasenya en text pla coincideix amb una contrasenya encriptada.

    Args:
        plain_password: La contrasenya en text pla.
        hashed_password: La contrasenya encriptada.

    Returns:
        True si les contrasenyes coincideixen, False altrament.
    """
    return pwd_context.verify(plain_password, hashed_password)


def _get_password_hash(password: str) -> str:
    """
    Genera un hash d'una contrasenya en text pla.

    Args:
        password: La contrasenya en text pla.

    Returns:
        El hash de la contrasenya.
    """
    return pwd_context.hash(password)


def get_user_by_username(username: str) -> UserModel | None:
    """
    Obté un usuari de la base de dades pel seu nom d'usuari.

    Args:
        username: El nom d'usuari a cercar.

    Returns:
        L'objecte UserModel si es troba, None altrament.
    """
    with session_generator as session:
        query = select(UserModel).where(UserModel.username == username)
        item = session.exec(query).first()
        return item


def get_user_by_uuid(uuid: str) -> UserModel | None:
    """
    Obté un usuari de la base de dades pel seu UUID.

    Args:
        uuid: L'UUID de l'usuari a cercar.

    Returns:
        L'objecte UserModel si es troba, None altrament.
    """
    with session_generator as session:
        query = select(UserModel).where(UserModel.uuid == uuid)
        item = session.exec(query).first()
        return item


def get_user_settings_by_uuid(uuid: str) -> UserConfig | None:
    """
    Obté la configuració d'un usuari de la base de dades pel seu UUID.

    Args:
        uuid: L'UUID de l'usuari per al qual obtenir la configuració.

    Returns:
        L'objecte UserConfig si es troba, None altrament.
    """
    with session_generator as session:
        query = select(UserConfig).where(UserConfig.user_uuid == uuid)
        item = session.exec(query).first()
        return item


def _authenticate_user(username: str, password: str) -> UserModel | None:
    """
    Autentica un usuari comparant el nom d'usuari i la contrasenya proporcionats
    amb els emmagatzemats a la base de dades.

    Args:
        username: El nom d'usuari.
        password: La contrasenya en text pla.

    Returns:
        L'objecte UserModel si l'autenticació és correcta, None altrament.
    """
    user = get_user_by_username(username)

    if user:
        # El hash de la contrasenya es desa a la taula de configuració de l'usuari.
        config = get_user_settings_by_uuid(str(user.uuid))

        if config:
            if user and _verify_password(password, config.hashed_password):
                return user
    return None


def _create_access_token(data: dict) -> str:
    """
    Crea un token d'accés JWT.

    Args:
        data: Un diccionari amb les dades a incloure en el token (normalment l'identificador de l'usuari).

    Returns:
        El token JWT codificat com una cadena.
    """
    to_encode = (
        data.copy()
    )  # Fa una còpia de les dades per evitar modificacions inesperades
    # Codifica el token utilitzant la clau secreta i l'algoritme especificats
    encoded_jwt = jwt.encode(to_encode, OAUTH2_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def _get_current_user(token: str = Depends(oauth2_scheme)) -> UserModel:
    """
    Obté l'usuari actual a partir del token JWT proporcionat.
    Aquesta funció és una dependència de FastAPI.

    Args:
        token: El token JWT obtingut de la capçalera d'autorització.

    Raises:
        HTTPException: Si el token no és vàlid o l'usuari no es troba.

    Returns:
        L'objecte UserModel de l'usuari autenticat.
    """
    # Missatge d'error per si no s'han pogut validar les credencials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Descodifica el token JWT
        payload = jwt.decode(token, OAUTH2_SECRET_KEY, algorithms=[ALGORITHM])
        token_user_uuid: str | None = payload.get(
            "sub"
        )  # "sub" és el camp estàndard per a l'identificador del subjecte
        if token_user_uuid is None:  # Validar que el camp UUID del token existeixi
            raise credentials_exception
        token_data = TokenData(
            uuid=token_user_uuid
        )  # Crea un objecte TokenData amb l'UUID
    except InvalidTokenError:  # Verificar que el token sigui vàlid
        raise credentials_exception

    user = get_user_by_uuid(
        uuid=token_data.uuid
    )  # Obté l'usuari de la BD amb l'UUID del token
    if user is None:  # Verificar que l'usuari existeixi
        raise credentials_exception
    return user


async def get_current_user_settings(
    current_user: UserModel = Depends(_get_current_user),
    session: Session = Depends(get_session),
) -> UserConfig:
    """
    Obté la configuració de l'usuari actualment autenticat.
    Aquesta funció és una dependència de FastAPI.

    Args:
        current_user: L'usuari actualment autenticat (injectat per FastAPI).
        session: La sessió de base de dades (injectada per FastAPI).

    Returns:
        L'objecte UserConfig de l'usuari actual.
    """
    query = select(UserConfig).where(
        UserConfig.user_uuid == current_user.uuid
    )  # Crea la consulta
    item = session.exec(query).first()
    if not item:  # Verificar que el camp de configuració existeixi
        raise HTTPException(status_code=500, detail="User config not found")
    return item


async def get_current_active_user(
    current_user: UserModel = Depends(_get_current_user),
    current_user_settings: UserConfig = Depends(get_current_user_settings),
) -> UserModel:
    """
    Obté l'usuari actualment autenticat i verifica si el seu compte està actiu.
    Aquesta funció és una dependència de FastAPI.

    Args:
        current_user: L'usuari actualment autenticat.
        current_user_settings: La configuració de l'usuari actual.

    Raises:
        HTTPException: Si el compte de l'usuari està desactivat.

    Returns:
        L'objecte UserModel de l'usuari actiu.
    """
    if (
        current_user_settings.is_disabled
    ):  # Comprova si el compte està marcat com a desactivat
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_trainer_user(
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> UserModel:
    """
    Verifica si l'usuari actualment autenticat i actiu és un entrenador.
    Aquesta funció remplaça get_current_active_user en els camps que només
    un entranador pot tenir accés.

    Args:
        current_user: L'usuari actualment autenticat i actiu.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'usuari no és un entrenador registrat.

    Returns:
        L'objecte UserModel de l'usuari si és un entrenador.
    """
    query = select(TrainerModel).where(
        TrainerModel.user_uuid == current_user.uuid
    )  # Obtenir el registre d'entrenador (TrainerModel)
    item = session.exec(query).first()

    if not item:  # Verificar que existeixi
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is not a Trainer. Register first.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return current_user  # Retorna el registre d'usuari


@router.post("/token", name="Get OAuth2 token", tags=["Authentication"])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    """
    Endpoint per a l'inici de sessió. L'usuari envia el seu nom d'usuari i contrasenya
    per obtenir un token d'accés OAuth2.

    Args:
        form_data: Dades del formulari amb `username` i `password`.

    Raises:
        HTTPException: Si les credencials són incorrectes o el compte està desactivat.

    Returns:
        Un objecte Token amb el `access_token` i `token_type`.
    """
    # Desencripta la contrasenya rebuda
    plain_password = decrypt_message(form_data.password)
    # Autentica l'usuari amb el nom d'usuari i la contrasenya desencriptada
    user = _authenticate_user(form_data.username, plain_password)
    if not user:  # Si l'autenticació falla
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    config = get_user_settings_by_uuid(
        str(user.uuid)
    )  # Obté la configuració de l'usuari
    if (
        not config or config.is_disabled
    ):  # Si no ha trobat la configuració o el compte està desactivat
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Crea un token d'accés amb l'UUID de l'usuari com a subjecte ("sub")
    access_token = _create_access_token(data={"sub": str(user.uuid)})
    return Token(access_token=access_token, token_type="bearer")


@router.post("/register", name="Create a user", tags=["Authentication"])
async def create_user(
    username: str,
    password: str,
    session: Session = Depends(get_session),
):
    """
    Endpoint per registrar un nou usuari.

    Args:
        username: El nom d'usuari.
        password: La contrasenya encriptada.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si el nom d'usuari ja existeix.
    """
    user_in_db = get_user_by_username(username)  # Comprova si l'usuari ja existeix
    if user_in_db:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )

    # Crea un nou objecte UserModel
    new_user = UserModel(
        uuid=uuid4(),  # Genera un nou UUID per a l'usuari
        username=username,
        full_name=username,  # Inicialment, el nom complet és el mateix que el nom d'usuari
        biography="",
    )
    session.add(new_user)  # Afegeix el nou usuari a la sessió

    plain_password = decrypt_message(password)  # Desencripta la contrasenya rebuda

    # Crea un nou objecte UserConfig amb la contrasenya encriptada
    new_user_config = UserConfig(
        user_uuid=new_user.uuid,
        hashed_password=_get_password_hash(
            password=plain_password
        ),  # Genera el hashd de la contrasenya
    )
    session.add(new_user_config)  # Persisteix la configuració de l'usuari
    session.commit()  # Guarda els canvis a la base de dades


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
    """
    Endpoint per obtenir el perfil de l'usuari actualment autenticat.

    Args:
        current_user: L'usuari actualment autenticat i actiu.
        session: La sessió de base de dades.

    Returns:
        Un objecte UserInfoSchema amb les dades del perfil de l'usuari,
        incloent si és un entrenador.
    """
    # Comprova si l'usuari actual és un entrenador.
    # Si cridem get_trainer_user, només els usuaris entrenadors podrien cridar l'endpoint sense que mostri un error.
    query = select(TrainerModel).where(TrainerModel.user_uuid == current_user.uuid)
    item = session.exec(query).first()

    is_trainer = (
        item is not None
    )  # Si es troba un registre d'entrenador, es un entrenador.
    # Crea un objecte UserInfoSchema a partir de les dades de l'usuari i l'indicador is_trainer
    user = UserInfoSchema(**current_user.model_dump(), is_trainer=is_trainer)

    return user


@router.post("/profile", name="Update user profile data", tags=["Authentication"])
async def change_profile(
    updated_fields: UserInputSchema,
    current_user: UserModel = Depends(get_current_active_user),
    session: Session = Depends(get_session),
) -> UserSchema:
    """
    Endpoint per actualitzar les dades del perfil de l'usuari actual.

    Args:
        updated_fields: Un objecte UserInputSchema amb els camps a actualitzar.
        current_user: L'usuari actualment autenticat i actiu.
        session: La sessió de base de dades.

    Raises:
        HTTPException: Si l'entrada és invàlida o el nom d'usuari ja està ocupat.

    Returns:
        L'objecte UserSchema amb les dades de l'usuari actualitzades.
    """
    # Validació bàsica dels camps d'entrada
    if updated_fields.username == "" or updated_fields.full_name == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid input",
        )

    # Si s'intenta canviar el nom d'usuari, comprova que no estigui ja ocupat
    if updated_fields.username is not None:
        if get_user_by_username(updated_fields.username):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already taken",
            )

    # Actualitza els camps de l'usuari amb les dades proporcionades (excloent valors no populats)
    current_user.sqlmodel_update(updated_fields.model_dump(exclude_none=True))

    session.add(current_user)
    session.commit()
    session.refresh(current_user)  # Refresca l'objecte usuari des de la BD i el retorna

    return current_user


@router.post("/disable", name="Disable a user account", tags=["Authentication"])
async def disable_user(
    current_user: UserModel = Depends(get_current_active_user),
    current_user_settings: UserConfig = Depends(get_current_user_settings),
    session: Session = Depends(get_session),
):
    """
    Endpoint per desactivar el compte de l'usuari actual.
    Això marca el compte com a desactivat i anonimitza el nom d'usuari.
    Si l'usuari és un entrenador, desvincula els seus usuaris associats.

    Args:
        current_user: L'usuari actualment autenticat i actiu.
        current_user_settings: La configuració de l'usuari actual.
        session: La sessió de base de dades.
    """
    # Si l'usuari és un entrenador, cerca els usuaris que té assignats
    query = select(UserModel).where(UserModel.trainer_uuid == current_user.uuid)
    associated_users = session.exec(query).all()

    # Desvincula cada usuari associat de l'entrenador
    for user_mod in associated_users:
        user_mod.trainer_uuid = None
        session.add(user_mod)

    # Anonimitza el nom d'usuari afegint "-deleted-" i un UUID
    current_user.username = f"{current_user.username}-deleted-{uuid4()}"
    session.add(current_user)

    # Marca el compte com a desactivat en la configuració de l'usuari
    current_user_settings.is_disabled = True
    session.add(current_user_settings)

    session.commit()  # Guarda tots els canvis


@router.post("/delete", name="Delete a user account", tags=["Authentication"])
async def delete_user(
    current_user: UserModel = Depends(get_current_active_user),
    current_user_settings: UserConfig = Depends(get_current_user_settings),
    session: Session = Depends(get_session),
):
    """
    Endpoint per eliminar permanentment el compte de l'usuari actual i totes les seves dades associades.

    Args:
        current_user: L'usuari actualment autenticat i actiu.
        current_user_settings: La configuració de l'usuari actual.
        session: La sessió de base de dades.
    """
    # Eliminar usuaris associats (si l'usuari actual és un entrenador)
    query = select(UserModel).where(UserModel.trainer_uuid == current_user.uuid)
    associated_users = session.exec(query).all()

    for user_mod in associated_users:
        user_mod.trainer_uuid = None  # Desvincula l'usuari de l'entrenador
        session.add(user_mod)

    # Primer, obté tots els entrenaments (WorkoutContentModel) creats per l'usuari
    workouts = session.exec(
        select(WorkoutContentModel).where(
            WorkoutContentModel.creator_uuid == current_user.uuid
        )
    ).all()

    for workout in workouts:
        # Elimina les entrades (WorkoutEntryModel) de cada entrenament
        entries = session.exec(
            select(WorkoutEntryModel).where(
                WorkoutEntryModel.workout_uuid == workout.uuid
            )
        ).all()

        for entry in entries:
            # Elimina els sets (WorkoutSetModel) per a aquesta entrada
            sets = session.exec(
                select(WorkoutSetModel).where(
                    (WorkoutSetModel.workout_uuid == entry.workout_uuid)
                    & (WorkoutSetModel.entry_index == entry.index)
                )
            ).all()

            for set_item in sets:
                session.delete(set_item)  # Elimina cada set

            session.delete(entry)  # Elimina l'entrada

        # Elimina la instància de l'entrenament (WorkoutInstanceModel) si existeix
        instance = session.get(WorkoutInstanceModel, workout.uuid)
        if instance:
            session.delete(instance)

        # Elimina el contingut de l'entrenament (WorkoutContentModel)
        session.delete(workout)

    # Eliminar ExerciseModel creats per l'usuari
    exercises = session.exec(
        select(ExerciseModel).where(ExerciseModel.creator_uuid == current_user.uuid)
    ).all()
    for exercise in exercises:
        session.delete(exercise)

    # Eliminar MessageModel on l'usuari és emissor o receptor
    messages = session.exec(
        select(MessageModel).where(
            (MessageModel.user_uuid == current_user.uuid)
            | (MessageModel.trainer_uuid == current_user.uuid)
        )
    ).all()
    for message in messages:
        session.delete(message)

    # Eliminar TrainerRecommendationModel on l'usuari és l'usuari o l'entrenador
    recommendations = session.exec(
        select(TrainerRecommendationModel).where(
            (TrainerRecommendationModel.user_uuid == current_user.uuid)
            | (TrainerRecommendationModel.trainer_uuid == current_user.uuid)
        )
    ).all()
    for recommendation in recommendations:
        session.delete(recommendation)

    # Eliminar TrainerRequestModel on l'usuari és l'usuari o l'entrenador
    requests = session.exec(
        select(TrainerRequestModel).where(
            (TrainerRequestModel.user_uuid == current_user.uuid)
            | (TrainerRequestModel.trainer_uuid == current_user.uuid)
        )
    ).all()
    for request_item in (
        requests
    ):  # Canviat 'request' a 'request_item' per evitar conflicte amb el mòdul 'request'
        session.delete(request_item)

    # Eliminar UserInterestLinkModel associats a l'usuari
    interests = session.exec(
        select(UserInterestLinkModel).where(
            UserInterestLinkModel.user_uuid == current_user.uuid
        )
    ).all()
    for interest in interests:
        session.delete(interest)

    # Eliminar TrainerModel si l'usuari és un entrenador
    trainer = session.get(
        TrainerModel, current_user.uuid
    )  # Intenta obtenir el registre d'entrenador
    if trainer:
        session.delete(trainer)  # Elimina el registre d'entrenador

    # Eliminar AdminModel si l'usuari és un administrador
    admin = session.get(
        AdminModel, current_user.uuid
    )  # Intenta obtenir el registre d'administrador
    if admin:
        session.delete(admin)  # Elimina el registre d'administrador

    # Finalment, eliminar UserConfig i UserModel
    session.delete(current_user_settings)  # Elimina la configuració de l'usuari
    session.delete(current_user)  # Elimina l'usuari

    session.commit()  # Guarda tots els canvis d'eliminació


@router.post("/change-password", name="Change password", tags=["Authentication"])
async def change_password(
    password: str,
    current_user_settings: UserConfig = Depends(get_current_user_settings),
    session: Session = Depends(get_session),
):
    """
    Endpoint per canviar la contrasenya de l'usuari actual.

    Args:
        password: La nova contrasenya (encriptada, es desencriptarà).
        current_user_settings: La configuració de l'usuari actual.
        session: La sessió de base de dades.
    """
    plain_password = decrypt_message(password)  # Desencripta la nova contrasenya
    # Genera el hash de la contrasenya
    current_user_settings.hashed_password = _get_password_hash(password=plain_password)
    session.add(
        current_user_settings
    )  # Afegeix la configuració actualitzada a la sessió
    session.commit()  # Guarda els canvis


@router.post(
    "/register/trainer",
    name="Register as a trainer",
    tags=["Authentication", "Trainer"],
)
async def register_as_trainer(
    session: Session = Depends(get_session),
    current_user: UserModel = Depends(get_current_active_user),
):
    """
    Endpoint perquè un usuari es registri com a entrenador.

    Args:
        session: La sessió de base de dades.
        current_user: L'usuari actualment autenticat i actiu.

    Raises:
        HTTPException: Si l'usuari ja és un entrenador.
    """
    # Comprova si l'usuari ja està registrat com a entrenador
    query = select(TrainerModel).where(TrainerModel.user_uuid == current_user.uuid)
    trainer_in_db = session.exec(query).first()
    if trainer_in_db:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a trainer.",  # L'usuari ja és un entrenador.
        )

    # Crea un nou registre TrainerModel associat a l'UUID de l'usuari
    new_trainer = TrainerModel(user_uuid=current_user.uuid)
    session.add(new_trainer)  # Afegeix el nou entrenador a la sessió
    session.commit()  # Guarda els canvis


@router.post(
    "/unregister/trainer",
    name="Unregister as a trainer",
    tags=["Authentication", "Trainer"],
)
async def unregister_as_trainer(
    session: Session = Depends(get_session),
    current_user: UserModel = Depends(get_current_active_user),
):
    """
    Endpoint perquè un entrenador es desregistri.
    Això elimina el seu rol d'entrenador i les dades associades específicament a aquest rol.

    Args:
        session: La sessió de base de dades.
        current_user: L'usuari actualment autenticat i actiu (que ha de ser un entrenador).
    """
    # Eliminar usuaris associats a aquest entrenador
    query = select(UserModel).where(UserModel.trainer_uuid == current_user.uuid)
    associated_users = session.exec(query).all()

    for user_mod in associated_users:
        user_mod.trainer_uuid = None  # Desvincula els usuaris
        session.add(user_mod)

    # Eliminar MessageModel on l'usuari (entrenador) és emissor o receptor
    messages = session.exec(
        select(MessageModel).where(
            MessageModel.trainer_uuid
            == current_user.uuid  # Missatges on l'usuari és l'entrenador
        )
    ).all()
    for message in messages:
        session.delete(message)

    # Eliminar TrainerRecommendationModel on l'usuari és l'entrenador
    recommendations = session.exec(
        select(TrainerRecommendationModel).where(
            TrainerRecommendationModel.trainer_uuid == current_user.uuid
        )
    ).all()
    for recommendation in recommendations:
        session.delete(recommendation)

    # Eliminar TrainerRequestModel on l'usuari és l'entrenador
    requests = session.exec(
        select(TrainerRequestModel).where(
            TrainerRequestModel.trainer_uuid == current_user.uuid
        )
    ).all()
    for request_item in requests:
        session.delete(request_item)

    # Eliminar el registre TrainerModel
    trainer = session.get(
        TrainerModel, current_user.uuid
    )
    if trainer:
        session.delete(trainer) 

    session.commit()  # Guarda els canvis


@router.get(
    "/publickey", name="Get public key", tags=["Authentication"], response_model=str
)
async def get_public_key():
    """
    Endpoint per obtenir la clau pública del servidor.
    Aquesta clau pública és utilitzada pel client per encriptar dades d'inici de sessió.

    Returns:
        La clau pública exportada com una string en format PEM.
    """
    return export_public_key()  # Retorna la clau pública exportada
