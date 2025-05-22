from uuid import UUID
from sqlmodel import SQLModel


class UserSchema(SQLModel):
    """
    Esquema base que representa les dades fonamentals d'un usuari.
    Aquest esquema es pot utilitzar per retornar informació d'usuari o com a base per a altres esquemes.
    """

    uuid: UUID  # Identificador únic de l'usuari.
    username: str  # Nom d'usuari, utilitzat per a l'inici de sessió i identificació.
    full_name: str  # Nom complet de l'usuari.
    biography: str  # Biografia de l'usuari.


class UserInputSchema(SQLModel):
    """
    Esquema utilitzat per a l'entrada de dades quan es crea o s'actualitza un usuari.
    Tots els camps són opcionals, permetent actualitzacions parcials del perfil d'usuari.
    """

    username: str | None = None  # Nou nom d'usuari.
    full_name: str | None = None  # Nou nom complet.
    biography: str | None = None  # Nova biografia.


class UserInfoSchema(UserSchema):
    """
    Esquema que estén `UserSchema` per incloure informació addicional sobre l'usuari.
    Inclou un valor booleà que indica si l'usuari té el rol d'entrenador.
    """

    # Indica si l'usuari està registrat com a entrenador.
    # Per defecte, es considera que un usuari no és un entrenador.
    is_trainer: bool = False
