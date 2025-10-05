from __future__ import annotations

from datetime import datetime, timedelta
from typing import List, Optional

from pydantic import BaseModel, EmailStr

from .models import OfferStatus, OfferType, ReportStatus


class LocationRead(BaseModel):
    id: int
    street: Optional[str]
    district: Optional[str]
    city: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        from_attributes = True


class GymRead(BaseModel):
    id: int
    name: str
    summary: Optional[str]
    thumbnail: Optional[str]
    rating_avg: Optional[float]
    rating_count: Optional[int]
    price_min: Optional[int]
    price_max: Optional[int]
    distance_km: Optional[float]
    location: Optional[LocationRead]

    class Config:
        from_attributes = True


class PTProfileRead(BaseModel):
    id: int
    name: Optional[str]
    avatar: Optional[str]
    experience_years: Optional[int]
    price_per_session: Optional[int]
    specialties: List[str]
    promoted: bool

    class Config:
        from_attributes = True


class OfferRead(BaseModel):
    id: int
    offer_type: OfferType
    title: str
    description: Optional[str]
    summary: Optional[str]
    valid_from: datetime
    valid_to: datetime
    promoted: bool
    status: OfferStatus
    gym: Optional[GymRead]
    pt: Optional[PTProfileRead]

    class Config:
        from_attributes = True


class ReviewRead(BaseModel):
    id: int
    author_name: str
    rating: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class BookmarkRead(BaseModel):
    id: int
    item_type: str
    name: str
    href: str

    class Config:
        from_attributes = True


class UserProfileRead(BaseModel):
    id: int
    name: str
    email: str
    role: str
    bookmarks: List[BookmarkRead]
    reviews: List[ReviewRead]

    class Config:
        from_attributes = True


class AuthRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class AuthLoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    sub: EmailStr
    exp: datetime


class ModerationSubmittedBy(BaseModel):
    id: int
    name: str
    role: str


class ModerationItemRead(BaseModel):
    id: int
    offer: OfferRead
    submitted_by: ModerationSubmittedBy
    risk_score: float
    flagged_labels: List[str]
    escalated: bool
    submitted_at: datetime


class ReportRead(BaseModel):
    id: int
    offer: OfferRead
    reporter_name: str
    reason: str
    status: ReportStatus
    created_at: datetime

    class Config:
        from_attributes = True
