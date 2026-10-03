# app/core/plans.py

FREE = 0
PRO = 1
AGENCY = 2
ENTERPRISE = 3
ADMIN = 99  

FREE_SEARCH_LIMIT = 5

# Filters only paid users can use
PAID_ONLY_FILTERS = {"has_email", "has_phone", "has_website", "has_social"}

# Response fields hidden from free users
FREE_TIER_HIDDEN_FIELDS = {"email", "phone", "whatsapp"}


PLAN_INFO = {
    FREE: {
        "code": "free",
        "name": "Free",
        "price_inr": 0,
        "search_limit": FREE_SEARCH_LIMIT,
        "features": [
            "5 total searches",
            "Filter by category, platform, followers, location",
            "Contact details hidden",
        ],
    },
    PRO: {
        "code": "pro",
        "name": "Pro",
        "price_inr": 999,
        "search_limit": None,
        "features": [
            "Unlimited searches",
            "All filters unlocked",
            "Email, phone, website visible",
            "CSV export",
        ],
    },
    AGENCY: {
        "code": "agency",
        "name": "Agency",
        "price_inr": 2999,
        "search_limit": None,
        "features": [
            "Everything in Pro",
            "5 team seats",
            "API access",
            "Priority support",
        ],
    },
    ENTERPRISE: {
        "code": "enterprise",
        "name": "Enterprise",
        "price_inr": None,
        "search_limit": None,
        "features": [
            "Everything in Agency",
            "SSO + audit logs",
            "Dedicated success manager",
        ],
    },
    ADMIN: {
        "code": "admin",
        "name": "Admin",
        "price_inr": None,
        "search_limit": None,                    # unlimited
        "features": [
            "Unlimited searches",
            "All filters unlocked",
            "All contact fields visible",
            "Bypasses quota and 402 checks",
        ],
    },
}


def is_paid(subscription_type: int) -> bool:
    """Any plan above FREE — includes ADMIN."""
    return subscription_type != FREE


def is_admin(subscription_type: int) -> bool:
    return subscription_type == ADMIN


def plan_info(subscription_type: int) -> dict:
    return PLAN_INFO.get(subscription_type, PLAN_INFO[FREE])


def all_plans() -> list[dict]:
    """Plans shown on the public pricing page — excludes ADMIN."""
    return [
        {"type": k, **v}
        for k, v in PLAN_INFO.items()
        if k != ADMIN
    ]