# ActionLens AI

## Project Information

Project Name:
ActionLens AI

Tagline:
IGAD Decision Intelligence Platform for Early Warning & Climate Resilience

Team:
ActionLens AI Core Team

Repository:
https://github.com/Maajolawasanjo/ActionLens-AI

Live Demo:
https://action-lens-ai.vercel.app/

Demo Video:
[YouTube Product Demo Link]

---

## Project Overview (Maximum 250 words)

ActionLens AI is a decision intelligence platform designed to translate raw environmental telemetry and climate data into role-specific, actionable directives for stakeholders in the East Africa IGAD sub-region. The Horn of Africa faces frequent, severe climate events such as flash floods, landslides, and droughts. While regional early warning systems exist, they typically generate broad warnings that fail to guide local actions. This results in "action paralysis," where local communities and response agencies receive alerts but lack the concrete instructions needed to coordinate effectively. This gap frequently leads to avoidable losses of lives and agricultural capital. 

ActionLens AI addresses this by providing tailor-made guidance checklists to citizens, first responders, NGOs, government officials, and health workers. By bridging the gap between hazard telemetry and response coordination, the platform reduces operational delay, secures evacuation pathways, and protects vulnerable communities and critical assets from climate shocks.

---

## Solution Details (Maximum 250 words)

The platform ingests real-time telemetry from environmental sensors and crowd-sourced hazard reports. Upon onboarding, users complete a profile establishing their role and region to receive a personalized dashboard interface. Citizens can report local incidents, upload geo-tagged photos, and receive immediate safety instructions. Responders access real-time dispatch timelines and incident locations, while government officials view regional analytics and coordinate funding.

AI is integrated directly into the core workflow. GPT-4o processes regional telemetry to generate localized, role-specific action lists. The platform uses GPT-4o Vision to verify citizen-submitted hazard photos, filtering out false reports by confirming the incident category and severity. A Policy RAG Assistant converts official disaster SOPs into searchable vector embeddings, allowing users to query protocols with natural language.

Unlike existing platforms that broadcast generic alerts, ActionLens AI isolates responsibilities by stakeholder role. This ensures that every actor—from a farmer safeguarding grain stores to a state administrator releasing disaster response funds—receives a customized, actionable checklist rather than a generic weather warning.

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| Frontend | React 19, Next.js 16.2.10 | Core framework for user interfaces and page routing. |
| Backend | FastAPI (Python 3.11+) | Async Python microservice for AI processing and integrations. |
| Database | Supabase PostgreSQL | Relational data storage for profiles, reports, and logs. |
| Authentication | Supabase Auth | Session-based cookie verification and JWT access control. |
| AI Models | OpenAI GPT-4o, GPT-4o-mini | Core LLM models for recommendation generation and image classification. |
| Embeddings | OpenAI text-embedding-3-small | 1536-dimensional embedding generation for policy documentation. |
| Vector Database | Supabase pgvector extension | Vector similarity storage and cosine distance retrieval. |
| GIS | PostGIS | Geographic Point and geometry calculations for coordinates. |
| Realtime | Supabase Realtime | WebSocket listener for push updates on hazard alerts. |
| Storage | Supabase Storage | File storage for citizen hazard report attachments. |
| Deployment | Vercel, Docker | Cloud hosting environments for web and API layers. |
| Languages | TypeScript, Python, SQL | Primary programming languages. |
| Frameworks | Next.js (App Router), FastAPI | Client-side and server-side frameworks. |
| Libraries | Leaflet, Recharts, Framer Motion | Utilities for mapping, charts, and animations. |

---

## Key Features

