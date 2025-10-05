from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from .. import models, schemas
from ..core.security import create_access_token, get_password_hash, verify_password
from ..core.settings import settings
from .deps import SessionDep, get_current_auth_user

router = APIRouter(prefix="/auth", tags=["auth"])


def _create_token_response(email: str) -> schemas.Token:
    expire = timedelta(minutes=settings.access_token_expire_minutes)
    token = create_access_token(email, expires_delta=expire)
    return schemas.Token(
        access_token=token,
        expires_in=int(expire.total_seconds()),
    )


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(payload: schemas.AuthRegisterRequest, session: SessionDep) -> schemas.Token:
    existing = session.exec(select(models.AuthUser).where(models.AuthUser.email == payload.email)).one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = get_password_hash(payload.password)
    profile = models.UserProfile(name=payload.name, email=payload.email, role=payload.role)
    session.add(profile)
    session.flush()

    auth_user = models.AuthUser(
        email=payload.email,
        hashed_password=hashed_password,
        role=payload.role,
        profile_id=profile.id,
    )
    session.add(auth_user)
    session.commit()

    return _create_token_response(payload.email)


@router.post("/login", response_model=schemas.Token)
def login(session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()) -> schemas.Token:
    user = session.exec(select(models.AuthUser).where(models.AuthUser.email == form_data.username)).one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    return _create_token_response(user.email)


@router.get("/me", response_model=schemas.UserProfileRead)
def read_me(session: SessionDep, current_user: models.AuthUser = Depends(get_current_auth_user)):
    profile = session.get(models.UserProfile, current_user.profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    bookmarks = session.exec(select(models.Bookmark).where(models.Bookmark.user_id == profile.id)).all()
    reviews = session.exec(select(models.UserReview).where(models.UserReview.user_id == profile.id)).all()

    return schemas.UserProfileRead(
        id=profile.id,
        name=profile.name,
        email=profile.email,
        role=profile.role,
        bookmarks=[
            schemas.BookmarkRead(
                id=b.id,
                item_type=b.item_type,
                name=b.name,
                href=b.href,
            )
            for b in bookmarks
        ],
        reviews=[
            schemas.ReviewRead(
                id=r.id,
                author_name=profile.name,
                rating=r.rating,
                content=r.content or "",
                created_at=r.created_at,
            )
            for r in reviews
        ],
    )
