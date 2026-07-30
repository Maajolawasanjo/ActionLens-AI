# ActionLens AI — Master AI Guardrails Policy

> **Location**: `backend/AI_GUARDRAILS.md`  
> **Status**: Mandatory AI Governance Policy  

---

## 1. Executive Summary

ActionLens AI operates in high-stakes disaster response and climate resilience environments across East Africa. Recommendations and intelligence provided by the platform directly inform institutional decision-makers, emergency responders, and local communities.

This document establishes the mandatory **AI Guardrails Framework**. Every AI service—Recommendations, RAG, Vision, Briefings, and Assistant—must comply with these guardrails before responses are returned to the user or stored in the database.

---

## 2. Recommendation Approval Pipeline

The LLM **proposes** recommendations. The ActionLens application **approves** or **calibrates** them.

```
OpenAI Proposal
      │
      ▼
Pydantic Validation (Structural Integrity)
      │
      ▼
Business Rules Engine (Logic & Telemetry Cross-Check)
      │
      ▼
Confidence Calibration Engine (Multi-Source Penalty & Calibration)
      │
      ▼
Evidence Verification (Staleness & Source Integrity)
      │
      ▼
Application Approval & Supabase Persistence
```

### Business Validation Rules:
1. **Multi-Source Evidence Calibration**: If an AI recommendation has `confidence > 0.95` but only **1 evidence item**, its confidence is automatically calibrated down (capped at `0.88`).
2. **Telemetry Cross-Verification**: If a recommendation references flood evacuation or breach risks, but regional telemetry contains no active flood warnings or rainfall sensor data, the recommendation is flagged or assigned a confidence penalty (`-0.20`).
3. **Staleness Guard**: If supporting telemetry evidence is older than **24 hours**, the recommendation is tagged with `stale_evidence = true` and flagged for operator review.
4. **Mandatory Action Checklist**: Recommendations with fewer than 2 actionable steps are automatically rejected.

---

## 3. Allowed vs. Forbidden AI Behaviors

| Category | Allowed Behavior | Forbidden Behavior |
|---|---|---|
| **Factual Integrity** | Citing verified Hydro-Met sensors, NDMA manuals, satellite telemetry. | Fabricating sensor readings, inventing non-existent river gauges, or making ungrounded predictions. |
| **Citations (RAG)** | Returning exact document names, chunk IDs, page numbers, and cosine similarity scores. | Inventing source titles, guessing page numbers, or providing uncited claims. |
| **Confidence Scoring** | Outputting realistic scores (0.00 to 1.00) subject to application calibration. | Hardcoding 1.00 confidence on unverified crowdsourced reports. |
| **Prompt Injection** | Stripping malicious instructions (e.g. "Ignore previous instructions") from user input. | Executing system overrides or revealing API keys, system prompts, or credentials. |

---

## 4. Confidence Thresholds & Action Triggers

* **High Confidence (`>= 0.85`)**: Direct automated distribution to role dashboard.
* **Moderate Confidence (`0.70` - `0.84`)**: Highlighted on dashboard with telemetry review prompt.
* **Low Confidence (`< 0.70`)**: Trigger for Human Review. Blocked from automatic citizen SMS broadcasts.
* **Insufficient RAG Information (`similarity < 0.70`)**: RAG Engine must return `"I couldn't find sufficient verified information."`

---

## 5. Prompt Injection Defense Rules

1. All user-supplied string inputs (`query`, `reported_hazard`, `location_name`, `region`) are sanitized using `sanitize_prompt_input()`.
2. Delimiters are enforced between system instructions and user context.
3. User context is isolated in single-purpose text blocks to prevent context leakage.
