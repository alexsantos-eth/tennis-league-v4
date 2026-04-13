# Separation Of Responsibilities

This guide defines where logic belongs and where it must not go.

## Responsibility Matrix

| Layer | Owns | Must Not Own | Good Reference |
|---|---|---|---|
| Astro page | Route entry, layout composition, page-level props | Business logic, Firebase calls, heavy state transitions | [src/pages/index.astro](../src/pages/index.astro) |
| Layout | Shell, global spacing, navigation/topbar composition | Feature form logic, data loading | [src/layouts/main.astro](../src/layouts/main.astro) |
| View container | Screen orchestration and section ordering | Raw DB access and low-level APIs | [src/views/match/new/client/index.tsx](../src/views/match/new/client/index.tsx) |
| Feature components | Focused UI sections, input wiring | Route decisions and direct remote I/O | [src/views/match/new/client/components/sport-tabs.tsx](../src/views/match/new/client/components/sport-tabs.tsx) |
| Hook | Side effects, local async loading state, cleanup | Global app shell concerns | [src/views/home/client/hooks/useMatches.ts](../src/views/home/client/hooks/useMatches.ts) |
| Store | Cross-section shared state, transitions, submit orchestration | JSX rendering | [src/store/new-match.ts](../src/store/new-match.ts) |
| Firebase module | Query/write functions and data mapping | UI-level state and form concerns | [src/firebase/match.ts](../src/firebase/match.ts) |
| Types | Domain contracts and payload shapes | Runtime side effects | [src/types/match.ts](../src/types/match.ts) |

## Dependency Rules

1. Components can call hook/store selectors.
2. Hooks/stores can call firebase modules.
3. Firebase can depend on config and types.
4. Views can orchestrate many components but should avoid owning low-level data transformation.
5. Types may be imported almost everywhere, but should not import runtime modules.

## Store vs Hook Decision Rule

Use a hook when:
- state is local to one screen branch,
- there is no need for cross-component write orchestration,
- cleanup lifecycle is tied to mount/unmount.

Use a store when:
- multiple sections write shared state,
- a single submit action needs combined payload building,
- modal/sheet state must be coordinated globally inside one screen flow.

Observed examples:
- Hook approach: [src/views/home/client/hooks/useMatches.tsx](../src/views/home/client/hooks/useMatches.tsx)
- Store approach: [src/store/new-match.ts](../src/store/new-match.ts)

## Firebase Boundary Rule

All Firestore reads/writes must flow through feature data modules.

Good pattern:

```ts
export const getRecentMatches = async (maxResults = 10): Promise<MatchRecord[]> => {
  const matchesQuery = query(
    collection(db, MATCH_COLLECTION),
    orderBy("scheduledAt", "asc"),
    limit(maxResults),
  );

  const snapshot = await getDocs(matchesQuery);
  return snapshot.docs.map((matchDoc) => ({
    id: matchDoc.id,
    ...(matchDoc.data() as Omit<MatchRecord, "id">),
  }));
};
```

Source: [src/firebase/match.ts](../src/firebase/match.ts)

## Client Tools Pattern

For view-specific async actions (form submissions, confirmations, single-use operations), create a tools module directly in the view folder. This module imports Firebase functions and abstracts them for component consumption. **Avoid creating API endpoints** unless there's a specific server-side requirement.

Pattern:

```ts
// src/views/match/[id]/client/tools/match.ts
import { confirmParticipant } from "@/firebase/match";

export const handleConfirmParticipation = async (
  matchId: string,
  participantId: string
): Promise<void> => {
  await confirmParticipant(matchId, participantId);
};
```

Then import and use in components:

```tsx
// src/views/match/[id]/client/components/match-cta-bar.tsx
import { handleConfirmParticipation } from "../tools/match";

const handleJoinMatch = async () => {
  await handleConfirmParticipation(matchId, currentUser.uid);
  window.location.reload();
};
```

Benefits:
- Keeps async logic near UI that consumes it
- Direct Firebase access—no extra HTTP roundtrip
- Type safety via direct imports
- Easier to test and debug

## Anti-Patterns And Corrections

1. Anti-pattern: component performs addDoc/getDocs directly.
   Correction: move those calls to src/firebase/<feature>.ts and consume from hook/store/tools.

2. Anti-pattern: component calls API endpoints for simple CRUD operations.
   Correction: use src/views/<screen>/client/tools/<feature>.ts to wrap Firebase functions instead.

3. Anti-pattern: view builds and mutates payload with many repeated literals.
   Correction: centralize transition logic in store action and typed payload in src/types.

4. Anti-pattern: hooks importing JSX components.
   Correction: hooks return state/actions only; component tree stays in view/components.

5. Anti-pattern: multiple files redefining the same union literals.
   Correction: export unions from src/types and consume by import.

## Pull Request Gate

A PR should be blocked when:
- Firebase is called directly from UI section components.
- Route or layout concerns are embedded in hook/store files.
- Shared type contracts are duplicated instead of imported.
- API endpoints exist for simple data operations that can be handled via client tools.
