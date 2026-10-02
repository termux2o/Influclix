from fastapi import Depends, HTTPException, Request, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database import get_db
from app.core.security import decode_token
from app.services import auth_service


def _err(msg: str, code: int = 401):
    return HTTPException(status_code=code, detail={"details": msg, "status_code": code})


async def get_current_user(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        raise _err("Not authenticated")

    try:
        payload = decode_token(token)
    except ValueError:
        raise _err("Invalid or expired token")

    if payload.get("type") != "access":
        raise _err("Wrong token type")

    email = payload.get("sub")
    if not email:
        raise _err("Malformed token")

    user = await auth_service.get_user_by_email(db, email)
    if not user:
        raise _err("User not found")
    return user