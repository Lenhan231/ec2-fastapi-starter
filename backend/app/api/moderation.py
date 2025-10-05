from __future__ import annotations

from typing import List

from fastapi import APIRouter
from sqlmodel import select

from .. import models, schemas
from .deps import SessionDep
from .offers import _offer_to_schema

router = APIRouter(prefix="/moderation", tags=["moderation"])


@router.get("/queue", response_model=List[schemas.ModerationItemRead])
def get_queue(session: SessionDep) -> List[schemas.ModerationItemRead]:
    items = session.exec(select(models.ModerationItem)).all()
    result: List[schemas.ModerationItemRead] = []
    for item in items:
        offer = session.get(models.Offer, item.offer_id)
        if not offer:
            continue
        flagged = [label.strip() for label in (item.flagged_labels or "").split(",") if label.strip()]
        result.append(
            schemas.ModerationItemRead(
                id=item.id,
                offer=_offer_to_schema(session, offer),
                submitted_by=schemas.ModerationSubmittedBy(
                    id=item.submitted_by_id,
                    name=item.submitted_by_name,
                    role=item.submitted_by_role,
                ),
                risk_score=item.risk_score,
                flagged_labels=flagged,
                escalated=item.escalated,
                submitted_at=item.submitted_at,
            )
        )
    return result
