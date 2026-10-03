# app/routes/influencers.py
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_db
from app.schemas.influencer import (
    DemoDataResponse, SearchFilters, SearchResponse,
    FilterOptionsResponse, InfluencerCard,
)
from app.services import influencer_service, user_service
from app.core.deps import get_current_user
from app.core import plans
from app.schemas.auth import ErrorResponse
router = APIRouter(prefix="/influencers", tags=["influencers"])


# ── 1. Demo ──────────────────────────────────────────
@router.get("/demo", response_model=DemoDataResponse, summary="Top influencers per category")
async def demo_data(db: AsyncIOMotorDatabase = Depends(get_db)):
    data = await influencer_service.get_demo_data(db)
    return DemoDataResponse(details="Demo data fetched", status_code=200, **data)


# ── 2. Filter options ────────────────────────────────
@router.get("/filter-options", response_model=FilterOptionsResponse, summary="Filter dropdown values")
async def filter_options(db: AsyncIOMotorDatabase = Depends(get_db)):
    data = await influencer_service.get_filter_options(db)
    return FilterOptionsResponse(details="Filter options fetched", status_code=200, **data)


# ── 3. Usage ─────────────────────────────────────────
@router.get("/usage", summary="Current user's search usage")
async def usage(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    u = await user_service.get_search_usage(db, str(current_user["_id"]))
    sub = current_user.get("subscription_type", plans.FREE)
    return {
        "details": "Usage fetched",
        "status_code": 200,
        "subscription_type": sub,
        "plan": plans.plan_info(sub),
        **u,
    }


# ── 4. Search ────────────────────────────────────────
@router.post(
    "/search",
    response_model=SearchResponse,
    responses={402: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
    summary="Search influencers",
)
async def search(
    filters: SearchFilters,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    sub_type = current_user.get("subscription_type", plans.FREE)
    is_paid = plans.is_paid(sub_type)

    # 1. Block paid-only filters
    if not is_paid:
        for field in plans.PAID_ONLY_FILTERS:
            if getattr(filters, field, False):
                raise HTTPException(
                    status_code=403,
                    detail={
                        "details": f"Filter '{field}' requires a paid plan.",
                        "status_code": 403,
                        "required_plan": "pro",
                    },
                )

    # 2. Free-tier quota check
    u = await user_service.get_search_usage(db, str(current_user["_id"]))
    if u["limit"] is not None and u["used"] >= u["limit"]:
        raise HTTPException(
            status_code=402,
            detail={
                "details": "Free search limit reached. Upgrade to continue.",
                "status_code": 402,
                "used": u["used"],
                "limit": u["limit"],
                "required_plan": "pro",
            },
        )

    # 3. Run search
    data = await influencer_service.search_influencers(
        db, filters.model_dump(), user_plan=sub_type
    )

    # 4. Log + increment
    await user_service.log_activity(
        db, str(current_user["_id"]),
        action="search",
        filters=filters.model_dump(exclude_none=True),
        result_count=data["total"],
    )
    await user_service.increment_search_count(db, str(current_user["_id"]))

    return SearchResponse(details="Search completed", status_code=200, **data)


# ── 5. Single influencer — MUST BE LAST ──────────────
@router.get("/{influencer_id}", response_model=InfluencerCard, summary="Get one influencer")
async def get_one(
    influencer_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    from bson import ObjectId
    from bson.errors import InvalidId

    try:
        oid = ObjectId(influencer_id)
    except (InvalidId, TypeError):
        raise HTTPException(404, detail={"details": "Not found", "status_code": 404})

    doc = await db["influencers"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(404, detail={"details": "Not found", "status_code": 404})

    card = influencer_service._serialize_card(doc)
    if current_user.get("subscription_type", 0) == plans.FREE:
        for field in plans.FREE_TIER_HIDDEN_FIELDS:
            card[field] = None
    return card