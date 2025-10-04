# Easy Body Frontend

Next.js 14 App Router prototype that implements the Easy Body layout: header, bottom navigation, role-aware profile, and management dashboards for Gym Staff and PT.

## Setup

```bash
npm install
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1" npm run dev
```

Pages automatically fall back to curated mock data when the backend is offline so stakeholders can review UI flows early.

## Structure

```
frontend/
├── app/
│   ├── page.tsx              # Home – gym discovery with filter bar & map peek
│   ├── profile/page.tsx      # Role-aware profile
│   ├── offers/
│   │   ├── gyms/page.tsx           # Gym offer listing
│   │   ├── gyms/[offerId]/page.tsx # Gym offer detail
│   │   ├── pts/page.tsx            # PT offer listing
│   │   └── pts/[offerId]/page.tsx  # PT offer detail
│   ├── gyms/[gymId]/page.tsx       # Gym detail (offers + reviews)
│   ├── gyms/[gymId]/pts/           # PT listing for a specific gym
│   ├── pts/[ptId]/page.tsx         # PT profile detail
│   ├── manage/
│   │   ├── gym/page.tsx            # Gym Staff dashboard placeholder
│   │   └── pt/page.tsx             # PT dashboard placeholder
│   ├── moderation/page.tsx         # Admin moderation queue
│   └── reports/page.tsx            # User reports triage
├── components/               # Header, BottomNav, Filter bars, cards, lists
├── lib/api.ts                # Fetch helpers + mock fallbacks
└── types/                    # Shared UI contracts
```

## Design Notes

- Uses CSS Modules + global design tokens (`app/globals.css`).
- Filter bars are interactive client components; listing pages stay as server components.
- Management screens embed validation hints from the specification (title ≤ 80, valid_from < valid_to, image ratio suggestions).
- Moderation queue & reports pages surface the SageMaker / policy pipeline outputs so product stakeholders can review the flow end-to-end.
