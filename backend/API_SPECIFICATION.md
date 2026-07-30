# ActionLens AI — REST & Realtime API Specification

> **Location**: `backend/API_SPECIFICATION.md`  
> **Status**: Contract Specification for Frontend & Backend Engineers  
> **Target Version**: ActionLens AI v1.0 Production Candidate  

---

## 1. Authentication & User Profile Endpoints

### 1.1 User Registration
* **Route**: `POST /api/auth/register`
* **Auth Required**: No
* **Request Body**: `{ "email": "officer@disaster.gov.ke", "password": "SecurePassword123!", "full_name": "Sarah Chen", "role": "government" }`
* **Response (`201 Created`)**: `{ "status": "success", "data": { "user": { "id": "usr_9482", "email": "officer@disaster.gov.ke", "onboarding_complete": false } } }`

### 1.2 User Login
* **Route**: `POST /api/auth/login`
* **Auth Required**: No
* **Request Body**: `{ "email": "officer@disaster.gov.ke", "password": "SecurePassword123!" }`
* **Response (`200 OK`)**: Sets HttpOnly session cookie.

### 1.3 Update Onboarding Profile
* **Route**: `PATCH /api/user/onboarding`
* **Auth Required**: Yes (`Bearer` / SSR Cookie)
* **Request Body**: `{ "country": "Kenya", "region": "Tana River", "district": "Garissa South", "phone_number": "+254712345678", "interests": ["flood"], "notification_email": true }`

### 1.4 Upload Profile Avatar
* **Route**: `POST /api/user/avatar`
* **Auth Required**: Yes
* **Content-Type**: `multipart/form-data` (`avatar` image file)
* **Response (`200 OK`)**: `{ "avatar_url": "https://<supabase-id>.supabase.co/storage/v1/object/public/avatars/usr_9482.png" }`

### 1.5 Update General User Profile
* **Route**: `PUT /api/user/profile`
* **Auth Required**: Yes
* **Request Body**: `{ "full_name": "Sarah Chen", "phone_number": "+254712345678", "notification_email": true }`
* **Response (`200 OK`)**: `{ "status": "success", "data": { "user": {...} } }`

### 1.6 Request Password Reset Email
* **Route**: `POST /api/auth/forgot-password`
* **Auth Required**: No
* **Request Body**: `{ "email": "officer@disaster.gov.ke" }`
* **Response (`200 OK`)**: `{ "status": "success", "message": "Password reset instructions have been sent to your email." }`

### 1.7 Confirm Password Reset
* **Route**: `POST /api/auth/reset-password`
* **Auth Required**: Yes (Recovery session context)
* **Request Body**: `{ "password": "NewSecurePassword123!" }`
* **Response (`200 OK`)**: `{ "status": "success", "message": "Password updated successfully." }`

---

## 2. Dashboard & GIS Analytics Endpoints

### 2.1 Fetch Dashboard Summary
* **Route**: `GET /api/dashboard/summary?region=Tana+River&role=government`
* **Auth Required**: Yes
* **Response (`200 OK`)**: `{ "active_alert": {...}, "metrics": { "warnings_issued": 14, "communities_protected": 150 } }`

### 2.2 Fetch GIS Map Pins
* **Route**: `GET /api/map/pins?north=0.2&south=-0.1&east=39.8&west=39.2`
* **Auth Required**: Yes
* **Response (`200 OK`)**: `{ "pins": [{ "id": "p1", "lat": -0.05, "lng": 39.5, "type": "flood", "severity": "critical" }] }`

### 2.3 Fetch Risk Map Layer Heatmaps
* **Route**: `GET /api/map/layers?layer=flood`
* **Auth Required**: Yes
* **Response (`200 OK`)**: `{ "layer": "flood", "geojson": { "type": "FeatureCollection", "features": [...] } }`

---

## 3. AI Recommendations & Briefing Endpoints

### 3.1 Fetch Operational Recommendations
* **Route**: `GET /api/recommendations`
* **Query Parameters**: `region`, `role`, `priority`
* **Response (`200 OK`)**: Array of `Recommendation` objects.

### 3.2 Toggle Operational Task State
* **Route**: `PATCH /api/recommendations/:id/tasks`
* **Request Body**: `{ "task_text": "Authorize broadcast SMS", "completed": true }`

### 3.3 Generate Executive Disaster Briefing
* **Route**: `POST /api/briefings/generate`
* **Auth Required**: Yes
* **Request Body**: `{ "region": "Tana River", "role": "government", "timeframe": "24h" }`
* **Response (`201 Created`)**: `{ "briefing_id": "b1", "title": "24h Executive Briefing — Tana River", "content_markdown": "# Disaster Executive Summary...", "pdf_url": "..." }`

---

## 4. Consequence Simulator Endpoint

### 4.1 Run Impact Delay Simulation
* **Route**: `POST /api/simulations/run`
* **Auth Required**: Yes
* **Request Body**: `{ "delay_hours": 12, "region": "Tana River", "hazard_type": "flood" }`
* **Response (`200 OK`)**:
  ```json
  {
    "id": "sim_102",
    "scenario_a": { "response_time": "0h", "households_affected": 2400, "estimated_cost": "$45,000" },
    "scenario_b": { "response_time": "12h", "households_affected": 9600, "estimated_cost": "$320,000" },
    "key_differences": ["Casualty risk increases by 300%", "Primary exit bridge flooded"],
    "recommendation": "Execute immediate evacuation within 6h window."
  }
  ```

---

## 5. Community Hazard Reports Endpoints

### 5.1 Fetch Community Feed
* **Route**: `GET /api/community/reports?category=flood&page=1&limit=10`
* **Response (`200 OK`)**: Paginated list of verified community hazard reports.

### 5.2 Submit Community Report (Multipart)
* **Route**: `POST /api/community/reports`
* **Headers**: `Content-Type: multipart/form-data`
* **Form Parameters**: `description`, `category`, `latitude`, `longitude`, `photo`
* **Response (`201 Created`)**: `{ "id": "rpt_9921", "ai_verified": true, "ai_confidence": 0.94 }`

---

## 6. Emergency Alerts Subscriptions

### 6.1 Subscribe / Toggle Notifications
* **Route**: `POST /api/alerts/subscribe`
* **Auth Required**: Yes
* **Request Body**: `{ "region": "Tana River", "channel": "sms", "is_active": true }`
* **Response (`200 OK`)**: `{ "status": "subscribed", "channel": "sms" }`

---

## 7. Streaming AI Assistant Endpoints

### 7.1 Chat Assistant Stream (RAG)
* **Route**: `POST /api/assistant/chat`
* **Headers**: `Accept: text/event-stream`
* **Request Body**: `{ "message": "What is the SOP for livestock evacuation during high floods?", "conversation_id": "conv_102" }`
* **Response Chunk (`200 OK Stream`)**: `data: {"chunk": "According to NDMA protocols..."}\n\n`

### 7.2 Fetch Conversation History
* **Route**: `GET /api/assistant/conversations`
* **Auth Required**: Yes
* **Response (`200 OK`)**: List of user's past chat conversations with message history.
