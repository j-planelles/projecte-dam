from uuid import UUID as UUID_TYPE
from models.users import TrainerModel, UserModel
from models.workout import WorkoutContentModel
from sqlmodel import SQLModel


class TrainerRecommendationSchema(SQLModel):
    """
    Esquema que representa una recomanació d'entrenament feta per un entrenador a un usuari.
    Enllaça un usuari, un entrenador i un entrenament específic.
    """
    user: UserModel # L'usuari que rep la recomanació.
    trainer: TrainerModel # L'entrenador que fa la recomanació.
    workout: WorkoutContentModel # L'entrenament que s'està recomanant.


class TrainerRequestSchema(SQLModel):
    """
    Esquema que representa una sol·licitud entre un usuari i un entrenador.
    """
    user: UserModel # L'usuari implicat en la sol·licitud.
    trainer: TrainerModel # L'entrenador implicat en la sol·licitud.

    is_processed: bool = False # Un indicador booleà que mostra si la sol·licitud ja ha estat processada (acceptada o rebutjada). Per defecte és False.
    created_at: int # Marca de temps (timestamp) Unix de quan es va crear la sol·licitud.


class UserInterestSchema(SQLModel):
    """
    Esquema que representa un interès que un usuari pot tenir.
    S'utilitza a la llista d'interessos de l'app móbil.
    """
    uuid: UUID_TYPE # L'identificador únic de l'interès.
    name: str # El nom descriptiu de l'interès.
    selected: bool # Un indicador booleà que mostra si l'usuari ha seleccionat aquest interès.