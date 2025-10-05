from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Query
from sqlmodel import select

from .. import models, schemas
from .deps import SessionDep
from .offers import _offer_to_schema

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/", response_model=List[schemas.ReportRead])
def list_reports(
    session: SessionDep,
    status: Optional[models.ReportStatus] = Query(default=None),
) -> List[schemas.ReportRead]:
    statement = select(models.Report)
    if status is not None:
        statement = statement.where(models.Report.status == status)
    reports = session.exec(statement).all()
    results: List[schemas.ReportRead] = []
    for report in reports:
        offer = session.get(models.Offer, report.offer_id)
        if not offer:
            continue
        results.append(
            schemas.ReportRead(
                id=report.id,
                offer=_offer_to_schema(session, offer),
                reporter_name=report.reporter_name,
                reason=report.reason,
                status=report.status,
                created_at=report.created_at,
            )
        )
    return results
