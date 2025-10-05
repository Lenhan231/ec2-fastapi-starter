from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from .. import models, schemas
from .deps import SessionDep

router = APIRouter(prefix="/gyms", tags=["gyms"])


def _gym_to_schema(session, gym: models.Gym) -> schemas.GymRead:
    location = session.get(models.Location, gym.location_id) if gym.location_id else None
    location_schema = schemas.LocationRead.model_validate(location, from_attributes=True) if location else None
    return schemas.GymRead(
        id=gym.id,
        name=gym.name,
        summary=gym.summary,
        thumbnail=gym.thumbnail,
        rating_avg=gym.rating_avg,
        rating_count=gym.rating_count,
        price_min=gym.price_min,
        price_max=gym.price_max,
        distance_km=gym.distance_km,
        location=location_schema,
    )


def _pt_to_schema(pt: models.PTProfile) -> schemas.PTProfileRead:
    specialties = [item.strip() for item in (pt.specialties or "").split(",") if item.strip()]
    return schemas.PTProfileRead(
        id=pt.id,
        name=pt.name,
        avatar=pt.avatar,
        experience_years=pt.experience_years,
        price_per_session=pt.price_per_session,
        specialties=specialties,
        promoted=pt.promoted,
    )


@router.get("/", response_model=List[schemas.GymRead])
def list_gyms(
    session: SessionDep,
    q: Optional[str] = None,
    rating_min: float = Query(ge=0, le=5, default=0),
    distance_max: Optional[float] = Query(default=None, ge=0),
    price_min: Optional[int] = Query(default=None, ge=0),
    price_max: Optional[int] = Query(default=None, ge=0),
) -> List[schemas.GymRead]:
    gyms = session.exec(select(models.Gym)).all()

    def matches(gym: models.Gym) -> bool:
        if gym.rating_avg is not None and gym.rating_avg < rating_min:
            return False
        if distance_max is not None and gym.distance_km is not None and gym.distance_km > distance_max:
            return False
        if price_min is not None and gym.price_max is not None and gym.price_max < price_min:
            return False
        if price_max is not None and gym.price_min is not None and gym.price_min > price_max:
            return False
        if q:
            location = session.get(models.Location, gym.location_id) if gym.location_id else None
            haystack = " ".join(
                filter(
                    None,
                    [gym.name, gym.summary, location.district if location else None, location.city if location else None],
                )
            ).lower()
            if q.lower() not in haystack:
                return False
        return True

    filtered = [gym for gym in gyms if matches(gym)]
    return [_gym_to_schema(session, gym) for gym in filtered]


@router.get("/{gym_id}", response_model=schemas.GymRead)
def get_gym(gym_id: int, session: SessionDep) -> schemas.GymRead:
    gym = session.get(models.Gym, gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    return _gym_to_schema(session, gym)


@router.get("/{gym_id}/reviews", response_model=List[schemas.ReviewRead])
def get_gym_reviews(gym_id: int, session: SessionDep) -> List[schemas.ReviewRead]:
    reviews = session.exec(select(models.Review).where(models.Review.gym_id == gym_id)).all()
    return [
        schemas.ReviewRead(
            id=review.id,
            author_name=review.author_name,
            rating=review.rating,
            content=review.content,
            created_at=review.created_at,
        )
        for review in reviews
    ]


@router.get("/{gym_id}/pts", response_model=List[schemas.PTProfileRead])
def get_gym_pts(gym_id: int, session: SessionDep) -> List[schemas.PTProfileRead]:
    statement = select(models.PTProfile).join(models.GymPTLink).where(models.GymPTLink.gym_id == gym_id)
    pts = session.exec(statement).all()
    return [_pt_to_schema(pt) for pt in pts]
