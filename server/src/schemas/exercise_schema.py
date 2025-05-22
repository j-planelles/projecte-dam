from uuid import UUID as UUID_TYPE

from pydantic import BaseModel
from sqlmodel import Field, SQLModel

from schemas.types.enums import BodyPart, ExerciseType


class DefaultExerciseSchema(SQLModel):
    """
    Esquema base que representa la informació fonamental d'un exercici per defecte.
    Aquests exercicis són definits en el sistema.
    """

    name: str  # Nom de l'exercici per defecte.
    description: str | None = None  # Descripció opcional de l'exercici per defecte.


class ExerciseSchema(DefaultExerciseSchema):
    """
    Esquema que representa un exercici complet, ja sigui un exercici per defecte o un creat per un usuari.
    Hereta de `DefaultExerciseSchema` i afegeix camps addicionals específics.
    Aquest esquema s'utilitza per representar un exercici creat per l'usuari.
    """

    uuid: UUID_TYPE  # Identificador únic de l'exercici.
    # Indicador booleà per marcar si l'exercici està desactivat. Per defecte és False.
    is_disabled: bool = Field(default=False)

    # Clau forana opcional que enllaça aquest exercici amb un exercici per defecte.
    # Si aquest camp té un valor, significa que aquest exercici es basa en un exercici predefinit.
    default_exercise_uuid: UUID_TYPE | None = Field(
        foreign_key="default_exercise.uuid", default=None
    )
    body_part: BodyPart  # Part del cos principal que treballa aquest exercici.
    type: ExerciseType # Tipus d'exercici.


class ExerciseInputSchema(BaseModel):
    """
    Esquema utilitzat per a l'entrada de dades quan es crea o s'actualitza un exercici.
    """

    uuid: UUID_TYPE | None = (
        None  # UUID de l'exercici. Opcional; si es proporciona, indica una actualització d'un exercici existent.
    )
    name: str  # Nom de l'exercici.
    description: str | None = None  # Descripció opcional de l'exercici.
    body_part: BodyPart  # Part del cos que treballa l'exercici.
    type: ExerciseType  # Tipus d'exercici.
    # UUID opcional de l'exercici per defecte en el qual es basa aquest exercici.
    default_exercise_uuid: UUID_TYPE | None = None
