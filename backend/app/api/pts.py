from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from .. import models, schemas
from .deps import SessionDep

router = APIRouter(prefix="/pts", tags=["pts"])


def _pt_to_schema(pt: models.PTProfile) -> schemas.PTProfileRead:
    specialties = [item.strip() for item in (pt.specialties or "").split(",") if item.strip()]
    data = pt.model_dump()
    data["specialties"] = specialties
    return schemas.PTProfileRead(**data)


@router.get("/", response_model=List[schemas.PTProfileRead])
def list_pts(session: SessionDep, gym_id: Optional[int] = Query(default=None)) -> List[schemas.PTProfileRead]:
    if gym_id is None:
        pts = session.exec(select(models.PTProfile)).all()
    else:
        statement = (
            select(models.PTProfile)
            .join(models.GymPTLink)
            .where(models.GymPTLink.gym_id == gym_id)
        )
        pts = session.exec(statement).all()
    return [_pt_to_schema(pt) for pt in pts]


@router.get("/{pt_id}", response_model=schemas.PTProfileRead)
def get_pt(pt_id: int, session: SessionDep) -> schemas.PTProfileRead:
    pt = session.get(models.PTProfile, pt_id)
    if not pt:
        raise HTTPException(status_code=404, detail="PT not found")
    return _pt_to_schema(pt)
