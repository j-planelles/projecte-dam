from uuid import UUID

from db import session_generator
from models.exercise import DefaultExerciseModel
from schemas.types.enums import BodyPart, ExerciseType


# Llista predefinida d'exercicis per defecte.
# Cada element és una instància de DefaultExerciseModel amb un UUID específic, nom,
# descripció, part del cos que treballa i tipus d'exercici.
# Aquests UUIDs són fixos per evitar conflictes.
DEFAULT_EXERCISES = [
    DefaultExerciseModel(
        uuid=UUID("0dec2aff-dd6e-4ab6-84e0-1b005fa9190d"),
        name="Barbell Bench Press",
        description="Lie on a bench and press a barbell upward from chest level",
        body_part=BodyPart.CHEST,
        type=ExerciseType.BARBELL,
    ),
    DefaultExerciseModel(
        uuid=UUID("aeb904bb-ec10-4644-b5ee-1b531bc96e0b"),
        name="Deadlift",
        description="Lift a barbell from the ground to hip level",
        body_part=BodyPart.BACK,
        type=ExerciseType.BARBELL,
    ),
    DefaultExerciseModel(
        uuid=UUID("d825e765-7856-467a-a8d6-5c160061dd69"),
        name="Squat",
        description="Lower your body by bending knees with a barbell on shoulders",
        body_part=BodyPart.LEGS,
        type=ExerciseType.BARBELL,
    ),
    DefaultExerciseModel(
        uuid=UUID("2dd12177-0614-4073-b2e5-c9931774457f"),
        name="Pull-Up",
        description="Lift your body up to a bar using your arms",
        body_part=BodyPart.BACK,
        type=ExerciseType.BODYWEIGHT,
    ),
    DefaultExerciseModel(
        uuid=UUID("3a7e0483-84e5-4d67-a83c-66e3a9c59d70"),
        name="Dumbbell Shoulder Press",
        description="Press dumbbells overhead from shoulder level",
        body_part=BodyPart.SHOULDERS,
        type=ExerciseType.DUMBELL,
    ),
    DefaultExerciseModel(
        uuid=UUID("7fc92f5a-7d5b-4eac-a338-851c7f0adad0"),
        name="Leg Press",
        description="Push a weighted platform away with your legs",
        body_part=BodyPart.LEGS,
        type=ExerciseType.MACHINE,
    ),
    DefaultExerciseModel(
        uuid=UUID("e0fd2208-5e38-4c1b-8d3a-2d780519b5d1"),
        name="Bicep Curl",
        description="Curl dumbbells toward shoulders to work biceps",
        body_part=BodyPart.ARMS,
        type=ExerciseType.DUMBELL,
    ),
    DefaultExerciseModel(
        uuid=UUID("db0e46be-9ad2-4532-814a-f92d678f7eb7"),
        name="Tricep Pushdown",
        description="Push cable attachment down to work triceps",
        body_part=BodyPart.ARMS,
        type=ExerciseType.MACHINE,
    ),
    DefaultExerciseModel(
        uuid=UUID("5ab04292-00a9-47d6-9a82-6e01f4f7819f"),
        name="Lat Pulldown",
        description="Pull a bar down toward your chest while seated",
        body_part=BodyPart.BACK,
        type=ExerciseType.MACHINE,
    ),
    DefaultExerciseModel(
        uuid=UUID("b7dc58a9-e17b-419e-a042-79e5a5ff429f"),
        name="Plank",
        description="Hold a position similar to a push-up to engage core",
        body_part=BodyPart.CORE,
        type=ExerciseType.BODYWEIGHT,
    ),
    DefaultExerciseModel(
        uuid=UUID("f6a40dc1-e62d-4e05-adbb-27f6a5d45127"),
        name="Treadmill Run",
        description="Running on a treadmill for cardiovascular exercise",
        body_part=BodyPart.CARDIO,
        type=ExerciseType.CARDIO,
    ),
    DefaultExerciseModel(
        uuid=UUID("b7e64eaf-51e5-4890-a6d7-8dea6d1e9818"),
        name="Rowing Machine",
        description="Use a rowing machine for full-body cardio workout",
        body_part=BodyPart.CARDIO,
        type=ExerciseType.CARDIO,
    ),
    DefaultExerciseModel(
        uuid=UUID("c54d5d12-5e7f-4cd7-93e1-b1c8da71ca64"),
        name="Leg Curl",
        description="Curl legs against resistance to work hamstrings",
        body_part=BodyPart.LEGS,
        type=ExerciseType.MACHINE,
    ),
    DefaultExerciseModel(
        uuid=UUID("f8f81a61-f6a0-4702-ba7a-5ca929152bd8"),
        name="Push-Up",
        description="Raise and lower body using arms while in plank position",
        body_part=BodyPart.CHEST,
        type=ExerciseType.BODYWEIGHT,
    ),
    DefaultExerciseModel(
        uuid=UUID("6e287dc5-a753-48e3-9c72-71349be7be10"),
        name="Dumbbell Lunge",
        description="Step forward into a lunge while holding dumbbells",
        body_part=BodyPart.LEGS,
        type=ExerciseType.DUMBELL,
    ),
    DefaultExerciseModel(
        uuid=UUID("fe162b61-33b5-41f1-9c8c-b82d18a31327"),
        name="Cable Fly",
        description="Pull cable handles together in front of chest",
        body_part=BodyPart.CHEST,
        type=ExerciseType.MACHINE,
    ),
    DefaultExerciseModel(
        uuid=UUID("97573b32-8d1c-46f2-9db5-63273a32f935"),
        name="Overhead Press",
        description="Press a barbell overhead from shoulder level",
        body_part=BodyPart.SHOULDERS,
        type=ExerciseType.BARBELL,
    ),
    DefaultExerciseModel(
        uuid=UUID("1d021c82-d7f0-4f57-a147-93f73378b3c7"),
        name="Chin-Up",
        description="Pull-up with palms facing you to target biceps and back",
        body_part=BodyPart.BACK,
        type=ExerciseType.BODYWEIGHT,
    ),
    DefaultExerciseModel(
        uuid=UUID("6b0fa6e3-d5b0-46c0-b87c-564a21ce699f"),
        name="Farmer's Walk",
        description="Walk while carrying heavy weights in each hand",
        body_part=BodyPart.FULL_BODY,
        type=ExerciseType.OTHER,
    ),
    DefaultExerciseModel(
        uuid=UUID("4df08c10-b28f-42fe-9384-347d6604fe2d"),
        name="Jump Rope",
        description="Skip rope for cardiovascular conditioning",
        body_part=BodyPart.CARDIO,
        type=ExerciseType.CARDIO,
    ),
]


def add_default_exercises():
    """
    Afegeix la llista `DEFAULT_EXERCISES` a la base de dades.
    Aquesta funció s'executa durant l'inicialització de la base de dades.

    Gestiona possibles errors durant la inserció a la base de dades
    i imprimeix un missatge d'èxit o de fallada.
    """
    try:
        # Utilitza el generador de sessions per obtenir una sessió de base de dades.
        # El context manager `with` assegura que la sessió es tanqui correctament.
        with session_generator as session:
            # Afegeix tots els objectes DefaultExerciseModel de la llista a la sessió.
            # Això els marca per a la inserció.
            session.add_all(DEFAULT_EXERCISES)
            # Confirma la transacció, guardant els canvis a la base de dades.
            session.commit()
        # Imprimeix un missatge si els exercicis s'han afegit correctament.
        print("Default exercises added successfully to the database.")
    except Exception as e: # Captura qualsevol excepció que pugui ocórrer durant el procés.
        # Imprimeix un missatge d'error si falla l'addició dels exercicis.
        # Inclou l'excepció per a més detalls de depuració.
        print(f"Failed to add default exercises: {e}")
