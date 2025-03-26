from decouple import config

POSTGRES_URL = config("POSTGRES_URL", default="postgres", cast=str)
POSTGRES_USER = config("POSTGRES_USER", default="", cast=str)
POSTGRES_PASSWORD = config("POSTGRES_PASSWORD", default="", cast=str)
POSTGRES_DB = config("POSTGRES_DB", default="ultra-backend", cast=str)

OAUTH2_SECRET_KEY = config("OAUTH2_SECRET_KEY", default="", cast=str)
OAUTH2_TOKEN_EXPIRE_MINUTES = config("OAUTH2_TOKEN_EXPIRE_MINUTES", default=0, cast=int)
