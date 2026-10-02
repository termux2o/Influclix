from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

from app.config import settings
from app.core.redis_client import get_redis


def _key_func(request: Request) -> str:
    """
    Key used for the global per-IP rate limit.
    Prefers CF-Connecting-IP (Cloudflare) then X-Forwarded-For,
    then falls back to the direct client IP.
    """
    # If you're behind Cloudflare / a load balancer, honor these headers
    for header in ("cf-connecting-ip", "x-real-ip", "x-forwarded-for"):
        value = request.headers.get(header)
        if value:
            # X-Forwarded-For can be a comma-separated chain; take the first
            return value.split(",")[0].strip()
    return get_remote_address(request)


def _email_key_func(request: Request) -> str:
    """
    Per-email key for login/signup endpoints.
    Slowapi calls this synchronously, but the request body isn't parsed yet,
    so we key off the email in the JSON body via a cached value placed by
    a small middleware. Fallback to IP.
    """
    email = getattr(request.state, "email_key", None)
    if email:
        return f"email:{email.lower()}"
    return f"ip:{_key_func(request)}"


limiter = Limiter(
    key_func=_key_func,
    storage_uri=settings.REDIS_URL,   # slowapi uses Redis for storage
    default_limits=[settings.RATE_LIMIT_DEFAULT],
    headers_enabled=True,             # sends X-RateLimit-* headers
    strategy="fixed-window",          # options: fixed-window, moving-window
)