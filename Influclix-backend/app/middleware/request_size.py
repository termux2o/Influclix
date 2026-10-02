from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from fastapi import Request
from app.config import settings


class MaxBodySizeMiddleware(BaseHTTPMiddleware):
    """
    Reject requests whose body exceeds MAX_REQUEST_BODY_BYTES before
    reading them fully — prevents trivial memory-exhaustion attacks.
    """

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > settings.MAX_REQUEST_BODY_BYTES:
            return JSONResponse(
                status_code=413,
                content={
                    "details": "Payload too large",
                    "status_code": 413,
                },
            )
        return await call_next(request)