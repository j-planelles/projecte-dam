from sqlmodel import SQLModel


class GymSchema(SQLModel):
    name: str
    description: str
    address: str
