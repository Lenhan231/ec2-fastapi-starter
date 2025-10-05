from __future__ import annotations

from collections.abc import Generator
from typing import Optional

from sqlmodel import Session, SQLModel, create_engine, select

from .settings import settings

engine = create_engine(settings.database_url, echo=settings.sql_echo, connect_args=settings.connect_args)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def is_database_empty(session: Session) -> bool:
    from .. import models  # Import here to avoid circular dependency

    # Simple check: if any gym exists we consider seeded
    return session.exec(select(models.Gym)).first() is None
