from enum import auto, StrEnum


class ExerciseType(StrEnum):
    barbell = auto()
    dumbell = auto()
    machine = auto()
    other = auto()
    bodyweight = auto()
    assisted_bodyweight = auto()
    reps_only = auto()
    cardio = auto()
    duration = auto()
    countdown = auto()


class BodyPart(StrEnum):
    none = auto()
    arms = auto()
    back = auto()
    shoulders = auto()
    cardio = auto()
    chest = auto()
    core = auto()
    full_body = auto()
    legs = auto()
    olympic = auto()
    other = auto()


class SetType(StrEnum):
    normal = auto()
    dropset = auto()
    failture = auto()


class WeightUnit(StrEnum):
    metric = auto()
    imperial = auto()
