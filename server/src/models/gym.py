from uuid import UUID as UUID_TYPE, uuid4
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from sqlmodel import Column, Field, Relationship

from schemas.gym_schema import GymSchema


class GymModel(GymSchema, table=True):
    __tablename__ = "gym"  # pyright: ignore[]
    uuid: UUID_TYPE = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True),  # Use the PG UUID type
            primary_key=True,
            default=uuid4,
            index=True,
            nullable=False,
        )
    )
    owner: "GymOwnerModel" = Relationship()


from models.users import GymOwnerModel
