from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from dotenv import load_dotenv

from .api import auth, gyms, offers, pts, profile, moderation, reports
from .core.database import create_db_and_tables, engine
from .core.settings import settings
from .seed import ensure_seed_data

load_dotenv()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    create_db_and_tables()
    with Session(engine) as session:
        ensure_seed_data(session)


@app.get("/")
def root():
    return {"message": "Easy Body API is running"}


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


app.include_router(gyms.router)
app.include_router(offers.router)
app.include_router(pts.router)
app.include_router(profile.router)
app.include_router(moderation.router)
app.include_router(reports.router)
app.include_router(auth.router)
