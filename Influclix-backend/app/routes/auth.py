# app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_db
from app.schemas.auth import (
    SignupRequest, LoginRequest,
    SignupResponse, LoginResponse, LogoutResponse, MeResponse,
    ErrorResponse,
)
from app.services import auth_service
from app.core.security import create_access_token
from app.core.deps import get_current_user
from app.core.rate_limit import limiter, _email_key_func
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])
COOKIE_MAX_AGE = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=COOKIE_MAX_AGE,
        path="/",
    )


# ────────────────────────────────────────────────────────────
# SIGNUP
#   • per-IP   limit  → settings.RATE_LIMIT_SIGNUP
#   • per-email limit → settings.RATE_LIMIT_SIGNUP
# ────────────────────────────────────────────────────────────
@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
    },
    summary="Register a new user",
)
@limiter.limit(settings.RATE_LIMIT_SIGNUP)
@limiter.limit(settings.RATE_LIMIT_SIGNUP, key_func=_email_key_func)
async def signup(
    request: Request,                      # required by slowapi
    payload: SignupRequest,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    try:
        user = await auth_service.create_user(
            db,
            payload.email,
            payload.password,
            payload.full_name,
            payload.company,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    token = create_access_token(subject=user["email"])
    _set_auth_cookie(response, token)

    return SignupResponse(
        details="User created successfully",
        status_code=201,
    )


# ────────────────────────────────────────────────────────────
# LOGIN
#   • per-IP   limit  → settings.RATE_LIMIT_LOGIN
#   • per-email limit → settings.RATE_LIMIT_LOGIN
# ────────────────────────────────────────────────────────────
@router.post(
    "/login",
    response_model=LoginResponse,
    responses={
        401: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
    },
    summary="Login with email + password",
)
@limiter.limit(settings.RATE_LIMIT_LOGIN)
@limiter.limit(settings.RATE_LIMIT_LOGIN, key_func=_email_key_func)
async def login(
    request: Request,                      # required by slowapi
    payload: LoginRequest,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user = await auth_service.authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(subject=user["email"])
    _set_auth_cookie(response, token)

    return LoginResponse(
        details="Logged in successfully",
        status_code=200,
    )


# ────────────────────────────────────────────────────────────
# LOGOUT  (generous limit — harmless endpoint)
# ────────────────────────────────────────────────────────────
@router.post(
    "/logout",
    response_model=LogoutResponse,
    responses={429: {"model": ErrorResponse}},
    summary="Clear auth cookie",
)
@limiter.limit("30/minute")
async def logout(request: Request, response: Response):
    response.delete_cookie("access_token", path="/")
    return LogoutResponse(
        details="Logged out successfully",
        status_code=200,
    )


# ────────────────────────────────────────────────────────────
# ME  (called on every page load → generous limit)
# ────────────────────────────────────────────────────────────
@router.get(
    "/me",
    response_model=MeResponse,
    responses={
        401: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
    },
    summary="Get current user",
)
@limiter.limit("120/minute")
async def me(
    request: Request,                      # required by slowapi
    current_user: dict = Depends(get_current_user),
):
    user_data = auth_service.serialize_user(current_user)
    return MeResponse(
        details="User fetched successfully",
        status_code=200,
        **user_data,
    )