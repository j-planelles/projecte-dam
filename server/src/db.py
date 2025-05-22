from config import POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_URL, POSTGRES_USER
from sqlalchemy import Engine
from sqlmodel import Session, create_engine


# Comprova si la variable d'entorn POSTGRES_USER està configurada.
if POSTGRES_USER == "":
    raise NotImplementedError("POSTGRES_USER enviroment variable must be set!")

# Comprova si la variable d'entorn POSTGRES_PASSWORD està configurada.
if POSTGRES_PASSWORD == "":
    raise NotImplementedError("POSTGRES_PASSWORD enviroment variable must be set!")


# Construeix la URL de connexió a la base de dades PostgreSQL.
# psycopg és el driver de Python per a PostgreSQL.
database_url = f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_URL}:5432/{POSTGRES_DB}"

# Crea el motor (engine) de SQLAlchemy per a la connexió a la base de dades.
# L'engine gestiona la connexió a baix nivell amb la base de dades.
engine: Engine = create_engine(database_url)

# Crea una instància de Session vinculada a l'engine.
# Aquesta instància es pot utilitzar com a context manager per obtenir sessions individuals.
session_generator = Session(bind=engine)


def get_session():
    """
    Dependència per a FastAPI que proporciona una sessió de base de dades.

    Aquesta funció s'utilitza com a dependència en les rutes de FastAPI per retornar
    una sessió de base de dades. La sessió es tanca automàticament
    quan la resposta s'ha enviat.

    Yields:
        Session: Una sessió de SQLModel activa.
    """
    with session_generator as session:
        yield session # Proporciona la sessió a la ruta que la depèn.