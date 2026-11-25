import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Uses DATABASE_URL from environment (e.g. Render PostgreSQL).
# Falls back to local SQLite database if PostgreSQL is not configured.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./yatrisync.db")

# Handle Render's postgres:// prefix vs SQLAlchemy's postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
