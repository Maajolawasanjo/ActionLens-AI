"""
ActionLens AI — FastAPI Microservice
Handles GPT-4o recommendation generation and image-based vision verification.
"""

import os
import base64
import httpx
from typing import Optional
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import AsyncOpenAI

# ── Load environment ──────────────────────────────────────────────────────────
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
SUPABASE_URL   = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY   = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

client = AsyncOpenAI(api_key=OPENAI_API_KEY)

# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="ActionLens AI Microservice",
    description="GPT-4o recommendation engine and vision verification for disaster early warning.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic Schemas ──────────────────────────────────────────────────────────
class RecommendationRequest(BaseModel):
    role: str = Field(..., description="Stakeholder role: government, ngo, responder, farmer, health_worker, citizen")
    region: str = Field(..., description="Geographic region, e.g. Tana River")
    country: str = Field(default="Kenya")
    risk_type: str = Field(..., description="Hazard type: flood, drought, disease, agriculture, storm, food")
    risk_level: str = Field(default="high", description="Severity: critical, high, moderate, low")
    risk_payload: Optional[dict] = Field(default=None, description="Extra telemetry context e.g. discharge_rate")
    max_recommendations: int = Field(default=3, ge=1, le=10)


class RecommendationItem(BaseModel):
    action: str
    priority: str = "high"
    time_horizon: str = "24h"
    confidence_score: float = 0.90
    reasoning: str = ""
    expected_impact: str = ""
    evidence: list[dict] = []

    @classmethod
    def from_gpt(cls, data: dict) -> "RecommendationItem":
        """Handle GPT-4o field name variants gracefully."""
        return cls(
            action=data.get("action") or data.get("title") or data.get("directive", "Review hazard conditions"),
            priority=data.get("priority", "high"),
            time_horizon=data.get("time_horizon") or data.get("timeframe", "24h"),
            confidence_score=float(data.get("confidence_score", 0.90)),
            reasoning=data.get("reasoning") or data.get("description") or data.get("rationale", ""),
            expected_impact=data.get("expected_impact") or data.get("impact", ""),
            evidence=data.get("evidence") or data.get("sources", []),
        )


class RecommendationResponse(BaseModel):
    role: str
    region: str
    risk_type: str
    recommendations: list[RecommendationItem]
    model: str


class VisionVerifyRequest(BaseModel):
    image_url: Optional[str] = Field(default=None, description="Public URL of the uploaded image")
    image_base64: Optional[str] = Field(default=None, description="Base64-encoded image data")
    category: str = Field(..., description="Report category: flood, drought, infrastructure, health, food, other")
    description: str = Field(..., description="Reporter's description of the hazard")


class VisionVerifyResponse(BaseModel):
    verified: bool
    confidence: float
    ai_summary: str
    objects_detected: list[str]
    severity_assessment: str
    recommended_action: str


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "operational",
        "service": "ActionLens AI Microservice",
        "version": "1.0.0",
        "model": "gpt-4o",
    }


# ── B3-03: Generate Recommendations ──────────────────────────────────────────
@app.post("/generate-recommendations", response_model=RecommendationResponse)
async def generate_recommendations(req: RecommendationRequest):
    """
    Generate role-specific, region-contextualised early warning action recommendations
    using GPT-4o based on live telemetry risk signals.
    """
    telemetry_context = ""
    if req.risk_payload:
        telemetry_context = "\n".join(
            f"  - {k.replace('_', ' ').title()}: {v}"
            for k, v in req.risk_payload.items()
        )

    system_prompt = """You are ActionLens AI — an IGAD-certified early warning decision intelligence system.
You generate concise, role-specific emergency action directives grounded in environmental telemetry data.
Your recommendations must be:
- Immediately actionable and specific to the stakeholder role
- Grounded in the provided risk signals
- Time-bound with clear priority classification
- Output ONLY valid JSON. No prose, no markdown, no code blocks."""

    user_prompt = f"""Generate {req.max_recommendations} emergency recommendations for:

STAKEHOLDER ROLE: {req.role.upper()}
REGION: {req.region}, {req.country}
HAZARD TYPE: {req.risk_type.upper()}
SEVERITY LEVEL: {req.risk_level.upper()}
{f"LIVE TELEMETRY SIGNALS:\n{telemetry_context}" if telemetry_context else ""}

Return a JSON object with a key "recommendations" containing an array:
{{
  "recommendations": [
    {{
      "action": "Specific directive for this role",
      "priority": "critical|high|medium|low",
      "time_horizon": "now|6h|24h|72h",
      "confidence_score": 0.97,
      "reasoning": "Why this action is needed based on telemetry",
      "expected_impact": "Measurable outcome if action is taken",
      "evidence": [
        {{"label": "Sensor name", "value": "Reading", "source_type": "telemetry|ai_model|satellite"}}
      ]
    }}
  ]
}}"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=1500,
            response_format={"type": "json_object"},
        )

        import json
        raw = response.choices[0].message.content or "{}"
        parsed_json = json.loads(raw)

        # GPT-4o with json_object mode always returns a dict.
        # Find the first value that is a list (could be "recommendations", "directives", etc.)
        if isinstance(parsed_json, list):
            items = parsed_json
        elif isinstance(parsed_json, dict):
            items = next((v for v in parsed_json.values() if isinstance(v, list)), [])
        else:
            items = []

        recommendations = [RecommendationItem.from_gpt(item) for item in items[:req.max_recommendations]]

        return RecommendationResponse(
            role=req.role,
            region=req.region,
            risk_type=req.risk_type,
            recommendations=recommendations,
            model="gpt-4o",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


# ── B3-04: Vision Verification ────────────────────────────────────────────────
@app.post("/verify-report-vision", response_model=VisionVerifyResponse)
async def verify_report_vision(req: VisionVerifyRequest):
    """
    Analyse a community-submitted hazard image using GPT-4o Vision.
    Returns AI confidence score, detected objects, severity assessment, and verification status.
    """
    if not req.image_url and not req.image_base64:
        raise HTTPException(status_code=400, detail="Either image_url or image_base64 is required.")

    # Build image content block
    if req.image_url:
        image_content = {"type": "image_url", "image_url": {"url": req.image_url, "detail": "high"}}
    else:
        image_content = {
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{req.image_base64}", "detail": "high"}
        }

    system_prompt = """You are ActionLens Vision AI — a disaster image verification specialist.
Analyse submitted community hazard images to verify authenticity and assess severity.
Output ONLY valid JSON. No prose, no markdown, no code blocks."""

    user_prompt = f"""Analyse this community-submitted disaster image.

REPORTED CATEGORY: {req.category.upper()}
REPORTER DESCRIPTION: "{req.description}"

Output format (strict JSON):
{{
  "verified": true,
  "confidence": 0.95,
  "ai_summary": "Clear description of what the image shows",
  "objects_detected": ["Object 1", "Object 2", "Object 3"],
  "severity_assessment": "critical|high|moderate|low",
  "recommended_action": "Specific recommended emergency response"
}}"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_prompt},
                        image_content,
                    ],
                },
            ],
            temperature=0.2,
            max_tokens=800,
            response_format={"type": "json_object"},
        )

        import json
        raw = response.choices[0].message.content or "{}"
        result = json.loads(raw)

        return VisionVerifyResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vision verification failed: {str(e)}")
