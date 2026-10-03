from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl, EmailStr, ConfigDict


class InfluencerBase(BaseModel):
    # Basic
    username: str = Field(..., max_length=100)
    display_name: str | None = Field(default=None, max_length=120)
    bio: str | None = Field(default=None, max_length=1000)
    profile_image_url: HttpUrl | None = None
    verified: bool = False
    languages: list[str] = []

    # Category & Location
    category: str | None = Field(default=None, max_length=60)
    tags: list[str] = []
    location: dict | None = None       # {"country": ..., "state": ..., "city": ...}

    # Contact
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=20)
    whatsapp: HttpUrl | None = None

    # Social
    instagram: HttpUrl | None = None
    youtube: HttpUrl | None = None
    twitter: HttpUrl | None = None
    tiktok: HttpUrl | None = None
    linkedin: HttpUrl | None = None
    website: HttpUrl | None = None

    # Followers
    followers: int = 0

    # Meta
    source: str | None = None


class InfluencerCreate(InfluencerBase):
    pass


class InfluencerUpdate(BaseModel):
    display_name: str | None = None
    bio: str | None = None
    category: str | None = None
    tags: list[str] | None = None
    location: dict | None = None
    email: EmailStr | None = None
    phone: str | None = None
    whatsapp: HttpUrl | None = None
    instagram: HttpUrl | None = None
    youtube: HttpUrl | None = None
    twitter: HttpUrl | None = None
    tiktok: HttpUrl | None = None
    linkedin: HttpUrl | None = None
    website: HttpUrl | None = None
    followers: int | None = None


class InfluencerOut(InfluencerBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(populate_by_name=True)


class InfluencerSearchQuery(BaseModel):
    q: str | None = None                   # free-text over username/bio/display_name
    category: str | None = None
    country: str | None = None
    city: str | None = None
    language: str | None = None
    min_followers: int | None = None
    max_followers: int | None = None
    has_email: bool = False
    page: int = 1
    page_size: int = 20
    sort_by: str = "followers"
    sort_dir: int = -1
    
    
# ── Single influencer card (what the demo grid needs) ──
class InfluencerCard(BaseModel):
    id: str
    username: str
    display_name: str | None = None
    bio: str | None = None
    profile_image_url: str | None = None
    verified: bool = False

    category: str | None = None
    tags: list[str] = []

    email: str | None = None

    instagram: str | None = None
    youtube: str | None = None
    twitter: str | None = None
    tiktok: str | None = None
    linkedin: str | None = None
    website: str | None = None

    followers: int = 0
    following: int = 0


# ── One category group ──
class CategoryGroup(BaseModel):
    category: str
    count: int
    influencers: list[InfluencerCard]


# ── Full demo payload ──
class DemoDataResponse(BaseModel):
    details: str = "Demo data fetched successfully"
    status_code: int = 200
    total_categories: int
    total_influencers: int
    groups: list[CategoryGroup]
    
    

class SearchFilters(BaseModel):
    """What the client sends as JSON body to /influencers/search."""
    q: str | None = None                # free-text over username/display_name/bio
    category: str | None = None
    platform: str | None = None         # instagram | youtube | tiktok | twitter | linkedin
    location: str | None = None         # matches country OR state OR city (substring)
    min_followers: int | None = None
    max_followers: int | None = None
    # ── Paid-only ──
    has_email: bool = False
    has_phone: bool = False
    has_website: bool = False
    has_social: bool = False
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    sort_by: str = "followers"          # followers | username | created_at
    sort_dir: int = -1                  # -1 desc, 1 asc


class SearchResponse(BaseModel):
    details: str = "Search completed"
    status_code: int = 200
    total: int
    page: int
    page_size: int
    total_pages: int
    influencers: list["InfluencerCard"]


class FilterOptionsResponse(BaseModel):
    """Distinct values the frontend can use to populate dropdowns."""
    details: str = "Filter options fetched"
    status_code: int = 200
    categories: list[str]
    countries: list[str]
    states: list[str]
    cities: list[str]
    platforms: list[str]
    
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

# forward ref resolution for SearchResponse.influencers
SearchResponse.model_rebuild()