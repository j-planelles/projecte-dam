from uuid import UUID as UUID_TYPE
from uuid import uuid4

from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import (
    BigInteger,
    Column,
    Enum,
    Field,
    ForeignKeyConstraint,
    Relationship,
    SQLModel,
)

from schemas.types.enums import SetType, WeightUnit


class WorkoutContentModel(SQLModel, table=True):
    """
    Model que representa el contingut principal d'un entrenament.
    Pot ser una plantilla o un entrenament realitzat (si té una instància associada).
    """

    __tablename__ = (
        "workout_content"  # Nom de la taula a la base de dades # pyright: ignore[]
    )

    # Identificador únic per a l'entrenament.
    # Utilitza el tipus UUID de PostgreSQL per a un emmagatzematge eficient.
    # És la clau primària, es genera automàticament si no es proporciona, indexat i no nul.
    uuid: UUID_TYPE = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True),  # Utilitza el tipus UUID natiu de PostgreSQL
            primary_key=True,
            default=uuid4,  # Valor per defecte si no es proporciona: un nou UUID v4
            index=True,  # Crea un índex en aquesta columna per a cerques ràpides
            nullable=False,  # No pot ser nul
        )
    )

    name: str  # Nom de l'entrenament.
    description: str | None = None  # Descripció opcional de l'entrenament.

    # Clau forana que enllaça amb l'UUID de l'usuari creador (de la taula 'users').
    creator_uuid: UUID_TYPE = Field(foreign_key="users.uuid")

    # Relació un-a-un (o un-a-zero) amb WorkoutInstanceModel.
    # `uselist=False` indica que és una relació a un sol objecte.
    # `cascade="all"` significa que les operacions (com eliminar) en WorkoutContentModel
    # es propagaran a la WorkoutInstanceModel associada.
    instance: "WorkoutInstanceModel" = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "cascade": "all, delete-orphan",
        }  # Afegit delete-orphan
    )

    # Relació un-a-molts amb WorkoutEntryModel.
    # `cascade="all"` propaga operacions a les entrades associades.
    entries: list["WorkoutEntryModel"] = Relationship(
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}  # Afegit delete-orphan
    )


class WorkoutInstanceModel(SQLModel, table=True):
    """
    Model que representa una instància específica d'un entrenament realitzat.
    Conté informació temporal sobre l'execució.
    """

    __tablename__ = "workout_instance"  # Nom de la taula # pyright: ignore[]

    # Clau forana que enllaça amb l'UUID de WorkoutContentModel.
    # També és la clau primària d'aquesta taula, formant una relació un-a-un.
    workout_uuid: UUID_TYPE = Field(
        foreign_key="workout_content.uuid", primary_key=True
    )
    # Marca de temps Unix (en milisegons) de quan va començar l'entrenament.
    # S'emmagatzema com un BigInteger per acomodar valors grans.
    timestamp_start: int = Field(sa_column=Column(BigInteger()))
    duration: int  # Durada total de l'entrenament (en segons).


class WorkoutEntryModel(SQLModel, table=True):
    """
    Model que representa una entrada d'exercici dins d'un entrenament.
    Cada entrada correspon a un exercici específic i conté una llista de sèries.
    """

    __tablename__ = "workout_entry"  # Nom de la taula # pyright: ignore[]

    # Part de la clau primària composta: UUID de l'entrenament al qual pertany.
    workout_uuid: UUID_TYPE = Field(
        foreign_key="workout_content.uuid", primary_key=True
    )
    # Part de la clau primària composta: índex de l'entrada dins de l'entrenament (per mantenir l'ordre).
    index: int = Field(primary_key=True)

    # Durada del compte enrere per al descans després d'aquesta entrada (en segons). Opcional.
    rest_countdown_duration: int | None = None

    # Unitat de pes utilitzada per a aquest exercici (metric o imperial). Opcional.
    # S'emmagatzema com un tipus Enum a la base de dades.
    weight_unit: WeightUnit | None = Field(
        sa_column=Column(Enum(WeightUnit), nullable=True), default=None
    )

    # Clau forana que enllaça amb l'UUID de l'exercici (de la taula 'exercise').
    exercise_uuid: UUID_TYPE = Field(foreign_key="exercise.uuid")

    # Relació amb el model ExerciseModel.
    # `foreign_keys` especifica explícitament la columna de clau forana a utilitzar per a la relació.
    exercise: "ExerciseModel" = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[WorkoutEntryModel.exercise_uuid]",
        }
    )

    # Relació un-a-molts amb WorkoutSetModel.
    # `back_populates` estableix la relació bidireccional amb el camp 'entry' de WorkoutSetModel.
    # `cascade="all"` propaga operacions.
    sets: list["WorkoutSetModel"] = Relationship(
        back_populates="entry",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class WorkoutSetModel(SQLModel, table=True):
    """
    Model que representa una única sèrie (set) dins d'una entrada d'exercici.
    """

    __tablename__ = "workout_set"  # Nom de la taula # pyright: ignore[]

    # Part de la clau primària composta: UUID de l'entrenament.
    workout_uuid: UUID_TYPE = Field(primary_key=True)
    # Part de la clau primària composta: índex de l'entrada d'exercici a la qual pertany aquesta sèrie.
    entry_index: int = Field(primary_key=True)
    # Part de la clau primària composta: índex de la sèrie dins de l'entrada (per mantenir l'ordre).
    index: int = Field(primary_key=True)

    reps: int | None = (
        None  # Nombre de repeticions realitzades o a realitzar. Opcional.
    )
    weight: float | None = None  # Pes utilitzat en la sèrie. Opcional.
    # Tipus de sèrie (normal, drop set, failture). Per defecte és 'normal'.
    # S'emmagatzema com un tipus Enum a la base de dades.
    set_type: SetType = Field(sa_column=Column(Enum(SetType)), default=SetType.NORMAL)

    # Relació molts-a-un amb WorkoutEntryModel.
    # `back_populates` estableix la relació bidireccional amb el camp 'sets' de WorkoutEntryModel.
    entry: "WorkoutEntryModel" = Relationship(
        back_populates="sets"
        # No cal cascade="all" aquí generalment, ja que la cascada des de WorkoutEntryModel a WorkoutSetModel és suficient.
        # Si s'elimina un WorkoutSetModel individualment, no hauria d'afectar el WorkoutEntryModel.
    )

    # Defineix una restricció de clau forana composta que enllaça (workout_uuid, entry_index)
    # amb les columnes corresponents de la taula 'workout_entry'.
    __table_args__ = (
        ForeignKeyConstraint(
            [
                "workout_uuid",
                "entry_index",
            ],  # Columnes en aquesta taula (WorkoutSetModel)
            [
                "workout_entry.workout_uuid",
                "workout_entry.index",
            ],  # Columnes en la taula referenciada (workout_entry)
            ondelete="CASCADE",  # Si s'elimina una entrada (WorkoutEntry), s'eliminen els seus sets.
        ),
    )


# Importació del model ExerciseModel.
# Aquesta importació és necessària perquè les cadenes de tipus com "ExerciseModel"
# en les anotacions de Relationship puguin ser resoltes per SQLModel o Pydantic.
# Es col·loca aquí per evitar problemes d'importació circular.
from models.exercise import ExerciseModel
