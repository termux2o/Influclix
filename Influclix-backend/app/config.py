from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # MongoDB
    MONGODB_URI: str
    MONGODB_DB_NAME: str = "influclix"

    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15

    # Cookies
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"

    # CORS
    FRONTEND_ORIGIN: str = "http://localhost:3000"

    # ─── NEW: Redis + rate limiting ─────────────────────
    REDIS_URL: str = "redis://localhost:6380/0"

    # Global (per-IP) limits
    RATE_LIMIT_GLOBAL: str = "300/minute"      # any IP, any endpoint
    RATE_LIMIT_LOGIN: str = "5/minute"         # strict on login
    RATE_LIMIT_SIGNUP: str = "3/minute"        # strict on signup
    RATE_LIMIT_DEFAULT: str = "60/minute"      # fallback for other routes

    # Max request body size (bytes) — 1 MB default
    MAX_REQUEST_BODY_BYTES: int = 1_048_576

    # Bot guard
    BLOCK_EMPTY_USER_AGENT: bool = True
    BLOCKED_USER_AGENTS: list[str] = [
        "curl/", "python-requests", "scrapy", "wget/", "go-http-client",
        "httpclient", "libwww-perl", "java/", "postmanruntime",
    ]


settings = Settings()