"""
Rate-limit smoke test for /auth/login.

Run:
    python test/test_rate_limit.py

Options (via env vars):
    BASE_URL        default: http://localhost:8000
    TEST_EMAIL      default: test@example.com
    TEST_PASSWORD   default: wrongpass
    ATTEMPTS        default: 6
"""

import os
import sys
import time
import json
import urllib.request
import urllib.error


BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
TEST_EMAIL = os.getenv("TEST_EMAIL", "aakash0001.itm@gmail.com")
TEST_PASSWORD = os.getenv("TEST_PASSWORD", "12afghjgfdsa")
ATTEMPTS = int(os.getenv("ATTEMPTS", "6"))
ENDPOINT = f"{BASE_URL}/auth/login"


def post_json(url: str, payload: dict, user_agent: str = "Mozilla/5.0") -> tuple[int, dict]:
    """Send a POST request with JSON body. Returns (status_code, response_body)."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "User-Agent": user_agent,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            parsed = json.loads(body) if body else {}
        except json.JSONDecodeError:
            parsed = {"raw": body}
        return e.code, parsed
    except urllib.error.URLError as e:
        print(f"❌ Network error: {e.reason}")
        print("   Is the backend running? Try: uvicorn app.main:app --reload")
        sys.exit(1)


def main():
    print("=" * 60)
    print("  Rate Limit Test — POST /auth/login")
    print("=" * 60)
    print(f"  URL       : {ENDPOINT}")
    print(f"  Email     : {TEST_EMAIL}")
    print(f"  Attempts  : {ATTEMPTS}")
    print("=" * 60)
    print()

    summary = []

    for i in range(1, ATTEMPTS + 1):
        print(f"--- Attempt {i} ---")
        start = time.time()
        status, body = post_json(ENDPOINT, {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
        })
        elapsed_ms = (time.time() - start) * 1000

        print(f"  Status : {status}  ({elapsed_ms:.0f} ms)")
        print(f"  Body   : {json.dumps(body)}")

        if status == 401:
            print("  ➜ Expected: invalid credentials")
        elif status == 429:
            print("  ➜ ✅ RATE LIMIT HIT — as expected!")
        else:
            print(f"  ➜ ⚠️ Unexpected status: {status}")

        summary.append(status)
        print()

    # ── Final report ─────────────────────────────────────
    print("=" * 60)
    print("  Summary")
    print("=" * 60)

    unauth = summary.count(401)
    limited = summary.count(429)
    others = [s for s in summary if s not in (401, 429)]

    print(f"  401 (invalid creds)  : {unauth}")
    print(f"  429 (rate limited)   : {limited}")
    print(f"  Other                : {others if others else 'none'}")

    if limited > 0:
        print("\n  ✅ Rate limiting is working.")
    else:
        print("\n  ❌ No 429 observed. Check:")
        print("     • Redis is running: docker ps | grep redis")
        print("     • SlowAPIMiddleware is registered in main.py")
        print("     • @limiter.limit(...) decorators are on the login route")
        print("     • Function signature includes `request: Request`")

    print()


if __name__ == "__main__":
    main()