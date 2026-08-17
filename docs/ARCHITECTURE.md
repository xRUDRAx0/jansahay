# Architecture — JANSAHAY

## Overview

JANSAHAY follows a **modular, component-driven architecture** built on Next.js 16 App Router with React 19.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    JANSAHAY CLIENT                       │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Landing    │  │    Login     │  │  Demo Entry  │  │
│  │   Page (/)   │  │  (/login)   │  │   (/demo)    │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  │
│                                             │          │
│  ┌──────────────────────────────────────────▼────────┐  │
│  │              APP SHELL (Route Group)              │  │
│  │  ┌─────────┐                    ┌──────────────┐  │  │
│  │  │ Sidebar │  ┌──────────────┐  │  Mobile Nav  │  │  │
│  │  │ (Desktop)│  │    ROUTES   │  │   (Mobile)   │  │  │
│  │  │         │  │             │  │              │  │  │
│  │  │ • Home  │  │ /dashboard  │  │ • Home       │  │  │
│  │  │ • Agent │  │ /agent      │  │ • Agent      │  │  │
│  │  │ • Find  │  │ /discover   │  │ • Journeys   │  │  │
│  │  │ • Docs  │  │ /journeys   │  │ • Docs       │  │  │
│  │  │ • Track │  │ /documents  │  │ • Profile    │  │  │
│  │  │ • Verify│  │ /tracker    │  │              │  │  │
│  │  │ ...     │  │ /verify     │  │              │  │  │
│  │  └─────────┘  │ /profile    │  └──────────────┘  │  │
│  │               │ /settings   │                    │  │
│  │               └──────────────┘                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              STATE MANAGEMENT                     │   │
│  │                                                   │   │
│  │  DemoProvider (React Context)                     │   │
│  │  ├── state: DemoState                             │   │
│  │  ├── sendMessage(content) → agent simulation      │   │
│  │  ├── uploadDocument(file) → extraction sim        │   │
│  │  ├── analyzeMessage(text) → scam detection sim    │   │
│  │  ├── markActionComplete(id)                       │   │
│  │  ├── markNotificationRead(id)                     │   │
│  │  └── updateProfile(updates)                       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              COMPONENT LIBRARY                    │   │
│  │                                                   │   │
│  │  Glass UI:    GlassCard • GlassButton • GlassInput│   │
│  │  Data Cards:  StatCard • InsightCard • ServiceCard│   │
│  │  Journey:     JourneyTimeline • ReadinessScore    │   │
│  │  Documents:   DocumentCard • UploadZone           │   │
│  │  Agent:       AIOrb • AgentActivity • VoiceButton │   │
│  │  Trust:       SourceBadge • TrustIndicator        │   │
│  │  Layout:      Sidebar • MobileNav • AppShell      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Input (natural language)
    │
    ▼
┌─────────────────────┐
│   Entity Extraction  │  → age, location, occupation, income, intent
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Service Matching   │  → Multi-criteria scoring against service DB
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Eligibility Checking │  → Requirement-by-requirement comparison
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Document Analysis   │  → Cross-reference available docs
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Recommendation     │  → Ranked matches + action plan
└─────────────────────┘
```

## Route Structure

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Static | Landing page, hero, CTAs |
| `/login` | Static | Authentication |
| `/demo` | Static | Demo redirect → /dashboard |
| `/dashboard` | Client | Main hub with stats & insights |
| `/agent` | Client | Conversational AI interface |
| `/discover` | Client | Service search & filtering |
| `/discover/results` | Client | Ranked match results |
| `/services/[id]` | Dynamic | Individual service detail |
| `/eligibility` | Client | Eligibility comparison matrix |
| `/journeys` | Client | Active journey list |
| `/journeys/[id]` | Dynamic | Journey detail + timeline |
| `/documents` | Client | Document Doctor upload + analysis |
| `/documents/[id]` | Dynamic | Document detail + extracted fields |
| `/action-plan` | Client | Prioritized action items |
| `/tracker` | Client | Application status tracking |
| `/verify` | Client | Scam detection interface |
| `/resources` | Client | Knowledge base browser |
| `/notifications` | Client | Notification center |
| `/profile` | Client | User profile management |
| `/settings` | Client | App preferences |

## Component Dependency Graph

```
AppShell
├── Sidebar (desktop)
│   └── Link (next/link) + usePathname
├── MobileNav (mobile)
│   └── Link (next/link) + usePathname
└── Main Content
    └── Page Components
        ├── GlassCard (container)
        ├── GlassButton (actions)
        ├── GlassInput (forms)
        ├── StatCard → GlassCard
        ├── InsightCard → GlassCard
        ├── ServiceCard → GlassCard + StatusBadge
        ├── DocumentCard → GlassCard + StatusBadge
        ├── ActionCard → GlassCard + GlassButton
        ├── NotificationCard → GlassCard
        ├── JourneyTimeline (standalone SVG)
        ├── ReadinessScore (standalone SVG)
        ├── AIOrb (framer-motion)
        ├── AgentActivity (step list)
        ├── UploadZone (drag & drop)
        ├── VoiceButton (Web Speech API)
        ├── SourceBadge (text badge)
        └── TrustIndicator (icon + label)
```
