from contextlib import asynccontextmanager
from time import sleep

from config import SERVER_NAME
from data.default_exercises import add_default_exercises
from data.default_interests import add_default_interests
from db import engine
from fastapi import FastAPI
from models.core import HealthCheck
from routes.exercise_router import router as exercise_router
from routes.template_router import router as template_router
from routes.workout_router import router as workout_router
from routes.trainer_router import router as trainer_router
from routes.message_router import router as message_router
from security import router as security_router
from sqlmodel import SQLModel
from fastapi.middleware.cors import CORSMiddleware


# Aquesta funció gestiona el cicle de vida de l'aplicació.
# Aquest s'executa abans d'inicar el servidor FastAPI per afegir dades d'exemple a la base de dades.
@asynccontextmanager
async def lifespan(_: FastAPI):
    # Esperar a que la base de dades s'inicialitzi.
    print("Waiting for database to initialize...")
    sleep(2)

    SQLModel.metadata.create_all(
        engine
    )  # Crear totes les taues dels models definits amb SQLModel.
    add_default_exercises()  # Afegir exercicis predeterminats
    add_default_interests()  # Afegir interessos predeterminats

    yield


app = FastAPI(lifespan=lifespan)  # Objecte general de FastAPI

# Configurar el Cross-Origin Resource Sharing per l'aplicatiu Web.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Importar routers
app.include_router(security_router)
app.include_router(exercise_router)
app.include_router(workout_router)
app.include_router(template_router)
app.include_router(trainer_router)
app.include_router(message_router)


@app.get("/", response_model=HealthCheck, tags=["status"], description="Health check")
async def health_check():
    """
    Aquesta funció retorna el nom del servidor per mostrar-lo a la pantalla de log-in dels clients.
    """
    return {"name": SERVER_NAME}
