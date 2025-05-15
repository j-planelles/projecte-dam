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


# Aquesta funció gestiona la creació de la base de dades abans de que s'inicialitzi FastAPI
@asynccontextmanager
async def lifespan(_: FastAPI):
    print("Waiting for database to initialize...")
    sleep(2)

    SQLModel.metadata.create_all(engine)
    add_default_exercises()
    add_default_interests()

    yield


app = FastAPI(lifespan=lifespan)

# Fix CORS for Tauri app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of allowed origins
    allow_credentials=True,  # Allow credentials (cookies, auth headers)
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(security_router)
app.include_router(exercise_router)
app.include_router(workout_router)
app.include_router(template_router)
app.include_router(trainer_router)
app.include_router(message_router)


@app.get("/", response_model=HealthCheck, tags=["status"], description="Health check")
async def health_check():
    return {"name": SERVER_NAME}
