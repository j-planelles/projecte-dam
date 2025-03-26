from uuid import UUID as UUID_TYPE

from schemas.types.uuid import uuid_field
from sqlmodel import SQLModel


class UserSchema(SQLModel):
    username: str
    email: str | None = None
    full_name: str | None = None


class UserInDB(UserSchema, table=True):
    __tablename__ = "users" # pyright: ignore[]
    uuid: UUID_TYPE = uuid_field
    hashed_password: str
    disabled: bool | None = None
