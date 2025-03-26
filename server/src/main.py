from contextlib import asynccontextmanager

from db import engine
from fastapi import FastAPI
from models.core import HealthCheck
from security import router as security_router
from sqlmodel import SQLModel


# Aquesta funció gestiona la creació de la base de dades abans de que s'inicialitzi FastAPI
@asynccontextmanager
async def lifespan(_: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(security_router)


@app.get("/", response_model=HealthCheck, tags=["status"], description="Health check")
async def health_check():
    return {"name": "Ultra Workout Server", "version": "0.0.0"}
