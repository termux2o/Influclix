# app/routes/agents.py
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_db
from app.core.deps import get_current_user
from app.core import plans
from app.agents import OutreachAgent
from app.services import agent_run_service
from app.schemas.agent import (
    OutreachRequest, OutreachResponse,
    OutreachBatchRequest, OutreachBatchResponse, OutreachDraft,
)

router = APIRouter(prefix="/agents", tags=["agents"])

_outreach = OutreachAgent()


# ─── Paid-only gate ─────────────────────────────────────
def _require_paid(user: dict):
    sub = user.get("subscription_type", plans.FREE)
    if not plans.is_paid(sub):
        raise HTTPException(
            status_code=403,
            detail={
                "details": "AI Outreach requires a paid plan.",
                "status_code": 403,
                "required_plan": "pro",
            },
        )


# ─── Single ─────────────────────────────────────────────
@router.post(
    "/outreach",
    response_model=OutreachResponse,
    responses={403: {}, 404: {}},
    summary="Generate one personalized outreach email",
)
async def generate_outreach(
    body: OutreachRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    _require_paid(user)

    # Fetch the influencer
    try:
        oid = ObjectId(body.influencer_id)
    except (InvalidId, TypeError):
        raise HTTPException(404, detail={"details": "Influencer not found", "status_code": 404})

    doc = await db["influencers"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(404, detail={"details": "Influencer not found", "status_code": 404})

    try:
        result = await _outreach.write(
            creator=doc,
            campaign_brief=body.campaign_brief,
            brand_name=body.brand_name,
            tone=body.tone,
        )
    except Exception as e:
        await agent_run_service.log_run(
            db,
            user_id=str(user["_id"]),
            agent=_outreach.name,
            model=_outreach.model,
            meta={},
            input_preview=body.campaign_brief,
            output_preview="",
            status="error",
            error=str(e),
            extra={"influencer_id": body.influencer_id},
        )
        raise HTTPException(500, detail={"details": "Agent failed", "status_code": 500})

    meta = result["meta"]
    await agent_run_service.log_run(
        db,
        user_id=str(user["_id"]),
        agent=_outreach.name,
        model=_outreach.model,
        meta=meta,
        input_preview=body.campaign_brief,
        output_preview=result["subject"] + " | " + result["body"][:200],
        extra={"influencer_id": body.influencer_id},
    )

    return OutreachResponse(
        details="Outreach email generated",
        status_code=200,
        subject=result["subject"],
        body=result["body"],
        influencer_id=body.influencer_id,
        model=meta["model"],
        cost_usd=meta["cost_usd"],
        latency_ms=meta["latency_ms"],
    )


# ─── Batch ──────────────────────────────────────────────
@router.post(
    "/outreach/batch",
    response_model=OutreachBatchResponse,
    summary="Generate outreach for up to 25 influencers",
)
async def generate_outreach_batch(
    body: OutreachBatchRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    _require_paid(user)

    oids = []
    for i in body.influencer_ids:
        try:
            oids.append(ObjectId(i))
        except (InvalidId, TypeError):
            continue

    docs = await db["influencers"].find({"_id": {"$in": oids}}).to_list(length=len(oids))

    drafts: list[OutreachDraft] = []
    total_cost = 0.0

    for doc in docs:
        try:
            result = await _outreach.write(
                creator=doc,
                campaign_brief=body.campaign_brief,
                brand_name=body.brand_name,
                tone=body.tone,
            )
            total_cost += result["meta"]["cost_usd"]
            drafts.append(OutreachDraft(
                influencer_id=str(doc["_id"]),
                username=doc.get("username"),
                subject=result["subject"],
                body=result["body"],
            ))
        except Exception as e:
            # Log but continue — don't kill the whole batch
            await agent_run_service.log_run(
                db,
                user_id=str(user["_id"]),
                agent=_outreach.name,
                model=_outreach.model,
                meta={},
                input_preview=body.campaign_brief,
                output_preview="",
                status="error",
                error=str(e),
                extra={"influencer_id": str(doc["_id"])},
            )

    return OutreachBatchResponse(
        details="Batch generated",
        status_code=200,
        count=len(drafts),
        total_cost_usd=round(total_cost, 6),
        drafts=drafts,
    )