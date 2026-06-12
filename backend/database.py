import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use database URL if present (e.g. Postgres on Render), otherwise default to local SQLite
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///students.db")

# Render database URLs start with postgres:// but SQLAlchemy requires postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)