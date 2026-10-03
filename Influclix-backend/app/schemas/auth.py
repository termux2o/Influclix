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
    subscription_type:int =Field(default=0, description="User's subscription type, 0 for free, 1 for paid")
    subscription_started_at: datetime | None = Field(default=None, description="The date and time when the user's subscription started")
    subscription_ends_at: datetime | None = Field(default=None, description="The date and time when the user's subscription ends")
    searches_used:int =Field(default=0, description="The number of searches the user has used")
    last_search_at: datetime | None = Field(default=None, description="The date and time when the user last performed a search")    
    
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
    subscription_type: int = 0       
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