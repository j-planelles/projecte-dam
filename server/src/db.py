from config import POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_URL, POSTGRES_USER
from sqlalchemy import Engine
from sqlmodel import Session, create_engine


if POSTGRES_USER == "":
    raise NotImplementedError("POSTGRES_USER enviroment variable must be set!")

if POSTGRES_PASSWORD == "":
    raise NotImplementedError("POSTGRES_PASSWORD enviroment variable must be set!")


database_url = f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_URL}:5432/{POSTGRES_DB}"

engine: Engine = create_engine(database_url, echo=True)
session_generator = Session(bind=engine)


def get_session():
    with session_generator as session:
        yield session
