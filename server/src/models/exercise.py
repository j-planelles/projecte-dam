from uuid import UUID as UUID_TYPE
from uuid import uuid4

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Column, Enum, Field

from schemas.exercise_schema import DefaultExerciseSchema, ExerciseSchema
from schemas.types.enums import BodyPart, ExerciseType


class ExerciseModel(ExerciseSchema, table=True):
    """
    Model que representa un exercici personalitzat creat per un usuari.
    Emmagatzema tots els detalls de l'exercici, incloent qui el va crear.
    Hereta camps de `ExerciseSchema`.
    """

    __tablename__ = "exercise"  # Nom de la taula a la base de dades # pyright: ignore[]

    # Identificador únic universal per a l'exercici.
    # Utilitza el tipus UUID de PostgreSQL. És la clau primària,
    # es genera automàticament, està indexat i no pot ser nul.
    # Aquest camp sobreescriu o defineix l'atribut 'uuid' heretat de ExerciseSchema per a la BD.
    uuid: UUID_TYPE = Field(
        sa_column=Column(  # Defineix la columna SQLAlchemy subjacent
            PG_UUID(as_uuid=True),  # Utilitza el tipus UUID natiu de PostgreSQL
            primary_key=True,  # Aquest camp és la clau primària
            default=uuid4,  # Valor per defecte si no es proporciona: un nou UUID v4
            index=True,  # Crea un índex en aquesta columna per a cerques ràpides
            nullable=False,  # No pot ser nul
        )
    )
    # Part del cos principal que treballa aquest exercici.
    # S'emmagatzema com un tipus Enum a la base de dades i no pot ser nul.
    # Sobreescriu l'atribut 'body_part' heretat de ExerciseSchema per a la BD.
    body_part: BodyPart = Field(sa_column=sa.Column(Enum(BodyPart), nullable=False))
    # Tipus d'exercici (p. ex., força, cardiovascular).
    # S'emmagatzema com un tipus Enum a la base de dades i no pot ser nul.
    # Sobreescriu l'atribut 'type' heretat de ExerciseSchema per a la BD.
    type: ExerciseType = Field(sa_column=sa.Column(Enum(ExerciseType), nullable=False))

    # Clau forana que enllaça amb l'UUID de l'usuari creador (de la taula 'users').
    creator_uuid: UUID_TYPE = Field(foreign_key="users.uuid")
    # El camp 'is_disabled' i 'default_exercise_uuid' s'hereten de ExerciseSchema
    # i SQLModel els gestionarà adequadament per a la taula si no es redefineixen aquí.
    # `is_disabled` tindrà el seu valor per defecte de `Field(default=False)` de ExerciseSchema.
    # `default_exercise_uuid` serà nullable com es defineix a ExerciseSchema.


class DefaultExerciseModel(DefaultExerciseSchema, table=True):
    """
    Model que representa un exercici per defecte predefinit en el sistema.
    Aquests exercicis serveixen com a base o exemples per als usuaris.
    Hereta camps de `DefaultExerciseSchema`.
    """

    __tablename__ = (
        "default_exercise"  # Nom de la taula a la base de dades # pyright: ignore[]
    )

    # Identificador únic universal per a l'exercici per defecte.
    # Similar a ExerciseModel.uuid.
    # Aquest camp sobreescriu o defineix l'atribut 'uuid' que podria existir a DefaultExerciseSchema.
    uuid: UUID_TYPE = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True),  # Utilitza el tipus UUID natiu de PostgreSQL
            primary_key=True,
            default=uuid4,
            index=True,
            nullable=False,
        )
    )
    # Part del cos principal que treballa aquest exercici per defecte.
    # Sobreescriu o defineix l'atribut 'body_part' que podria existir a DefaultExerciseSchema.
    body_part: BodyPart = Field(sa_column=sa.Column(Enum(BodyPart), nullable=False))
    # Tipus d'exercici per defecte.
    # Sobreescriu o defineix l'atribut 'type' que podria existir a DefaultExerciseSchema.
    type: ExerciseType = Field(sa_column=sa.Column(Enum(ExerciseType), nullable=False))
    # Els camps 'name' i 'description' s'hereten de DefaultExerciseSchema.
