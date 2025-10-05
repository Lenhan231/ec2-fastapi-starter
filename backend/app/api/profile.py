from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends
from sqlmodel import select

from .. import models, schemas
from .deps import SessionDep, get_optional_auth_user

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/me", response_model=schemas.UserProfileRead)
def get_profile_me(
    session: SessionDep,
    auth_user: Optional[models.AuthUser] = Depends(get_optional_auth_user),
) -> schemas.UserProfileRead:
    profile_id = auth_user.profile_id if auth_user and auth_user.profile_id else 1
    user = session.get(models.UserProfile, profile_id)
    if not user:
        raise RuntimeError("Seed user not found")

    bookmarks = session.exec(select(models.Bookmark).where(models.Bookmark.user_id == user.id)).all()
    bookmark_schemas = [
        schemas.BookmarkRead(
            id=b.id,
            item_type=b.item_type,
            name=b.name,
            href=b.href,
        )
        for b in bookmarks
    ]

    user_reviews = session.exec(select(models.UserReview).where(models.UserReview.user_id == user.id)).all()
    review_schemas = [
        schemas.ReviewRead(
            id=review.id,
            author_name=user.name,
            rating=review.rating,
            content=review.content or "",
            created_at=review.created_at,
        )
        for review in user_reviews
    ]

    return schemas.UserProfileRead(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        bookmarks=bookmark_schemas,
        reviews=review_schemas,
    )
