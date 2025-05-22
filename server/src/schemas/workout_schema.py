from typing import List
from uuid import UUID as UUID_TYPE

from sqlmodel import BigInteger, Column, Field, SQLModel

from schemas.exercise_schema import ExerciseInputSchema
from schemas.types.enums import SetType, WeightUnit


class WorkoutSetSchema(SQLModel):
    """
    Esquema que representa una única sèrie (set) dins d'un exercici en un entrenament.
    """

    reps: int | None = (
        None  # Nombre de repeticions realitzades o a realitzar. És opcional ja que no es requereix a tots els tipus d'exercicis.
    )
    weight: float  # Pes utilitzat en la sèrie (en la unitat especificada a WorkoutEntrySchema).
    set_type: SetType  # Tipus de sèrie (normal, drop set, fins al fallo).


class WorkoutEntrySchema(SQLModel):
    """
    Esquema que representa un exercici dins d'un entrenament.
    Cada entrada correspon a un exercici específic i conté una llista de sèries.
    """

    rest_countdown_duration: int | None = (
        None  # Durada del compte enrere per al descans després d'aquesta entrada (en segons).
    )
    weight_unit: WeightUnit | None = (
        None  # Unitat de pes utilitzada per a aquest exercici.
    )

    exercise: ExerciseInputSchema  # Dades de l'exercici realitzat en aquesta entrada.
    sets: List[
        WorkoutSetSchema
    ]  # Llista de sèries (WorkoutSetSchema) realitzades per a aquest exercici.


class WorkoutInstanceSchema(SQLModel):
    """
    Esquema que representa una instància específica d'un entrenament que s'ha realitzat o s'està realitzant.
    Conté informació temporal sobre l'execució de l'entrenament.
    """

    # Marca de temps Unix (en milisegons) de quan va començar l'entrenament.
    # S'emmagatzema com un BigInteger a la base de dades per acomodar valors grans.
    timestamp_start: int = Field(sa_column=Column(BigInteger()))
    duration: (
        int  # Durada total de l'entrenament (en segons o la unitat de temps definida).
    )


class WorkoutContentSchema(SQLModel):
    """
    Esquema base que defineix el contingut d'un entrenament.
    Pot representar tant una plantilla d'entrenament com una instància realitzada.
    """

    uuid: UUID_TYPE | None = (
        None  # Identificador únic per a l'entrenament.
    )
    name: str  # Nom de l'entrenament.
    description: str | None = None  # Descripció opcional de l'entrenament.

    # Instància de l'entrenament (WorkoutInstanceSchema). Serà None si és una plantilla.
    instance: WorkoutInstanceSchema | None = None
    # Llista d'entrades d'exercicis (WorkoutEntrySchema) que componen l'entrenament.
    entries: list[WorkoutEntrySchema]


class WorkoutTemplateSchema(WorkoutContentSchema):
    """
    Esquema que representa una plantilla d'entrenament. Enviat pel client. 
    Utilitzat per crear i actualitzar plantilles.
    Hereta de WorkoutContentSchema, però s'assegura que no tingui una instància associada,
    ja que les plantilles són dissenys reutilitzables i no execucions concretes.
    """

    # Eliminar el camp 'instance' per assegurar-se que sempre sigui None per a les plantilles.
    instance: None = None


class WorkoutStatsSchema(SQLModel):
    """
    Esquema per representar estadístiques relacionades amb els entrenaments d'un usuari.
    Utilitzat al gràfic de "Workouts per week" a l'aplicació de móbil.
    """

    workouts: int  # Nombre total d'entrenaments realitzats.
    workouts_last_week: int  # Nombre d'entrenaments realitzats en l'última setmana.
    workouts_per_week: list[int] # Nombre d'entrenaments realitzats en les últiles 8 setmanes.
