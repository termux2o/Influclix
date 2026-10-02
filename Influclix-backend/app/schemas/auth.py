from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ────────────────────────────────────────────────────────────
# REQUESTS
# ────────────────────────────────────────────────────────────
class SignupRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=120)
    company: str | None = Field(default=None, max_length=120)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "alice@example.com",
                "password": "mypassword123",
                "full_name": "Alice Sharma",
                "company": "Acme Influencers",
            }
        }
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "alice@example.com",
                "password": "mypassword123",
            }
        }
    )


# ────────────────────────────────────────────────────────────
# RESPONSES — all have `details` + `status_code`
# ────────────────────────────────────────────────────────────
class SignupResponse(BaseModel):
    details: str = "User created successfully"
    status_code: int = 201


class LoginResponse(BaseModel):
    details: str = "Logged in successfully"
    status_code: int = 200


class LogoutResponse(BaseModel):
    details: str = "Logged out successfully"
    status_code: int = 200


class MeResponse(BaseModel):
    details: str = "User fetched successfully"
    status_code: int = 200
    id: str
    email: EmailStr
    full_name: str | None = None
    company: str | None = None
    created_at: datetime
    updated_at: datetime


# ────────────────────────────────────────────────────────────
# ERROR
# ────────────────────────────────────────────────────────────
class ErrorResponse(BaseModel):
    details: str
    status_code: int

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "details": "Email already registered",
                "status_code": 400,
            }
        }
    )