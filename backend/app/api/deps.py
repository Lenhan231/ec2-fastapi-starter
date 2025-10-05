from __future__ import annotations

from typing import Annotated, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlmodel import Session, select

from .. import models
from ..core.database import get_session
from ..core.security import decode_access_token

SessionDep = Annotated[Session, Depends(get_session)]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


def get_current_auth_user(session: SessionDep, token: str = Depends(oauth2_scheme)) -> models.AuthUser:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = decode_access_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise ValueError("Missing subject")
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from None

    user = session.exec(select(models.AuthUser).where(models.AuthUser.email == email)).one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_optional_auth_user(session: SessionDep, token: Optional[str] = Depends(oauth2_scheme)) -> Optional[models.AuthUser]:
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        email: str = payload.get("sub")
        if email is None:
            return None
    except JWTError:
        return None
    return session.exec(select(models.AuthUser).where(models.AuthUser.email == email)).one_or_none()
