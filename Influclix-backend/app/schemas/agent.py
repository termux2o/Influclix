# app/schemas/agent.py
from datetime import datetime
from pydantic import BaseModel, Field


class OutreachRequest(BaseModel):
    """Body for POST /agents/outreach."""
    influencer_id: str = Field(..., description="Mongo _id of the influencer")
    campaign_brief: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="One paragraph describing the campaign",
    )
    brand_name: str | None = Field(default=None, max_length=120)
    tone: str = Field(default="friendly", pattern="^(friendly|professional|casual|enthusiastic)$")


class OutreachResponse(BaseModel):
    details: str = "Outreach email generated"
    status_code: int = 200
    subject: str
    body: str
    influencer_id: str
    model: str
    cost_usd: float
    latency_ms: int


class OutreachBatchRequest(BaseModel):
    """Body for POST /agents/outreach/batch."""
    influencer_ids: list[str] = Field(..., min_length=1, max_length=25)
    campaign_brief: str = Field(..., min_length=10, max_length=2000)
    brand_name: str | None = None
    tone: str = "friendly"


class OutreachDraft(BaseModel):
    influencer_id: str
    username: str | None = None
    subject: str
    body: str


class OutreachBatchResponse(BaseModel):
    details: str = "Batch generated"
    status_code: int = 200
    count: int
    total_cost_usd: float
    drafts: list[OutreachDraft]


class AgentRunOut(BaseModel):
    id: str
    agent: str
    model: str
    cost_usd: float
    latency_ms: int
    status: str
    at: datetime