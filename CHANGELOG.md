# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Project Setup**: Initialized Next.js 15, TypeScript, Tailwind CSS 4, and App Router.
- **Design System**: Set up `globals.css` with Tailwind 4 `@theme` configuration, integrating the `Aspekta` font, defining color palette tokens, and shared utility classes.
- **UI Components**:
  - `Avatar`: Sizes, initial fallback, role-based colors.
  - `Badge`: 12 semantic variants, risk badge, priority badge.
  - `Button`: Multiple variants, sizes, loading states.
  - `Card`: Configurable padding, border, hover lift effects.
  - `Input` & `Textarea`: Complete form inputs with icons, validation states, password toggle.
  - `Shared`: EmptyState, ErrorState, LoadingSkeleton, AlertBanner, StatusDot.
- **Routing & Layout**:
  - Configured `RootLayout` with SEO metadata.
  - Implemented `(public)` layout and Auth pages (`/login`, `/register`, `/forgot-password`) with premium split-screen design.
  - Implemented `(app)` layout containing a responsive `Sidebar` and `Header`.
- **Dashboard**:
  - Implemented `/dashboard` page featuring Risk Overview, AI Recommendations cards, Weather snapshot, Map preview, and Alerts feed.
- **Utilities & Types**:
  - Created `utils/cn.ts` with comprehensive formatting and utility functions.
  - Created `types/index.ts` containing the complete domain models for ActionLens AI.

### Changed
- Refined UI spacing and alignment across all newly created screens.
- Updated `PROJECT_MEMORY.md` to reflect Sprint 1 & 2 progress.

### Fixed
- Addressed NPM initialization issues relating to capitalized folder names.