- **AI Recommendations**: Dynamically generated, localized action directives customized by user role and region.
- **Community Reports**: Geo-tagged hazard logs submitted by citizens with status tracks.
- **Vision AI Verification**: Multi-modal image analysis validating physical reports in real time to filter noise.
- **Interactive Disaster Map**: Geospatial representation of regional alerts, shelters, and hospital capacities.
- **Emergency Alerts**: Real-time push broadcasts triggered by regional telemetry updates.
- **Impact Simulator**: Predictive tool displaying projected casualties and asset losses based on evacuation delay.
- **RAG Assistant**: Dialogue interface answering protocol questions grounded in NDMA and ICPAC SOPs.
- **Analytics Dashboard**: Trend charts showing prediction accuracy, hazard types, and response times.
- **Emergency Resource Directory**: Searchable registry of regional shelters, hospitals, and contact lines.
- **Role-Based Dashboards**: Isolated interfaces for Citizens, Responders, NGOs, Governments, and Admins.
- **Realtime Updates**: Synchronized data pipeline using WebSockets to update dashboard feeds instantly.
- **Notifications**: Instant pop-up warnings broadcast during critical atmospheric shifts.
- **Offline Report Queue**: Local client storage caching submitted reports when connection drops.
- **Admin Control Panel**: Back-office center showing system health logs and operational costs.
- **Prompt Manager**: Direct system template editor for adjusting LLM generation formats.
- **Knowledge Base**: Curated repository of emergency guidelines, checklists, and manual links.

---

## User Roles

### Citizen
Focuses on local safety. Receives immediate weather updates, routes safe evacuation corridors, downloads survival checksheets, and reports local dangers with photographic attachments.

### Emergency Responder
Acts as the field crew. Monitors active incidents, reviews GPS coordinates, updates team deployment states, and uses dispatch checklists.

### Government
Maintains high-level oversight. Inspects regional analytics, views consequence estimations, exports situation reports, and authorizes disaster budgets.

### NGO
Coordinates humanitarian aid. Views shelter occupancies, monitors food and water logistics, and logs volunteer allocations across camps.

### Administrator
Manages platform operations. Tracks daily API token expenses, edits system prompt templates, adds document vectors, and toggles system maintenance flags.

---

## AI Features

### 1. Tailored Recommendation Engine
Uses GPT-4o to analyze sensor telemetry and user profile details. Synthesizes concrete tasks and safety checklists customized for the specific role (e.g. harvesting guidance for farmers, dispatch orders for fire crews).

### 2. Multi-Modal Vision Verification
Invokes GPT-4o Vision to examine user-uploaded report photos. Compares visual evidence against description text to filter out false alarms, outputting verification status, confidence score, and severity level.

### 3. Policy RAG Assistant
Integrates semantic search using vector embeddings (`text-embedding-3-small`) stored in `pgvector`. Retrieves matching paragraphs from disaster guidelines and generates structured answers citing official files.

---

## Architecture Summary

```mermaid
graph TD
    User["Web Browser (Client)"]
    Next["Next.js Server Actions & API"]
    FastAPI["FastAPI AI Microservice"]
    Supa["Supabase Database (PostgreSQL)"]
    OpenAI["OpenAI API"]

    User -->|Sends Requests| Next
    Next -->|Queries Data & Auth| Supa
    Next -->|Routes AI Tasks| FastAPI
    FastAPI -->|Vector Similarity Search| Supa
    FastAPI -->|Requests Embeddings & LLM| OpenAI
    Supa -->|Realtime Updates| User
```

- **Next.js**: Serves the user interface, manages session routing, and passes API requests.
- **FastAPI**: Handles Python integrations, performing async API operations for AI processing.
- **Supabase**: Controls user sessions, manages relational data, and provides real-time client syncing.
- **OpenAI**: Powers the generation of text directives, image checks, and vector embeddings.
- **pgvector**: Computes cosine distance similarities within PostgreSQL for RAG matches.
- **Realtime**: Maintains active WebSockets to push regional warnings to the client.
- **Storage**: Hosts image attachments uploaded during hazard reporting.

---

## Deployment

### GitHub Repository
https://github.com/Maajolawasanjo/ActionLens-AI

### Live Application
https://action-lens-ai.vercel.app/

### Demo Video
[YouTube Product Demo Link]

---

## Future Improvements

- **USSD and SMS Fallback**: Integration with regional SMS gateways to allow users without internet access to report hazards and receive AI checklists.
- **Advanced Consequence Simulation**: Incorporation of machine learning regression models mapping rainfall curves to crop losses.
- **Offline Syncing Nodes**: Local community servers caching regional databases to maintain core maps and checklists during internet blackouts.
- **Multi-Model Backup Strategy**: Auto-failover logic routing requests to open-source models (e.g. Llama-3) if external APIs go offline.
- **Satellite and Map AI Auto-Detection**: Integration with Google Maps Platform and high-resolution satellite imagery pipelines to automatically scan geographic sectors for early signals of flooding, drought, or wildfires, generating automated hazard alerts without requiring manual user reports.

