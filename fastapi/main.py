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

    system_prompt = """You are ActionLens AI — an ICPAC-aligned Early Warning & Anticipatory Action platform.
You generate concise, role-specific anticipatory action directives grounded in climate and environmental telemetry data.
Your recommendations must be:
- Immediately actionable and specific to the stakeholder role (Communities, Emergency Responders, Humanitarian Organizations, Government Agencies, or Disaster Operations Centers)
- Grounded in the provided risk signals and ICPAC preparedness guidelines
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

    system_prompt = """You are ActionLens Vision AI — an early warning ground report verification specialist.
Analyse submitted hazard images to verify authenticity of Ground Reports and assess severity.
Output ONLY valid JSON. No prose, no markdown, no code blocks."""

    user_prompt = f"""Analyse this community-submitted Ground Report image.

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


# ── RAG Pydantic Schemas ──────────────────────────────────────────────────────
class RagQueryRequest(BaseModel):
    query: str = Field(..., description="User's natural language question about emergency protocols or resources")
    role: Optional[str] = Field(default="government")
    region: Optional[str] = Field(default="East Africa")


class RagCitation(BaseModel):
    title: str
    category: str
    summary: str


class RagQueryResponse(BaseModel):
    query: str
    answer: str
    citations: list[RagCitation]
    model: str


# ── B3-05: RAG Early Warning Assistant Query ──────────────────────────────────
@app.post("/rag-query", response_model=RagQueryResponse)
async def rag_query(req: RagQueryRequest):
    """
    RAG Assistant endpoint: Converts question into embeddings via OpenAI text-embedding-3-small,
    fetches matching emergency resource documents from Supabase vector search,
    and synthesises an authoritative answer with GPT-4o.
    """
    try:
        # Step 1: Compute embedding for user query
        embed_res = await client.embeddings.create(
            model="text-embedding-3-small",
            input=req.query
        )
        query_vector = embed_res.data[0].embedding

        # Step 2: Query Supabase match_emergency_resources RPC via httpx REST call
        matched_docs = []
        try:
            async with httpx.AsyncClient() as http_client:
                rpc_res = await http_client.post(
                    f"{SUPABASE_URL}/rest/v1/rpc/match_emergency_resources",
                    headers={
                        "apikey": SUPABASE_KEY,
                        "Authorization": f"Bearer {SUPABASE_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "query_embedding": query_vector,
                        "match_threshold": 0.1,
                        "match_count": 4,
                    },
                    timeout=10.0,
                )
                if rpc_res.status_code == 200:
                    matched_docs = rpc_res.json()
        except Exception as rpc_err:
            print(f"[RAG RPC Warning] Vector RPC failed or table not populated: {rpc_err}")

        # Build ground context from retrieved docs
        context_str = ""
        citations = []
        if matched_docs:
            for doc in matched_docs:
                citations.append(RagCitation(
                    title=doc.get("title", "Resource Document"),
                    category=doc.get("category", "policy"),
                    summary=doc.get("summary", "")
                ))
                context_str += f"\n--- DOCUMENT: {doc.get('title')} ({doc.get('category')}) ---\n{doc.get('content') or doc.get('summary')}\n"
        else:
            # Contextual fallback knowledge base
            context_str = """
--- STANDARD IGAD / ICPAC DISASTER PROTOCOLS ---
1. Flood Early Action: Evacuate low-lying riverine basins when water level surpasses 8.0m. Mobilize pre-positioned shelter kits within 12 hours.
2. Drought Protocol: Distribute emergency livestock fodder and activate water-trucking when SPEI drops below -1.5 (Severe Drought).
3. Cholera & Disease Prevention: Deploy mobile water purification units and oral rehydration salts upon first report of contaminated floodwaters.
"""
            citations.append(RagCitation(
                title="IGAD Standard Operating Guidelines for Hydro-Meteorological Hazards",
                category="policy",
                summary="Core regional early action protocols for Eastern Africa."
            ))

        system_prompt = """You are ActionLens RAG Early Warning Assistant — an expert AI decision support system trained on IGAD, ICPAC, and NDMA early warning and anticipatory action frameworks.
Answer the user's operational question based strictly on the provided policy documents and guidelines.
Keep your response structured, authoritative, and concise using markdown bullet points."""

        user_prompt = f"""OPERATIONAL CONTEXT / POLICIES:
{context_str}

USER STAKEHOLDER ROLE: {req.role.upper()}
USER REGION: {req.region}
USER QUESTION: "{req.query}"

Synthesise an actionable, policy-grounded answer:"""

        gpt_res = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=800,
        )

        answer = gpt_res.choices[0].message.content or "No response generated."

        return RagQueryResponse(
            query=req.query,
            answer=answer,
            citations=citations,
            model="gpt-4o",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")

