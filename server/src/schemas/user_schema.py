from uuid import UUID
from sqlmodel import SQLModel


class UserSchema(SQLModel):
    uuid: UUID
    username: str
    full_name: str
    biography: str

class UserInputSchema(SQLModel):
    username: str | None = None
    full_name: str | None = None
    biography: str | None = None


class UserInfoSchema(UserSchema):
    is_trainer: bool = False
