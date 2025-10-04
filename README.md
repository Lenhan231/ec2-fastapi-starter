# Easy Body Platform — Prototype

This repo currently focuses on the product flows and the frontend prototype for the Easy Body platform. Back-of-house services (Spring Boot, moderation workers) will follow once the UI is validated.

## Documents

- `FLOW.md` — moderation and offer lifecycle (swimlanes, events, API slices)
- `LAYOUT.md` — screen structure, routing map, component tree, and data contracts

## Frontend (Next.js 14, TypeScript)

The `frontend/` directory contains an App Router project that realises the layout specification (header + bottom nav, tabbed routes, role-aware profile & management screens).

### Scripts

```bash
cd frontend
npm install
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1" npm run dev
```

The pages use server components for data fetching and gracefully fall back to curated mock data when the API is unavailable.

### Key Routes

- `/` — Gym discovery with filters, map peek, Airbnb-style cards
- `/offers/gyms` — Gym offer listing + moderation-aware highlights
- `/offers/gyms/[offerId]` — Offer detail page with related deals
- `/offers/pts` — PT offer listing with price filters
- `/offers/pts/[offerId]` — PT offer detail + PT profile context
- `/gyms/[gymId]` — Gym profile, reviews, related offers, PT listing
- `/gyms/[gymId]/pts` — PTs operating at the gym
- `/pts/[ptId]` — PT detail page
- `/manage/gym` — Gym Staff dashboard (info editor, offer wizard placeholder, PT approvals)
- `/manage/pt` — PT dashboard (profile editor, offer wizard placeholder)
- `/moderation` — Admin moderation queue (escalated offers)
- `/reports` — User reports awaiting re-review
- `/profile` — role-aware user space with bookmarks and reviews

All interaction shells include the validation rules mentioned in the spec (title length, validFrom/validTo hints, image requirements) so the backend contract is clear.

## Next Steps

1. Hook the UI to real endpoints (Spring Boot API following `FLOW.md`).
2. Implement Cognito-authenticated route guards and RBAC.
3. Add moderation dashboards (admin queue, report re-review) and analytics instrumentation.
