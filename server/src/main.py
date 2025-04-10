from contextlib import asynccontextmanager
from time import sleep

from data.default_exercises import add_default_exercises
from db import engine
from fastapi import FastAPI
from models.core import HealthCheck
from routes.exercise_router import router as exercise_router
from routes.template_router import router as template_router
from routes.workout_router import router as workout_router
from security import router as security_router
from sqlmodel import SQLModel


# Aquesta funció gestiona la creació de la base de dades abans de que s'inicialitzi FastAPI
@asynccontextmanager
async def lifespan(_: FastAPI):
    print("Waiting for database to initialize...")
    sleep(2)

    SQLModel.metadata.create_all(engine)
    add_default_exercises()

    yield


app = FastAPI(lifespan=lifespan)
app.include_router(security_router)
app.include_router(exercise_router)
app.include_router(workout_router)
app.include_router(template_router)


@app.get("/", response_model=HealthCheck, tags=["status"], description="Health check")
async def health_check():
    return {"name": "Ultra Workout Server", "version": "0.0.0"}
