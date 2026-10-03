# app/services/influencer_service.py
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core import plans
COLLECTION = "influencers"
TOP_PER_CATEGORY = 3

MAX_CATEGORIES=10

async def get_demo_data(db: AsyncIOMotorDatabase) -> dict:
    """
    Returns the top N influencers (by followers, desc) for each category.
    Aggregation pipeline:
      1. Sort every doc by followers desc
      2. Group by category, take first N
      3. Sort groups by total count desc
    """
    pipeline = [
        # Ignore docs without a category
        {"$match": {"category": {"$ne": None, "$exists": True}}},

        # Highest followers first, so $slice picks the top N
        {"$sort": {"followers": -1,"category": -1}},
        {"$limit": MAX_CATEGORIES},

        # Group by category, keeping the top N docs
        {
            "$group": {
                "_id": "$category",
                "total": {"$sum": 1},
                "influencers": {"$push": "$$ROOT"},
            }
        },

        # Keep only the first N per group
        {
            "$project": {
                "category": "$_id",
                "_id": 0,
                "count": "$total",
                "influencers": {"$slice": ["$influencers", TOP_PER_CATEGORY]},
            }
        },

        # Order categories alphabetically (or by count desc — pick one)
        {"$sort": {"category": 1}},
    ]

    raw_groups = await db[COLLECTION].aggregate(pipeline).to_list(length=None)

    # Serialize each doc into InfluencerCard shape
    groups = []
    total_influencers = 0
    for g in raw_groups:
        cards = [_serialize_card(doc) for doc in g["influencers"]]
        groups.append({
            "category": g["category"],
            "count": g["count"],
            "influencers": cards,
        })
        total_influencers += len(cards)

    return {
        "total_categories": len(groups),
        "total_influencers": total_influencers,
        "groups": groups,
    }


def _serialize_card(doc: dict) -> dict:
    """Map a raw MongoDB doc → the flat card shape the frontend expects."""
    return {
        "id": str(doc["_id"]),
        "username": doc.get("username", ""),
        "display_name": doc.get("display_name") or doc.get("username"),
        "bio": doc.get("bio"),
        "profile_image_url": doc.get("profile_image_url"),
        "verified": doc.get("verified", False),

        "category": doc.get("category"),
        "tags": doc.get("tags", []),

        "email": doc.get("email"),

        "instagram": doc.get("instagram"),
        "youtube": doc.get("youtube"),
        "twitter": doc.get("twitter"),
        "tiktok": doc.get("tiktok"),
        "linkedin": doc.get("linkedin"),
        "website": doc.get("website"),

        "followers": int(doc.get("followers") or 0),
        "following": int(doc.get("following") or 0),
    }
    
    
async def search_influencers(
    db: AsyncIOMotorDatabase,
    filters: dict,
    *,
    user_plan: int = plans.FREE,
) -> dict:
    query: dict[str, Any] = {}

    # ── Text search ──
    q = (filters.get("q") or "").strip()
    if q:
        query["$text"] = {"$search": q}

    # ── Category ──
    if filters.get("category"):
        query["category"] = filters["category"]

    # ── Platform ──
    platform = filters.get("platform")
    if platform and platform != "all":
        query[platform] = {"$ne": None, "$exists": True}

    # ── Location ──
    loc = (filters.get("location") or "").strip()
    if loc and loc.lower() != "all":
        import re as _re
        rx = {"$regex": _re.escape(loc), "$options": "i"}
        query.setdefault("$or", []).extend([
            {"location.country": rx},
            {"location.state": rx},
            {"location.city": rx},
        ])

    # ── Followers range ──
    min_f = filters.get("min_followers")
    max_f = filters.get("max_followers")
    if min_f is not None or max_f is not None:
        rng: dict[str, int] = {}
        if min_f is not None:
            rng["$gte"] = min_f
        if max_f is not None:
            rng["$lte"] = max_f
        query["followers"] = rng

    # ── Paid-only filters ──
    if filters.get("has_email"):
        query["email"] = {"$ne": None, "$exists": True}
    if filters.get("has_phone"):
        query["phone"] = {"$ne": None, "$exists": True}
    if filters.get("has_website"):
        query["website"] = {"$ne": None, "$exists": True}
    if filters.get("has_social"):
        query.setdefault("$or", []).extend([
            {"youtube":  {"$ne": None, "$exists": True}},
            {"twitter":  {"$ne": None, "$exists": True}},
            {"tiktok":   {"$ne": None, "$exists": True}},
            {"linkedin": {"$ne": None, "$exists": True}},
        ])

    # ── Pagination ──
    page = max(1, int(filters.get("page", 1)))
    page_size = min(100, max(1, int(filters.get("page_size", 20))))
    skip = (page - 1) * page_size

    # ── Sorting ──
    sort_by = filters.get("sort_by", "followers")
    if sort_by not in {"followers", "username", "created_at"}:
        sort_by = "followers"
    sort_dir = -1 if int(filters.get("sort_dir", -1)) < 0 else 1

    cursor = (
        db[COLLECTION]
        .find(query)
        .sort(sort_by, sort_dir)
        .skip(skip)
        .limit(page_size)
    )

    docs = await cursor.to_list(length=page_size)
    total = await db[COLLECTION].count_documents(query)

    serialized = [_serialize_card(d) for d in docs]

    # ── Hide contact fields for free tier ──
    if user_plan == plans.FREE:
        for row in serialized:
            for field in plans.FREE_TIER_HIDDEN_FIELDS:
                row[field] = None

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if total else 0,
        "influencers": serialized,
    }


async def get_filter_options(db: AsyncIOMotorDatabase) -> dict:
    """Distinct categories / countries / states / cities / platforms from DB."""
    # Categories
    categories = await db[COLLECTION].distinct(
        "category", {"category": {"$ne": None, "$exists": True}}
    )
    categories = sorted([c for c in categories if c])

    # Location sub-fields
    countries = await db[COLLECTION].distinct(
        "location.country", {"location.country": {"$ne": None, "$exists": True}}
    )
    states = await db[COLLECTION].distinct(
        "location.state", {"location.state": {"$ne": None, "$exists": True}}
    )
    cities = await db[COLLECTION].distinct(
        "location.city", {"location.city": {"$ne": None, "$exists": True}}
    )

    countries = sorted([c for c in countries if c])
    states = sorted([s for s in states if s])
    cities = sorted([c for c in cities if c])

    # Which platforms have at least one influencer
    platforms = []
    for p in ("instagram", "youtube", "tiktok", "twitter", "linkedin"):
        exists = await db[COLLECTION].find_one({p: {"$ne": None, "$exists": True}}, {"_id": 1})
        if exists:
            platforms.append(p)

    return {
        "categories": categories,
        "countries": countries,
        "states": states,
        "cities": cities,
        "platforms": platforms,
    }