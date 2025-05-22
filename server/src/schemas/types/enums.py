from enum import Enum


class ExerciseType(Enum):
    """
    Enumeració que defineix els diferents tipus d'exercicis disponibles.
    Aquests tipus ajuden a categoritzar els exercicis segons l'equipament utilitzat o la naturalesa de l'activitat.
    """
    BARBELL = "barbell" # Exercici realitzat amb barra.
    DUMBELL = "dumbell" # Exercici realitzat amb manuelles.
    MACHINE = "machine" # Exercici realitzat amb una màquina de gimnàs.
    OTHER = "other" # Altres tipus d'exercicis que no encaixen en les categories anteriors.
    BODYWEIGHT = "bodyweight" # Exercici realitzat utilitzant només el pes corporal.
    ASSISTED_BODYWEIGHT = "assisted-bodyweight" # Exercici de pes corporal amb assistència (p. ex., dominades assistides).
    REPS_ONLY = "reps-only" # Exercici on només es compten les repeticions (sense pes).
    CARDIO = "cardio" # Exercici cardiovascular.
    DURATION = "duration" # Exercici mesurat per durada en lloc de repeticions.
    COUNTDOWN = "countdown" # Exercici que implica un compte enrere.


class BodyPart(Enum):
    """
    Enumeració que defineix les diferents parts del cos que es poden treballar amb els exercicis.
    """
    NONE = "none" # Cap part del cos específica (potser per a exercicis generals o de tot el cos).
    ARMS = "arms" # Braços (bíceps, tríceps, avantbraços).
    BACK = "back" # Esquena (dorsals, lumbars, trapezis).
    SHOULDERS = "shoulders" # Espatlles (deltoides).
    CARDIO = "cardio" # Relacionat amb el sistema cardiovascular, no una part muscular específica.
    CHEST = "chest" # Pit (pectorals).
    CORE = "core" # Nucli del cos (abdominals, oblics, zona lumbar).
    FULL_BODY = "full-body" # Exercici que implica tot el cos.
    LEGS = "legs" # Cames (quàdriceps, isquiotibials, bessons, glutis).
    OLYMPIC = "olympic" # Relacionat amb aixecaments olímpics, que solen ser de cos sencer.
    OTHER = "other" # Altres parts del cos o categories no especificades.


class SetType(Enum):
    """
    Enumeració que defineix els diferents tipus de sèries (sets) que es poden realitzar en un exercici.
    """
    NORMAL = "normal" # Una sèrie estàndard.
    DROPSET = "dropset" # Una sèrie on es redueix el pes immediatament després d'arribar a la fallada muscular i es continuen les repeticions.
    FAILTURE = "failture" # Una sèrie portada fins a la fallada muscular (no es poden completar més repeticions amb bona forma).


class WeightUnit(Enum):
    """
    Enumeració que defineix les unitats de mesura per al pes utilitzat en els exercicis.
    """
    METRIC = "metric" # Sistema mètric.
    IMPERIAL = "imperial" # Sistema imperial.


class TrainerRequestActions(Enum):
    """
    Enumeració que defineix les possibles accions que es poden prendre sobre una sol·licitud d'entrenador.
    """
    ACCEPT = "accept" # Acció d'acceptar la sol·licitud.
    DENY = "deny" # Acció de rebutjar la sol·licitud.