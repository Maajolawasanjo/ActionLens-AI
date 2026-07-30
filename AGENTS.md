<!-- BEGIN:nextjs-agent-rules -->
# ActionLens AI Project Rules

## Technical Stack
- **Framework**: Next.js 16.2.10
- **Frontend Library**: React 19 (React 19.2.4)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database / Auth**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Realtime)
- **AI Microservice**: FastAPI (Python 3.11+, Async OpenAI GPT-4o, pgvector RAG)

## Core Developer Rules
1. **Verify Path Existence**: Never assume documentation or source files exist at a path — verify a file/path exists before reading, citing, or editing it.
2. **Strict Completion Verification**: Never mark a task, endpoint, database table, or feature as complete, tested, or production-ready unless you have actually executed it and observed it working (e.g., verifying the dev server compiles, testing endpoint responses, database query validation).
3. **Sequential Focus**: Work on exactly one task at a time. Confirm the application compiles and runs successfully before considering any step done.
4. **Scoping discipline**: Do not touch or modify any files outside what was explicitly requested.
<!-- END:nextjs-agent-rules -->
