from sqlmodel import SQLModel


class UserSchema(SQLModel):
    username: str | None = None
    full_name: str | None = None
    biography: str | None = None
