import uuid

from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Column, Field

uuid_field: uuid.UUID = Field(
    sa_column=Column(
        PG_UUID(as_uuid=True),  # Use the PG UUID type
        primary_key=True,
        default=uuid.uuid4,
        index=True,
        nullable=False,
    )
)
