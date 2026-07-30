# ActionLens AI — AI Prompt Registry

> **Location**: `backend/AI_PROMPT_REGISTRY.md`  
> **Status**: Official Master Prompt Registry  

---

## 1. Recommendation Engine Prompt (`recommendations_engine`)

* **Prompt Name**: `recommendations_engine`
* **Current Active Version**: `v1.0.0`
* **Purpose**: Generates high-confidence, role-tailored disaster mitigation directive plans.
* **Inputs**: `role` (string), `region` (string), `hazard_type` (string), `telemetry_summary` (dict).
* **Model**: `gpt-4o`
* **Temperature**: `0.20`
* **Max Tokens**: `1500`
* **Response Format**: `json_object`
* **System Prompt**:
  ```text
  You are ActionLens AI, an expert decision intelligence engine for climate resilience and disaster response in East Africa. Your task is to analyze disaster telemetry, regional climate warnings, and operational context to generate structured, role-specific action plans.
  ```
* **User Template**:
  ```text
  Target Role: {role}
  Target Region: {region}
  Hazard Type: {hazard_type}
  Telemetry Context: {telemetry_summary}
  Generate top priority recommendations.
  ```
* **Output Schema**:
  ```json
  {
    "status": "success",
    "role": "government",
    "region": "Tana River",
    "recommendations": [
      {
        "action": "Issue Evacuation Order",
        "reasoning": "River levels exceeded critical 9.4m threshold.",
        "priority": "critical",
        "time_horizon": "Now (0-6h)",
        "expected_impact": "Protects 2,400 households",
        "confidence_score": 0.94,
        "evidence": [{"label": "River Gauge", "value": "9.4m", "source_type": "telemetry"}],
        "tasks": ["Send SMS broadcast", "Deploy rescue transport"]
      }
    ]
  }
  ```
* **Failure Handling & Fallback Strategy**: If OpenAI fails or returns malformed output, fall back to rules-based deterministic recommendation template for the user's role/region.

---

## 2. Vision Verification Prompt (`vision_verification`)

* **Prompt Name**: `vision_verification`
* **Current Active Version**: `v1.0.0`
* **Purpose**: Multimodal analysis of crowdsourced photos to verify reported flood, drought, or structural damage.
* **Inputs**: `image_url` (string), `reported_hazard` (string), `location_name` (string).
* **Model**: `gpt-4o` (Vision)
* **Temperature**: `0.10`
* **Max Tokens**: `1000`
* **Response Format**: `json_object`
* **System Prompt**:
  ```text
  You are ActionLens AI Computer Vision Verification Assistant. Analyze provided images to verify ground truth evidence of reported climate disaster hazards.
  ```
* **Output Schema**:
  ```json
  {
    "verified": true,
    "confidence": 0.96,
    "observed_features": ["Submerged roadway", "Water elevation above curb"],
    "risk_level": "critical",
    "summary": "GPT-4o Vision confirms severe flash flood inundation."
  }
  ```
* **Confidence Threshold**: Image verification require `confidence >= 0.75` for automatic verification status.

---

## 3. Disaster Executive Briefing Prompt (`disaster_briefing`)

* **Prompt Name**: `disaster_briefing`
* **Current Active Version**: `v1.0.0`
* **Purpose**: Synthesizes one-page executive Markdown summaries for institutional stakeholders.
* **Inputs**: `role` (string), `region` (string), `timeframe` (string).
* **Model**: `gpt-4o`
* **Temperature**: `0.30`
* **Max Tokens**: `2000`
* **Response Format**: `markdown_text`
* **System Prompt**:
  ```text
  You are ActionLens AI Executive Briefing Synthesizer. Generate an authoritative one-page disaster management briefing in clean Markdown for institutional decision-makers.
  ```

---

## 4. Action Impact Simulator Prompt (`impact_simulator`)

* **Prompt Name**: `impact_simulator`
* **Current Active Version**: `v1.0.0`
* **Purpose**: Calculates non-linear risk escalation and economic damage over emergency response delay hours.
* **Inputs**: `delay_hours` (integer), `region` (string), `hazard_type` (string).
* **Model**: `gpt-4o`
* **Temperature**: `0.20`
* **Max Tokens**: `1000`
* **Response Format**: `json_object`

---

## 5. Explainability Auditor Prompt (`explainability_engine`)

* **Prompt Name**: `explainability_engine`
* **Current Active Version**: `v1.0.0`
* **Purpose**: Provides transparent "Why?" justifications connecting telemetry signals to recommendation actions.
* **Inputs**: `action` (string), `telemetry` (dict).
* **Model**: `gpt-4o`
* **Temperature**: `0.20`
* **Max Tokens**: `800`

---

## 6. AI Streaming Assistant Prompt (`assistant_stream`)

* **Prompt Name**: `assistant_stream`
* **Current Active Version**: `v1.0.0`
* **Purpose**: Interactive RAG conversational assistant answering user queries using retrieved NDMA policy documents.
* **Inputs**: `query` (string), `context` (retrieved document chunks).
* **Model**: `gpt-4o`
* **Temperature**: `0.40`
* **Max Tokens**: `1500`
