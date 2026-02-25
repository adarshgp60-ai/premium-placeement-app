# KodNest Premium Build System

## Design Philosophy
- Calm, intentional, coherent, confident
- No gradients, no glassmorphism, no neon tones, no decorative motion
- One visual language across all sections and states

## Core Tokens
- Background: `#F7F6F3`
- Primary text: `#111111`
- Accent: `#8B0000`
- Success: muted green (`#5F6F57`)
- Warning: muted amber (`#8A6A3A`)

## Typography
- Headings: `Fraunces` serif, confident scale, tight hierarchy
- Body: `Manrope` sans-serif, 16px base, line-height 1.7
- Text blocks constrained to max width 720px

## Spacing Scale
- 8px
- 16px
- 24px
- 40px
- 64px

## Global Layout
1. Top Bar
2. Context Header
3. Primary Workspace + Secondary Panel
4. Persistent Proof Footer

## Components
- Buttons: primary solid deep red, secondary outlined
- Inputs: subtle border, clear focus ring, no heavy shadow
- Cards: subtle border, balanced padding, no drop shadows
- Status: concise labels for success, warning, error, empty

## Interaction Rules
- Shared transition timing: 180ms ease-in-out
- No bounce, no parallax

## Error and Empty States
- Error copy explains issue + direct fix path
- Empty states provide clear next action

## Implementation Files
- `index.html`: layout structure and component composition
- `styles.css`: tokens, type scale, spacing, components, responsive rules
- `app.js`: copy action for prompt box
