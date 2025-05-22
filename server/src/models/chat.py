from uuid import UUID as UUID_TYPE

from sqlmodel import BigInteger, Column, Field, Relationship, SQLModel, UniqueConstraint

from models.users import TrainerModel, UserModel


class MessageModel(SQLModel, table=True):
    """
    Model que representa un missatge de xat entre un usuari i un entrenador.
    La clau primària és composta per (user_uuid, trainer_uuid, timestamp),
    assegurant que cada missatge sigui únic dins d'una conversa en un moment donat.
    """

    __tablename__ = "message"  # Nom de la taula a la base de dades # pyright: ignore[]

    # Clau forana que enllaça amb l'UUID de l'usuari (de la taula 'users'). Part de la clau primària.
    user_uuid: UUID_TYPE = Field(foreign_key="users.uuid", primary_key=True)
    # Clau forana que enllaça amb l'UUID de l'entrenador (de la taula 'trainer'). Part de la clau primària.
    trainer_uuid: UUID_TYPE = Field(foreign_key="trainer.user_uuid", primary_key=True)

    # Relació amb el model UserModel (l'usuari implicat en el missatge).
    # `uselist=False` indica que cada missatge pertany a un sol usuari en aquest context.
    # `foreign_keys` especifica la columna en AQUEST model (`MessageModel`) que s'utilitza per a la relació.
    user: UserModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,  # Un missatge té un usuari associat
            "foreign_keys": "[MessageModel.user_uuid]",  # Especifica la clau forana en aquest model
        }
    )
    # Relació amb el model TrainerModel (l'entrenador implicat en el missatge).
    trainer: TrainerModel = Relationship(
        sa_relationship_kwargs={
            "uselist": False,  # Un missatge té un entrenador associat
            "foreign_keys": "[MessageModel.trainer_uuid]",  # Especifica la clau forana en aquest model
        }
    )

    # Marca de temps Unix (en milisegons) de quan es va enviar el missatge.
    # És part de la clau primària per identificar unívocament un missatge dins d'una conversa.
    # S'emmagatzema com un BigInteger per acomodar valors grans.
    timestamp: int = Field(sa_column=Column(BigInteger(), primary_key=True))

    # Contingut textual del missatge.
    content: str

    # Indicador booleà que mostra si el missatge va ser enviat per l'entrenador (True) o per l'usuari (False).
    is_sent_by_trainer: bool

    # Defineix una restricció d'unicitat per a la combinació de user_uuid, trainer_uuid i timestamp.
    # Encara que és tècnicament redundant, aquesta restricció és necessària per eviar que SQLModel
    # crei conflictes a l'hora de treballar amb una clau primària composta.
    __table_args__ = (UniqueConstraint("user_uuid", "trainer_uuid", "timestamp"),)
