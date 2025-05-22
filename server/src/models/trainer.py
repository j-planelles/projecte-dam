from uuid import UUID as UUID_TYPE

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

from models.users import TrainerModel, UserModel
from models.workout import WorkoutContentModel


class TrainerRecommendationModel(SQLModel, table=True):
    """
    Model que representa una recomanació d'entrenament feta per un entrenador a un usuari.
    Actua com una taula d'enllaç entre un usuari, un entrenador i un entrenament específic.
    La clau primària és composta per (user_uuid, trainer_uuid, workout_uuid),
    assegurant que una combinació específica només pugui existir una vegada.
    """

    __tablename__ = (
        "recommendation"  # Nom de la taula a la base de dades # pyright: ignore[]
    )

    # Clau forana que enllaça amb l'UUID de l'usuari (de la taula 'users'). Part de la clau primària.
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)
    # Clau forana que enllaça amb l'UUID de l'entrenador (de la taula 'trainer'). Part de la clau primària.
    trainer_uuid: UUID_TYPE = Field(foreign_key="trainer.user_uuid", primary_key=True)
    # Clau forana que enllaça amb l'UUID de l'entrenament (de la taula 'workout_content'). Part de la clau primària.
    workout_uuid: UUID_TYPE = Field(
        foreign_key="workout_content.uuid", primary_key=True
    )

    # Relació amb el model UserModel.
    # `uselist=False` indica que cada recomanació pertany a un sol usuari.
    # `foreign_keys` especifica la columna en aquest model (`TrainerRecommendationModel`) que s'utilitza per a la relació.
    user: UserModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRecommendationModel.user_uuid]",
        }
    )
    # Relació amb el model TrainerModel.
    trainer: TrainerModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRecommendationModel.trainer_uuid]",
        }
    )
    # Relació amb el model WorkoutContentModel.
    workout: WorkoutContentModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRecommendationModel.workout_uuid]",
        }
    )

    # Defineix una restricció d'unicitat per a la combinació de user_uuid, trainer_uuid i workout_uuid.
    # Encara que és tècnicament redundant, aquesta restricció és necessària per eviar que SQLModel
    # crei conflictes a l'hora de treballar amb una clau primària composta.
    __table_args__ = (UniqueConstraint("user_uuid", "trainer_uuid", "workout_uuid"),)


class TrainerRequestModel(SQLModel, table=True):
    """
    Model que representa una sol·licitud entre un usuari i un entrenador.
    Pot ser una sol·licitud d'un usuari per ser entrenat o una invitació d'un entrenador.
    La clau primària és composta per (user_uuid, trainer_uuid, created_at),
    indicant que una sol·licitud específica està definida per qui la fa, a qui va dirigida
    i quan es va crear.
    """

    __tablename__ = "trainer_request"  # Nom de la taula # pyright: ignore[]

    # Clau forana que enllaça amb l'UUID de l'usuari. Part de la clau primària.
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)
    # Clau forana que enllaça amb l'UUID de l'entrenador. Part de la clau primària.
    trainer_uuid: UUID_TYPE = Field(foreign_key="trainer.user_uuid", primary_key=True)

    # Relació amb el model UserModel (l'usuari que fa/rep la sol·licitud).
    user: UserModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRequestModel.user_uuid]",
        }
    )
    # Relació amb el model TrainerModel (l'entrenador implicat en la sol·licitud).
    trainer: "TrainerModel" = Relationship(
        sa_relationship_kwargs={
            "uselist": False,
            "foreign_keys": "[TrainerRequestModel.trainer_uuid]",
        }
    )
    # Marca de temps Unix de quan es va crear la sol·licitud. Part de la clau primària.
    created_at: int = Field(primary_key=True)

    # Indicador booleà que mostra si la sol·licitud ja ha estat processada (acceptada/rebutjada).
    # Per defecte és False (no processada).
    is_processed: bool = Field(default=False)


class UserInterestModel(SQLModel, table=True):
    """
    Model que defineix un interès disponible que els usuaris poden seleccionar
    (p. ex., tipus d'exercici, objectius de fitness).
    """

    __tablename__ = "interest"  # Nom de la taula # pyright: ignore[]

    # Identificador únic universal per a l'interès. Clau primària.
    uuid: UUID_TYPE = Field(primary_key=True)
    # Nom descriptiu de l'interès (p. ex., "Pèrdua de pes", "CrossFit").
    name: str


class UserInterestLinkModel(SQLModel, table=True):
    """
    Model que actua com una taula d'enllaç (many-to-many) entre usuaris i els seus interessos seleccionats.
    La clau primària és composta per (user_uuid, interest_uuid), assegurant que
    un usuari només pot estar enllaçat a un interès específic una vegada.
    """

    __tablename__ = "interest_link"  # Nom de la taula # pyright: ignore[]

    # Clau forana que enllaça amb l'UUID de l'usuari. Part de la clau primària.
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)
    # Clau forana que enllaça amb l'UUID de l'interès. Part de la clau primària.
    interest_uuid: UUID_TYPE = Field(foreign_key="interest.uuid", primary_key=True)
