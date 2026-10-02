from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings


class BotGuardMiddleware(BaseHTTPMiddleware):
    """
    Reject obvious bot traffic before it reaches your routes.

    Cheap checks:
      - empty User-Agent (many scrapers)
      - known scraper/tool User-Agents (curl, python-requests, ...)
      - suspiciously fast repeated hits (handled by rate limiter)
    """

    async def dispatch(self, request: Request, call_next):
        # Skip checks in dev for local tools — set ENABLE_BOT_GUARD=False
        if not settings.BLOCK_EMPTY_USER_AGENT:
            return await call_next(request)

        ua = request.headers.get("user-agent", "").strip()

        # Empty UA
        if not ua:
            return JSONResponse(
                status_code=403,
                content={"details": "Forbidden: missing User-Agent", "status_code": 403},
            )

        # Known tool UAs
        ua_lower = ua.lower()
        for blocked in settings.BLOCKED_USER_AGENTS:
            if blocked.lower() in ua_lower:
                # Note: keep Postman working in dev by setting
                # BLOCKED_USER_AGENTS=[] in .env during testing
                return JSONResponse(
                    status_code=403,
                    content={"details": "Forbidden: client not allowed", "status_code": 403},
                )

        return await call_next(request)