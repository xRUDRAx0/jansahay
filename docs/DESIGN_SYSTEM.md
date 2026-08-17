# Design System — JANSAHAY

## Philosophy

JANSAHAY uses a **light iOS-inspired glassmorphism** design language. The design prioritizes:

- **Clarity** — Information hierarchy that guides citizens through complex processes
- **Trust** — Clean, official-feeling aesthetic that conveys reliability
- **Accessibility** — High contrast, clear typography, generous spacing
- **Delight** — Subtle animations and micro-interactions that feel alive

## Color System

### Primary Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-primary` | `#1a56db` | `26, 86, 219` | Primary actions, links, active states |
| `--color-primary-light` | `#e8eeff` | `232, 238, 255` | Active nav background, highlights |
| `--color-sidebar` | `#f0f4ff` | `240, 244, 255` | Sidebar background |
| `--color-page` | `#f8faff` | `248, 250, 255` | Page background |
| `--color-card` | `#ffffff` | `255, 255, 255` | Card background |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#16a34a` | Met requirements, completed stages |
| `--color-warning` | `#f59e0b` | Warnings, needs verification |
| `--color-danger` | `#dc2626` | Urgent actions, scam alerts, errors |
| `--color-info` | `#2563eb` | Informational badges, updates |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#111827` | Headings, primary body text |
| `--color-text-secondary` | `#6b7280` | Subtitles, captions, labels |

## Typography

**Primary Font:** Inter (Google Fonts)
**Fallback Stack:** system-ui, sans-serif

| Level | Size | Weight | Letter Spacing |
|-------|------|--------|---------------|
| H1 | 2rem (32px) | 700 | -0.02em |
| H2 | 1.5rem (24px) | 700 | -0.01em |
| H3 | 1.25rem (20px) | 600 | 0 |
| Body | 0.875rem (14px) | 400 | 0 |
| Caption | 0.75rem (12px) | 500 | 0.05em |
| Label | 0.625rem (10px) | 600 | 0.1em (uppercase) |

## Glass Effects

### Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
}
```

### Glass Sidebar
```css
.glass-sidebar {
  background: rgba(240, 244, 255, 0.95);
  backdrop-filter: blur(16px);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}
```

### Glass Navigation
```css
.glass-nav {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
```

## Component Catalog

### Buttons — `GlassButton`

| Variant | Style | Use Case |
|---------|-------|----------|
| `primary` | Blue filled (#1a56db), white text | Primary actions: "Start Journey", "Submit" |
| `secondary` | Blue outline, blue text | Secondary actions: "View Details", "Cancel" |
| `ghost` | No border, blue text | Tertiary: "Skip", "Learn more" |

Sizes: `sm` (32px height), `md` (40px), `lg` (48px)

### Status Badges — `StatusBadge`

| Status | Color | Example |
|--------|-------|---------|
| `success` | Green bg, green text | "Met", "Available", "Completed" |
| `warning` | Orange bg, orange text | "Needs Verification", "In Progress" |
| `danger` | Red bg, red text | "Missing", "Urgent", "High Risk" |
| `info` | Blue bg, blue text | "Under Review", "92% Match" |
| `neutral` | Gray bg, gray text | "Not Started", "Pending" |

### Insight Cards — `InsightCard`

| Type | Border Color | Icon | Example |
|------|-------------|------|---------|
| `action` | Red (#dc2626) | AlertTriangle | "One document is missing" |
| `opportunity` | Green (#16a34a) | TrendingUp | "Income cert useful for 2 services" |
| `update` | Blue (#1a56db) | Info | "Application requires attention" |

### AI Orb — `AIOrb`

| Size | Diameter | Usage |
|------|----------|-------|
| `sm` | 24px | Chat input indicator |
| `md` | 48px | Sidebar, inline |
| `lg` | 96px | Agent page hero |

Animations:
- **Breathe**: 4s ease-in-out scale(1) → scale(1.05) → scale(1)
- **Pulse Ring**: 2s cubic-bezier expanding ring that fades out

## Spacing System

Uses Tailwind's default spacing scale:
- `4px` (1) — Tight spacing between related elements
- `8px` (2) — Default gap between inline items
- `12px` (3) — Card internal padding (compact)
- `16px` (4) — Standard card padding
- `24px` (6) — Section spacing
- `32px` (8) — Page-level padding (desktop)

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Single column, bottom nav |
| Desktop | ≥ 768px | Sidebar (256px) + content |

## Animation Principles

1. **Entrance**: Cards fade in + slide up (opacity 0→1, y 20→0)
2. **Stagger**: Sequential elements delay by 0.1s each
3. **Hover**: Cards lift slightly (translateY -2px, shadow increase)
4. **Transitions**: 200ms ease-out for color/bg, 300ms for layout
5. **AI Orb**: Continuous breathing + pulse ring for "thinking" state
