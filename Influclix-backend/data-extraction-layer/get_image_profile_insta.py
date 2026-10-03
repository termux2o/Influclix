import os
import time
from typing import Optional

from dotenv import load_dotenv
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ============================================================
# CONFIG
# ============================================================

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

DB_NAME = "influclix"
COLLECTION_NAME = "influencers"

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not set in .env")


# ============================================================
# MONGODB
# ============================================================

client = MongoClient(MONGODB_URI)

db = client[DB_NAME]
collection = db[COLLECTION_NAME]

print(f"Connected to MongoDB: {DB_NAME}.{COLLECTION_NAME}")


# ============================================================
# SELENIUM
# ============================================================

options = Options()

# Run Chrome without opening a visible window
options.add_argument("--headless=new")

options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")

options.add_argument("--window-size=1920,1080")

# Make Selenium look slightly more like a normal browser
options.add_argument(
    "--user-agent=Mozilla/5.0 (X11; Linux x86_64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/148.0.0.0 Safari/537.36"
)

driver = webdriver.Chrome(options=options)

wait = WebDriverWait(driver, 10)


# ============================================================
# PROFILE IMAGE
# ============================================================

def _get_profile_image_url() -> Optional[str]:
    """
    Grab the avatar URL from the Instagram profile page.

    Method 1:
        meta[property="og:image"]

    Method 2:
        header img

    Returns:
        Image/CDN URL or None
    """

    # --------------------------------------------------------
    # Method 1: og:image
    # --------------------------------------------------------

    try:
        el = driver.find_element(
            By.CSS_SELECTOR,
            'meta[property="og:image"]'
        )

        url = el.get_attribute("content")

        if url and url.startswith("http"):
            return url

    except Exception:
        pass

    # --------------------------------------------------------
    # Method 2: fallback header image
    # --------------------------------------------------------

    try:
        img = driver.find_element(
            By.CSS_SELECTOR,
            "header img"
        )

        url = img.get_attribute("src")

        if url and url.startswith("http"):
            return url

    except Exception:
        pass

    return None


# ============================================================
# SCRAPE PROFILE
# ============================================================

def scrape_profile(instagram_url):
    try:
        driver.get(instagram_url)

        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, 'meta[property="og:image"]')
            )
        )

        return _get_profile_image_url()

    except Exception as e:
        print(f"Error: {e}")
        return None


# ============================================================
# PROCESS MONGODB RECORDS
# ============================================================

query = {
    "instagram": {
        "$exists": True,
        "$nin": [None, ""]
    },

    # Only process records where image isn't already stored
    "$or": [
        {"profile_image_url": None},
        {"profile_image_url": ""},
        {"profile_image_url": {"$exists": False}}
    ],

    # Skip records with missing follower/following values
    "followers": {
        "$ne": None
    },

    "following": {
        "$ne": None
    }
}


records = collection.find(query)

processed = 0
updated = 0
failed = 0


try:

    for record in records:

        processed += 1

        mongo_id = record["_id"]

        username = record.get("username")

        instagram_url = record.get("instagram")

        followers = record.get("followers")
        following = record.get("following")

        print()
        print("=" * 70)

        print(
            f"Processing: {username} "
            f"| Followers: {followers} "
            f"| Following: {following}"
        )

        print(f"Mongo ID: {mongo_id}")

        print(f"Instagram: {instagram_url}")

        # ----------------------------------------------------
        # Scrape
        # ----------------------------------------------------

        profile_image_url = scrape_profile(instagram_url)

        if not profile_image_url:

            failed += 1

            print("  ❌ Failed to get profile image")

            continue

        # ----------------------------------------------------
        # Update MongoDB
        # ----------------------------------------------------

        result = collection.update_one(
            {"_id": mongo_id},
            {
                "$set": {
                    "profile_image_url": profile_image_url,
                    "updated_at": __import__("datetime").datetime.now(
                        __import__("datetime").timezone.utc
                    )
                }
            }
        )

        if result.modified_count:

            updated += 1

            print("  ✅ MongoDB updated")

        else:

            print("  ⚠️ MongoDB record was not modified")

finally:

    driver.quit()
    client.close()


# ============================================================
# SUMMARY
# ============================================================

print()
print("=" * 70)

print("SCRAPING COMPLETE")

print(f"Processed : {processed}")
print(f"Updated   : {updated}")
print(f"Failed    : {failed}")

print("=" * 70)