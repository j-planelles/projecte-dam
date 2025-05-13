from uuid import UUID

from db import session_generator
from models.trainer import UserInterestModel


DEFAULT_INTERESTS = [
    UserInterestModel(
        uuid=UUID("f83e330c-92f5-4374-8666-15318e438589"), name="Bodybuilding"
    ),
    UserInterestModel(
        uuid=UUID("dd1f628b-f627-426a-a321-b817bc5c578f"), name="Pilates"
    ),
    UserInterestModel(
        uuid=UUID("6cf8bde7-46c6-4490-9915-274b853abd9b"), name="Running"
    ),
    UserInterestModel(
        uuid=UUID("78a63cdb-853f-48c8-a38c-337abb0b3caf"), name="Weightlifting"
    ),
    UserInterestModel(
        uuid=UUID("9950898f-16cb-43d8-9a99-391d331a8995"), name="CrossFit"
    ),
    UserInterestModel(uuid=UUID("0c01f717-9c4a-44fe-9a22-7e43806a8003"), name="Yoga"),
    UserInterestModel(uuid=UUID("96e048d3-5cd2-41b5-9beb-b0a7ba1a0dd8"), name="HIIT"),
    UserInterestModel(uuid=UUID("f882cc21-a899-4a69-815b-1d5b16e1ff5d"), name="Cardio"),
    UserInterestModel(
        uuid=UUID("f03f274c-a8fc-4579-8bf2-61c83a39a863"), name="Strength Training"
    ),
    UserInterestModel(
        uuid=UUID("703686f7-0f12-43fc-b03a-5025a430c7f1"), name="Powerlifting"
    ),
    UserInterestModel(
        uuid=UUID("8d243894-e909-49d3-a7c8-317526e053cc"), name="Nutrition"
    ),
    UserInterestModel(
        uuid=UUID("cdfb711e-d95b-45f0-a03d-8d0e62d09870"), name="Flexibility"
    ),
    UserInterestModel(
        uuid=UUID("ad105699-560f-4ab8-9c56-da6c7fd0cb2b"), name="Mobility"
    ),
    UserInterestModel(
        uuid=UUID("2bdf984b-df23-495c-ad03-753c2b4c9d5e"), name="Endurance Training"
    ),
    UserInterestModel(
        uuid=UUID("87794146-ec1a-4789-b874-bd7f0710ad34"), name="Calisthenics"
    ),
    UserInterestModel(
        uuid=UUID("8aaf55a7-acf1-4e81-99bd-83c0f963be30"), name="Spinning"
    ),
    UserInterestModel(
        uuid=UUID("703097d8-dd87-436d-8f28-ed0bffda236b"), name="Kickboxing"
    ),
    UserInterestModel(
        uuid=UUID("a76e7b87-d4ee-4bf8-98a1-e03bf8daf36b"), name="Aerobics"
    ),
    UserInterestModel(
        uuid=UUID("eb1700c1-61da-42ab-af53-293bf497ffd0"), name="Personal Training"
    ),
    UserInterestModel(
        uuid=UUID("5eac03e4-d4d4-4333-b94b-40f264a0654c"), name="Group Fitness"
    ),
    UserInterestModel(
        uuid=UUID("fba2abee-ab15-4c1b-8b80-c346951d2201"), name="Core Workouts"
    ),
    UserInterestModel(
        uuid=UUID("3bc43b52-b4f5-4230-8994-c89cf0ed4ff4"), name="Functional Training"
    ),
    UserInterestModel(
        uuid=UUID("092201d7-a372-4eb7-a7d3-26692e4843aa"), name="Recovery"
    ),
    UserInterestModel(
        uuid=UUID("4165ff99-e7cc-41eb-b5d3-f1c839495cfc"), name="Stretching"
    ),
    UserInterestModel(
        uuid=UUID("33d08c2d-a7ee-4eff-9bf0-ffc1064a1498"), name="Sports Performance"
    ),
    UserInterestModel(
        uuid=UUID("169cd876-585a-4ba1-bdac-b72e915bcfcd"), name="Injury Prevention"
    ),
    UserInterestModel(
        uuid=UUID("abebe5fb-b017-4961-805d-2e23387fa3cd"), name="Supplements"
    ),
    UserInterestModel(
        uuid=UUID("4534421b-ae3b-4631-b441-408633a8cfa6"), name="Fat Loss"
    ),
    UserInterestModel(
        uuid=UUID("fae43cb4-54a1-4392-b48d-e32af7e0c2b9"), name="Muscle Gain"
    ),
    UserInterestModel(
        uuid=UUID("06d3a6fb-75a2-4274-bba0-547fa02e17f9"), name="Mental Health"
    ),
]


def add_default_interests():
    try:
        with session_generator as session:
            session.add_all(DEFAULT_INTERESTS)
            session.commit()
        print("Added default interests")
    except:
        print("Failed to add default interests")
