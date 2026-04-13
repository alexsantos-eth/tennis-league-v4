# Reference: Home vs Match/New

Use this comparison to decide which implementation style to copy.

## Snapshot Comparison

| Dimension | Home | Match/New |
|---|---|---|
| Primary goal | Display and browse | Create and submit |
| Entry page complexity | Low | Medium |
| View container complexity | Low | High |
| State strategy | Local hook | Shared Zustand store |
| Section count | Few | Many |
| Modal/sheet coordination | Minimal | Required |
| Submit orchestration | None | Centralized in store |

## Home Pattern Highlights

References:
- [src/pages/index.astro](../src/pages/index.astro)
- [src/views/home/client/index.tsx](../src/views/home/client/index.tsx)
- [src/views/home/client/hooks/useMatches.ts](../src/views/home/client/hooks/useMatches.ts)

Why it works:
- Simple screen orchestration.
- Data fetch lifecycle isolated in one hook.
- Low coupling between sections.

When to copy Home style:
- Read-heavy screens.
- Few interactions and no cross-section draft state.
- Data can be loaded once and displayed.

## Match/New Pattern Highlights

References:
- [src/pages/match/new/index.astro](../src/pages/match/new/index.astro)
- [src/views/match/new/client/index.tsx](../src/views/match/new/client/index.tsx)
- [src/store/new-match.ts](../src/store/new-match.ts)

Why it works:
- Complex multi-section form coordinated through one store.
- Sheet/modal states managed centrally.
- Single typed submit flow to Firebase.

When to copy Match/New style:
- Form-driven workflows.
- Multiple independent sections editing shared payload.
- Dynamic computed state and coordinated submit transitions.

## Example Decision Rule

If your new screen needs at least three of these, choose store-first architecture:
- More than one modal/sheet.
- Cross-section validation dependencies.
- Single final payload composed from many section inputs.
- Pending submit state that disables many controls.

Otherwise, prefer hook-first architecture and keep state local.

## Anti-Patterns Seen In Teams (And Safer Alternatives)

1. Anti-pattern: force store usage for every screen.
   Alternative: default to hook/local state unless complexity proves store value.

2. Anti-pattern: duplicate Home and Match/New both, then mix patterns inconsistently.
   Alternative: pick one baseline per screen and document the decision in PR notes.

3. Anti-pattern: copy feature constants/tools into src/lib by default.
   Alternative: keep feature-local until real cross-feature reuse appears.
