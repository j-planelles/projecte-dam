from decouple import config

# Carregar variables d'entorn a variables internes exportables a altres móduls.
POSTGRES_URL = config(
    "POSTGRES_URL", default="postgres", cast=str
)  # URL de la base de dades.
POSTGRES_USER = config(
    "POSTGRES_USER", default="", cast=str
)  # Usuari de la base de dades.
POSTGRES_PASSWORD = config(
    "POSTGRES_PASSWORD", default="", cast=str
)  # Contrasenya de la base de dades.
POSTGRES_DB = config(
    "POSTGRES_DB", default="ultra-backend", cast=str
)  # Nom de la base de dades.

SERVER_NAME = config(
    "ULTRA_BACKEND_NAME", default="Ultra Workout Server", cast=str
)  # Nom del servidor per mostrar a la pantalla de Login
OAUTH2_SECRET_KEY = config(
    "OAUTH2_SECRET_KEY", default="jordiplanellesperez1234", cast=str
)  # Clau per encriptar els tokens JWT
