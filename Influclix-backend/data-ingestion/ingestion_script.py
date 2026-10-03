# ingest_influencers.py
"""
Ingest scraped Instagram CSV data into MongoDB Atlas.

Usage:
    python ingest_influencers.py <csv_file>

Behavior:
    - Reads MongoDB URI from .env (MONGODB_URI, MONGODB_DB_NAME)
    - Skips rows where 'username' is empty or already exists
    - Inserts new rows with created_at + updated_at
    - Prints a summary of inserted / skipped / failed rows
"""

import os
import sys
import csv
import logging
from datetime import datetime, timezone
from typing import Optional

from pymongo import MongoClient, errors
from pymongo.collection import Collection
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ────────────────────────────────────────────────────────────
# CONFIG
# ────────────────────────────────────────────────────────────
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "influclix")
COLLECTION_NAME = "influencers"


# ────────────────────────────────────────────────────────────
# HELPERS
# ────────────────────────────────────────────────────────────
def to_int(val: Optional[str]) -> int:
    """Convert '44.3k', '245,000', '245000', '' → int."""
    if val is None:
        return 0
    s = str(val).strip().replace(",", "")
    if not s:
        return 0
    # Handle 'k' / 'm' suffixes just in case
    try:
        if s.lower().endswith("k"):
            return int(float(s[:-1]) * 1_000)
        if s.lower().endswith("m"):
            return int(float(s[:-1]) * 1_000_000)
        return int(float(s))
    except (ValueError, TypeError):
        return 0


def clean(val: Optional[str]) -> Optional[str]:
    """Trim; return None if empty."""
    if val is None:
        return None
    s = str(val).strip()
    return s if s else None


def split_tags(val: Optional[str]) -> list:
    """'ugc,skincare,makeup' → ['ugc', 'skincare', 'makeup']."""
    if not val:
        return []
    return [t.strip().lower() for t in str(val).split(",") if t.strip()]


def row_to_doc(row: dict) -> Optional[dict]:
    """
    Map a CSV row dict → MongoDB document.
    Returns None if username, followers, or following is missing.
    """
    username = clean(row.get("username"))
    followers_raw = clean(row.get("followers"))
    following_raw = clean(row.get("following"))

    # Skip if username/followers/following is missing
    if not username:
        return None

    if not followers_raw or not following_raw:
        return None

    followers = to_int(followers_raw)
    following = to_int(following_raw)

    now = datetime.now(timezone.utc)

    doc = {
        "username": username,
        "display_name": clean(row.get("display_name")),
        "bio": clean(row.get("bio")),
        "profile_image_url": None,
        "verified": False,
        "languages": [],

        "category": clean(row.get("category")),
        "tags": split_tags(row.get("tags")),
        "location": None,

        "email": clean(row.get("email")),
        "phone": clean(row.get("phone")),
        "whatsapp": clean(row.get("whatsapp")),

        "instagram": clean(row.get("instagram")),
        "youtube": clean(row.get("youtube")),
        "twitter": clean(row.get("twitter")),
        "tiktok": clean(row.get("tiktok")),
        "linkedin": clean(row.get("linkedin")),
        "website": clean(row.get("website")),
        "other_links": split_tags(row.get("other_links")),

        "followers": followers,
        "following": following,

        "source": "instagram_selenium",
        "created_at": now,
        "updated_at": now,
    }

    return doc

# ────────────────────────────────────────────────────────────
# MAIN
# ────────────────────────────────────────────────────────────
def ingest(csv_path: str) -> None:
    if not MONGODB_URI:
        logger.error("❌ MONGODB_URI not set in environment / .env")
        sys.exit(1)

    # ── Connect ─────────────────────────────────────────
    logger.info("🔌 Connecting to MongoDB Atlas...")
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=10_000)
        client.admin.command("ping")
        logger.info("✅ Connected")
    except errors.PyMongoError as e:
        logger.error(f"❌ Could not connect to MongoDB: {e}")
        sys.exit(1)

    db = client[MONGODB_DB_NAME]
    col: Collection = db[COLLECTION_NAME]

    # Ensure unique index on username (fast, idempotent)
    col.create_index("username", unique=True, background=True)
    logger.info(f"📁 Using {MONGODB_DB_NAME}.{COLLECTION_NAME}")

    # ── Read CSV ────────────────────────────────────────
    if not os.path.exists(csv_path):
        logger.error(f"❌ CSV not found: {csv_path}")
        sys.exit(1)

    # Use tab delimiter if the file is TSV (your sample was tab-separated)
    delimiter = "\t" if csv_path.lower().endswith(".tsv") else ","
    # Auto-detect: read first line and pick whichever yields more columns
    with open(csv_path, "r", encoding="utf-8") as f:
        first = f.readline()
        if first.count("\t") > first.count(","):
            delimiter = "\t"

    logger.info(f"📄 Reading {csv_path} (delimiter='{delimiter}')")

    inserted = 0
    skipped_dupe = 0
    skipped_invalid = 0
    failed = 0

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=delimiter)
        total = 0

        for row in reader:
            total += 1
            doc = row_to_doc(row)
            if not doc:
                skipped_invalid += 1
                logger.warning(f"⚠️  Row {total}: missing username — skipped")
                continue

            username = doc["username"]

            # Skip if username already exists
            if col.find_one({"username": username}, {"_id": 1}):
                skipped_dupe += 1
                logger.info(f"⏭️  {username}: already exists — skipped")
                continue

            # Insert new
            try:
                col.insert_one(doc)
                inserted += 1
                logger.info(f"✅ {username}: inserted")
            except errors.DuplicateKeyError:
                # Race condition: someone inserted between find_one and insert
                skipped_dupe += 1
                logger.info(f"⏭️  {username}: duplicate (race) — skipped")
            except errors.PyMongoError as e:
                failed += 1
                logger.error(f"❌ {username}: insert failed — {e}")

        # ── Summary ─────────────────────────────────────
        print("\n" + "=" * 60)
        print("📊 INGESTION SUMMARY")
        print("=" * 60)
        print(f"  Total rows        : {total}")
        print(f"  ✅ Inserted       : {inserted}")
        print(f"  ⏭️  Skipped (dup)  : {skipped_dupe}")
        print(f"  ⚠️  Skipped (bad)  : {skipped_invalid}")
        print(f"  ❌ Failed          : {failed}")
        print("=" * 60)

    client.close()


# ────────────────────────────────────────────────────────────
# CLI
# ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ingest_influencers.py <csv_file>")
        print("Example: python ingest_influencers.py instagram_scraped_20261003.csv")
        sys.exit(1)

    ingest(sys.argv[1])