from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


class OfferType(str, Enum):
    GYM = "GYM"
    PT = "PT"


class OfferStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    GYM_APPROVED = "gym_approved"
    ADMIN_REVIEW = "admin_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


class ReportStatus(str, Enum):
    OPEN = "open"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"


class Location(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    street: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class Gym(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    summary: Optional[str] = None
    thumbnail: Optional[str] = None
    rating_avg: Optional[float] = None
    rating_count: Optional[int] = None
    price_min: Optional[int] = None
    price_max: Optional[int] = None
    distance_km: Optional[float] = None
    location_id: Optional[int] = Field(default=None, foreign_key="location.id")


class PTProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str] = None
    avatar: Optional[str] = None
    experience_years: Optional[int] = None
    price_per_session: Optional[int] = None
    specialties: Optional[str] = None
    promoted: bool = False


class GymPTLink(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    gym_id: int = Field(foreign_key="gym.id")
    pt_id: int = Field(foreign_key="ptprofile.id")


class Offer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    offer_type: OfferType
    title: str
    description: Optional[str] = None
    summary: Optional[str] = None
    valid_from: datetime
    valid_to: datetime
    promoted: bool = False
    status: OfferStatus = OfferStatus.PENDING
    gym_id: Optional[int] = Field(default=None, foreign_key="gym.id")
    pt_id: Optional[int] = Field(default=None, foreign_key="ptprofile.id")


class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    gym_id: int = Field(foreign_key="gym.id")
    author_name: str
    rating: int
    content: str
    created_at: datetime


class UserProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    role: str


class AuthUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: str
    profile_id: Optional[int] = Field(default=None, foreign_key="userprofile.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Bookmark(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    item_type: str
    name: str
    href: str


class UserReview(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="userprofile.id")
    target_type: str
    target_id: int
    rating: int
    content: Optional[str] = None
    created_at: datetime


class ModerationItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    offer_id: int = Field(foreign_key="offer.id")
    submitted_by_id: int
    submitted_by_name: str
    submitted_by_role: str
    risk_score: float = 0.0
    flagged_labels: Optional[str] = None
    escalated: bool = False
    submitted_at: datetime


class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    offer_id: int = Field(foreign_key="offer.id")
    reporter_name: str
    reason: str
    status: ReportStatus = ReportStatus.OPEN
    created_at: datetime
