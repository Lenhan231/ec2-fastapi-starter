from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from .. import models, schemas
from .deps import SessionDep

router = APIRouter(tags=["offers"])


def _location_schema(session, location_id: Optional[int]) -> Optional[schemas.LocationRead]:
    if location_id is None:
        return None
    location = session.get(models.Location, location_id)
    return schemas.LocationRead.model_validate(location, from_attributes=True) if location else None


def _gym_schema(session, gym_id: Optional[int]) -> Optional[schemas.GymRead]:
    if gym_id is None:
        return None
    gym = session.get(models.Gym, gym_id)
    if not gym:
        return None
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
        location=_location_schema(session, gym.location_id),
    )


def _pt_schema(session, pt_id: Optional[int]) -> Optional[schemas.PTProfileRead]:
    if pt_id is None:
        return None
    pt = session.get(models.PTProfile, pt_id)
    if not pt:
        return None
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


def _offer_to_schema(session, offer: models.Offer) -> schemas.OfferRead:
    return schemas.OfferRead(
        id=offer.id,
        offer_type=offer.offer_type,
        title=offer.title,
        description=offer.description,
        summary=offer.summary,
        valid_from=offer.valid_from,
        valid_to=offer.valid_to,
        promoted=offer.promoted,
        status=offer.status,
        gym=_gym_schema(session, offer.gym_id),
        pt=_pt_schema(session, offer.pt_id),
    )


@router.get("/gym-offers", response_model=List[schemas.OfferRead])
def list_gym_offers(
    session: SessionDep,
    gym_id: Optional[int] = Query(default=None),
    valid_to_from: Optional[datetime] = Query(default=None),
    valid_to_to: Optional[datetime] = Query(default=None),
) -> List[schemas.OfferRead]:
    offers = session.exec(select(models.Offer).where(models.Offer.offer_type == models.OfferType.GYM)).all()

    def matches(offer: models.Offer) -> bool:
        if gym_id and offer.gym_id != gym_id:
            return False
        if valid_to_from and offer.valid_to < valid_to_from:
            return False
        if valid_to_to and offer.valid_to > valid_to_to:
            return False
        return True

    return [_offer_to_schema(session, offer) for offer in offers if matches(offer)]


@router.get("/gym-offers/{offer_id}", response_model=schemas.OfferRead)
def get_gym_offer(offer_id: int, session: SessionDep) -> schemas.OfferRead:
    offer = session.exec(
        select(models.Offer).where(
            models.Offer.id == offer_id,
            models.Offer.offer_type == models.OfferType.GYM,
        )
    ).one_or_none()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return _offer_to_schema(session, offer)


@router.get("/pt-offers", response_model=List[schemas.OfferRead])
def list_pt_offers(
    session: SessionDep,
    gym_id: Optional[int] = Query(default=None),
    price_min: Optional[int] = Query(default=None, ge=0),
    price_max: Optional[int] = Query(default=None, ge=0),
) -> List[schemas.OfferRead]:
    offers = session.exec(select(models.Offer).where(models.Offer.offer_type == models.OfferType.PT)).all()

    def matches(offer: models.Offer) -> bool:
        if gym_id and offer.gym_id != gym_id:
            return False
        pt = session.get(models.PTProfile, offer.pt_id) if offer.pt_id else None
        if price_min is not None and pt and pt.price_per_session and pt.price_per_session < price_min:
            return False
        if price_max is not None and pt and pt.price_per_session and pt.price_per_session > price_max:
            return False
        return True

    return [_offer_to_schema(session, offer) for offer in offers if matches(offer)]


@router.get("/pt-offers/{offer_id}", response_model=schemas.OfferRead)
def get_pt_offer(offer_id: int, session: SessionDep) -> schemas.OfferRead:
    offer = session.exec(
        select(models.Offer).where(
            models.Offer.id == offer_id,
            models.Offer.offer_type == models.OfferType.PT,
        )
    ).one_or_none()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return _offer_to_schema(session, offer)
