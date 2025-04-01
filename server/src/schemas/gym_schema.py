from uuid import UUID as UUID_TYPE

from sqlmodel import SQLModel


class GymSchema(SQLModel):
    uuid: UUID_TYPE
    name: str
    description: str
    address: str
