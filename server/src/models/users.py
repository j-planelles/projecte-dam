from typing import Optional
from uuid import UUID as UUID_TYPE
from uuid import uuid4

from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Column, Field, Relationship, SQLModel

from schemas.user_schema import UserSchema


class UserModel(UserSchema, table=True):
    """
    Model que representa un usuari en el sistema.
    Emmagatzema informació bàsica de l'usuari, així com enllaços
    al seu entrenador i a la seva configuració.
    Hereta camps de UserSchema.
    """

    __tablename__ = "users"  # Nom de la taula a la base de dades # pyright: ignore[]

    # Identificador únic universal per a l'usuari.
    # Utilitza el tipus UUID de PostgreSQL. És la clau primària,
    # es genera automàticament, està indexat i no pot ser nul.
    uuid: UUID_TYPE = Field(
        sa_column=Column(
            PG_UUID(
                as_uuid=True
            ),  # Tipus de columna específic de PostgreSQL per a UUIDs
            primary_key=True,  # Aquest camp és la clau primària de la taula
            default=uuid4,  # Valor per defecte si no es proporciona: un nou UUID v4
            index=True,  # Crea un índex en aquesta columna per a cerques ràpides
            nullable=False,  # No pot ser nul
        )
    )

    # Nom d'usuari, ha de ser únic. Per defecte és una cadena buida.
    username: str = Field(unique=True, default="")
    # Nom complet de l'usuari. Per defecte és una cadena buida.
    full_name: str = Field(default="")  # Valor per defecte
    # Biografia de l'usuari, opcional.
    biography: str | None = None

    # Clau forana opcional que enllaça amb l'UUID de l'entrenador de l'usuari (de la taula 'trainer').
    trainer_uuid: UUID_TYPE | None = Field(
        foreign_key="trainer.user_uuid",
        default=None,  # Enllaça amb la columna user_uuid de la taula trainer
    )
    # Relació opcional amb el model TrainerModel.
    # `foreign_keys` especifica la columna local que conté la clau forana.
    trainer: Optional["TrainerModel"] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[UserModel.trainer_uuid]"},
    )

    # Relació un-a-un amb UserConfig.
    # `back_populates="user"` estableix la relació bidireccional amb el camp 'user' de UserConfig.
    config: "UserConfig" = Relationship(back_populates="user")


class TrainerModel(SQLModel, table=True):
    """
    Model que representa el rol d'entrenador d'un usuari.
    Simplement enllaça un UUID d'usuari per identificar-lo com a entrenador.
    """

    __tablename__ = "trainer"  # Nom de la taula # pyright: ignore[]
    # Clau primària i forana que enllaça amb l'UUID de l'usuari (de la taula 'users').
    # Això significa que un entrenador ÉS un usuari.
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)

    # Relació amb el model UserModel.
    # `uselist=False` indica una relació un-a-un (un entrenador és un usuari).
    # `overlaps="trainer"` indica a SQLAlchemy que aquesta relació i la relació 'trainer'
    # en UserModel es refereixen a la mateixa connexió, ajudant a resoldre
    # possibles ambigüitats o conflictes en relacions bidireccionals complexes.
    # `foreign_keys` aquí es refereix a la clau forana en l'ALTRE costat de la relació
    # que defineix aquesta connexió (és a dir, UserModel.trainer_uuid).
    user: "UserModel" = Relationship(
        sa_relationship_kwargs={
            "uselist": False,  # Indica que aquesta relació apunta a un sol objecte UserModel
            "overlaps": "trainer",  # Gestiona la superposició amb la relació 'trainer' a UserModel
            "foreign_keys": "[UserModel.trainer_uuid]",  # Especifica quina clau forana en UserModel s'utilitza per a aquesta relació inversa
        }
    )


class AdminModel(SQLModel, table=True):
    """
    Model que representa el rol d'administrador d'un usuari.
    Enllaça un UUID d'usuari per identificar-lo com a administrador.
    """

    __tablename__ = "admin"  # Nom de la taula # pyright: ignore[]
    # Clau primària i forana que enllaça amb l'UUID de l'usuari (de la taula 'users').
    # Un administrador ÉS un usuari.
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)

    # Relació un-a-un amb UserModel.
    user: "UserModel" = Relationship(
        sa_relationship_kwargs={"uselist": False}
    )  # Un administrador és un únic usuari


class UserConfig(SQLModel, table=True):
    """
    Model que emmagatzema la configuració específica d'un usuari,
    com la seva contrasenya encriptada i l'estat del compte.
    """

    __tablename__ = "user_config"  # Nom de la taula # pyright: ignore[]
    # Clau primària i forana que enllaça amb l'UUID de l'usuari (de la taula 'users').
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)

    # Relació un-a-un amb UserModel.
    # `back_populates="config"` estableix la relació bidireccional amb el camp 'config' de UserModel.
    user: "UserModel" = Relationship(back_populates="config")

    # Contrasenya de l'usuari, emmagatzemada com un hash.
    hashed_password: str

    # Indicador booleà per marcar si el compte de l'usuari està desactivat.
    # Per defecte, un compte nou no està desactivat (False).
    is_disabled: bool = Field(default=False)
