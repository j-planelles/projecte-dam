from sqlmodel import SQLModel, Field


class UserSchema(SQLModel):
    username: str = Field(unique=True)
    full_name: str
    biography: str | None = None
