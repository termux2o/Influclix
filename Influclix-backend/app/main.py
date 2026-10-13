from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.routes import auth, influencers, agents     # ← add agents

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.core.redis_client import connect_to_redis, close_redis
from app.core.rate_limit import limiter
from app.core.bot_guard import BotGuardMiddleware
from app.middleware.request_size import MaxBodySizeMiddleware
from app.middleware.email_extractor import EmailExtractorMiddleware
from app.routes import auth,influencers


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    await connect_to_redis()
    yield
    await close_mongo_connection()
    await close_redis()


app = FastAPI(title="Influclix API", lifespan=lifespan)

# ─── Middleware (order matters: outermost first) ─────────────
app.add_middleware(MaxBodySizeMiddleware)      # 1. cheapest check
app.add_middleware(BotGuardMiddleware)         # 2. UA filtering
app.add_middleware(EmailExtractorMiddleware)   # 3. parse body once
app.add_middleware(SlowAPIMiddleware)          # 4. rate limit
app.include_router(auth.router)
app.include_router(influencers.router)
app.include_router(agents.router)  

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Attach the limiter to app state (required by slowapi) ───
app.state.limiter = limiter


# ─── Exception handlers ──────────────────────────────────────
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "details": "Too many requests. Please try again later.",
            "status_code": 429,
        },
        headers={"Retry-After": "60"},
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if isinstance(exc.detail, dict):
        body = exc.detail
    else:
        body = {"details": str(exc.detail), "status_code": exc.status_code}
    return JSONResponse(status_code=exc.status_code, content=body)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    if errors:
        first = errors[0]
        field = ".".join(str(x) for x in first.get("loc", [])[1:]) or "body"
        msg = f"{field}: {first.get('msg', 'invalid input')}"
    else:
        msg = "Invalid request"
    return JSONResponse(status_code=422, content={"details": msg, "status_code": 422})


# ─── Routes ──────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(influencers.router)      # ← add this

@app.get("/health")
async def health():
    return {"ok": True}