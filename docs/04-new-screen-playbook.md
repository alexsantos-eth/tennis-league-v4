# New Screen Playbook

Use this playbook whenever creating a new screen.

## Phase 1: Route Entry

1. Create route folder under src/pages.
2. Add index.astro.
3. Compose with Heads, Main, Page.
4. Mount view container with client:load.

Template:

```astro
---
import Heads from "../../../layouts/heads.astro";
import Main from "../../../layouts/main.astro";
import Page from "../../../layouts/page.astro";
import FeatureView from "@/views/<feature>/client";

export const prerender = false;
---

<Page>
  <Heads><title>Feature | Liga de Tenis GT</title></Heads>
  <body>
    <Main showNav>
      <FeatureView client:load />
    </Main>
  </body>
</Page>
```

Reference:
- [src/pages/index.astro](../src/pages/index.astro)
- [src/pages/match/new/index.astro](../src/pages/match/new/index.astro)

## Phase 2: View Container

1. Create src/views/<feature>/client/index.tsx as orchestrator.
2. Keep it focused on section ordering and top-level submit wiring.
3. Avoid direct Firestore calls in this file.

Reference:
- [src/views/home/client/index.tsx](../src/views/home/client/index.tsx)
- [src/views/match/new/client/index.tsx](../src/views/match/new/client/index.tsx)

## Phase 3: Decide State Strategy

Decision tree:

- If the screen needs local fetch/display only -> hook.
- If multiple sections mutate shared flow state -> store.
- If both are needed, separate concerns cleanly: hook for remote query state, store for form workflow.

Hook reference:
- [src/views/home/client/hooks/useMatches.ts](../src/views/home/client/hooks/useMatches.ts)

Store reference:
- [src/store/new-match.ts](../src/store/new-match.ts)

## Phase 4: Build Feature Sections

1. Create src/views/<feature>/client/components and split by visual responsibility.
2. Use suffixes for intent (-section, -sheet, -row, -card).
3. Use UI primitives from src/components/ui.

Good examples:
- [src/views/match/new/client/components/date-time-section.tsx](../src/views/match/new/client/components/date-time-section.tsx)
- [src/views/match/new/client/components/location-sheet.tsx](../src/views/match/new/client/components/location-sheet.tsx)
- [src/views/home/client/components/match-card.tsx](../src/views/home/client/components/match-card.tsx)

## Phase 5: Data And Type Contracts

1. Add src/types/<feature>.ts.
2. Add src/firebase/<feature>.ts with async functions.
3. Keep payload shaping in one place and typed.

Minimal reference pattern:

```ts
const payload: Omit<MatchRecord, "id"> = {
  ...input,
  comments: input.comments.trim(),
  location: input.location.trim(),
  scheduledAt: `${input.dateOfMatch}T${input.timeOfMatch}`,
  status: input.isReserved ? "reserved" : "open",
  createdAt: now,
  updatedAt: now,
};
```

Source:
- [src/firebase/match.ts](../src/firebase/match.ts)
- [src/types/match.ts](../src/types/match.ts)

## Phase 6: Route And Auth Integration

1. Add route entry in route definitions when needed.
2. Ensure middleware behavior matches access intent.

References:
- [src/lib/routes.ts](../src/lib/routes.ts)
- [src/middleware.ts](../src/middleware.ts)

## Delivery Checklist Before Merge

- Astro page composes correct layout behavior (nav/topbar) for the screen.
- View container has orchestration only, not persistence logic.
- All remote access is isolated to src/firebase modules.
- Types include distinct input and persisted record contracts where relevant.
- Components are small and named by responsibility.
- Hook/store decision is justified by screen complexity.
- Loading, error, and empty states are covered where data is fetched.

## Anti-Patterns To Explicitly Reject

1. Creating a feature with no src/views/<feature>/client folder and all logic in index.astro.
2. Adding untyped payload assembly directly in submit button component.
3. Copy-pasting existing store code without trimming irrelevant fields.
4. Hardcoding routes in multiple components instead of using route config.
