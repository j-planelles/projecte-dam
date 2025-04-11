from enum import Enum


class ExerciseType(Enum):
    BARBELL = "barbell"
    DUMBELL = "dumbell"
    MACHINE = "machine"
    OTHER = "other"
    BODYWEIGHT = "bodyweight"
    ASSISTED_BODYWEIGHT = "assisted-bodyweight"
    REPS_ONLY = "reps-only"
    CARDIO = "cardio"
    DURATION = "duration"
    COUNTDOWN = "countdown"


class BodyPart(Enum):
    NONE = "none"
    ARMS = "arms"
    BACK = "back"
    SHOULDERS = "shoulders"
    CARDIO = "cardio"
    CHEST = "chest"
    CORE = "core"
    FULL_BODY = "full-body"
    LEGS = "legs"
    OLYMPIC = "olympic"
    OTHER = "other"


class SetType(Enum):
    NORMAL = "normal"
    DROPSET = "dropset"
    FAILTURE = "failture"


class WeightUnit(Enum):
    METRIC = "metric"
    IMPERIAL = "imperial"


class TrainerRequestActions(Enum):
    ACCEPT = "accept"
    DENY = "deny"
