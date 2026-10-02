import json
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class EmailExtractorMiddleware(BaseHTTPMiddleware):
    """
    For JSON bodies containing an `email` field, stash it on request.state
    so the rate limiter can key on it. Reads the body once; Starlette
    caches it, so route handlers still receive it.
    """

    async def dispatch(self, request: Request, call_next):
        if request.method == "POST":
            ct = request.headers.get("content-type", "")
            if "application/json" in ct:
                try:
                    body = await request.body()
                    if body:
                        data = json.loads(body)
                        if isinstance(data, dict) and "email" in data:
                            request.state.email_key = str(data["email"])
                except Exception:
                    pass  # don't block — route will handle bad JSON

        return await call_next(request)