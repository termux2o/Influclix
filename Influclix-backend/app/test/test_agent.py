import sys
from pathlib import Path

# Add the project root (two levels up from this file) to PYTHONPATH
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

# Now `app` is importable
import asyncio
import traceback
from app.agents import OutreachAgent


async def main():
    print("🔍 Loading agent...")
    try:
        agent = OutreachAgent()
        print(f"✅ Agent loaded with model: {agent.model}")
    except Exception as e:
        print(f"❌ Agent init failed: {e}")
        traceback.print_exc()
        return

    print("\n📤 Calling Gemini...")
    try:
        result = await agent.write(
            creator={
                "username": "scoopwhopooktested",
                "display_name": "Scoop Who Pook Tested",
                "bio": "We test cosmetic products",
                "category": "beauty",
                "tags": ["collab", "beauty"],
                "followers": 5000,
                "instagram": "https://instagram.com/scoopwhopooktested",
            },
            campaign_brief="Create an email for making cosmetic product sales",
            brand_name="Your Brand",
            tone="friendly",
        )
        print("\n✅ SUCCESS")
        print("SUBJECT:", result["subject"])
        print("BODY:", result["body"][:200], "...")
        print("META:", result["meta"])
    except Exception as e:
        print(f"\n❌ Agent call failed: {type(e).__name__}: {e}")
        print("\n--- FULL TRACEBACK ---")
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())