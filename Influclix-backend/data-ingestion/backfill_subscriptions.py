# scripts/backfill_subscriptions.py
"""
One-time: add subscription fields to every existing user.
Safe to re-run — uses $set so existing values are preserved.
"""
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB_NAME", "influclix")]
users = db["users"]

result = users.update_many(
    {"subscription_type": {"$exists": False}},
    {
        "$set": {
            "subscription_type": 0,
            "subscription_started_at": None,
            "subscription_ends_at": None,
            "searches_used": 0,
            "last_search_at": None,
        }
    },
)
print(f"✅ Matched: {result.matched_count}, Updated: {result.modified_count}")

# Also back-fill any users who have subscription_type but are missing other fields
result2 = users.update_many(
    {"searches_used": {"$exists": False}},
    {"$set": {"searches_used": 0, "last_search_at": None}},
)
print(f"✅ Filled searches_used on: {result2.modified_count}")
