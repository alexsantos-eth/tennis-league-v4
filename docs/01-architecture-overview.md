# Architecture Overview

This project follows a layered Astro + React feature architecture.
The most important rule is simple:

- Astro files define route entry and layout composition.
- React view containers orchestrate screen-level UI.
- Components render sections and inputs.
- Hooks and stores handle state and side effects.
- Firebase modules isolate remote I/O.
- Types and lib modules provide shared contracts and pure helpers.

## Layer Map

```text
Route request
  -> Astro page (src/pages/**/index.astro)
    -> Layouts (src/layouts/*.astro)
      -> React view container (src/views/**/client/index.tsx)
        -> Feature components (src/views/**/client/components/*.tsx)
          -> Hooks / Stores
            -> Firebase data modules
              -> Firestore/Auth APIs
```

## Reference Implementation: Home

- Entry page: [src/pages/index.astro](../src/pages/index.astro)
- Container: [src/views/home/client/index.tsx](../src/views/home/client/index.tsx)
- Data hook: [src/views/home/client/hooks/useMatches.ts](../src/views/home/client/hooks/useMatches.ts)
- Section composition: [src/views/home/client/components/matches.tsx](../src/views/home/client/components/matches.tsx)

Short route setup snippet from Home:

```astro
---
import Heads from "../layouts/heads.astro";
import Main from "../layouts/main.astro";
import Page from "../layouts/page.astro";
import Home from "@/views/home/client";
---

<Page>
  <Heads><title>Home | Liga de Tenis GT</title></Heads>
  <body>
    <Main showNav>
      <Home client:load />
    </Main>
  </body>
</Page>
```

## Reference Implementation: Match/New

- Entry page: [src/pages/match/new/index.astro](../src/pages/match/new/index.astro)
- Container: [src/views/match/new/client/index.tsx](../src/views/match/new/client/index.tsx)
- Store: [src/store/new-match.ts](../src/store/new-match.ts)
- Feature data constants: [src/views/match/new/client/contants.ts](../src/views/match/new/client/contants.ts)
- Feature helpers: [src/views/match/new/client/tools/dates.ts](../src/views/match/new/client/tools/dates.ts)

Short orchestration snippet from Match/New:

```tsx
const NewMatchPage: React.FC = () => {
  const handleSubmit = useNewMatchStore((state) => state.handleSubmit);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SportTabs />
        <MatchTypeSection />
        <TeamsSection />
        <DateTimeSection />
        <LocationSection />
        <SkillRangeSection />
        <MatchDetailsSection />
        <CommentsSection />
        <CreateMatchButton />
      </form>

      <DateSheet />
      <LocationSheet />
    </>
  );
};
```

## Why This Structure Works

- Clear boundaries reduce accidental coupling.
- Feature folders keep code discoverable.
- Shared UI primitives avoid duplicated visual logic.
- State and data concerns stay testable and replaceable.

## Current Codebase Note

- The standard for new React screens is `src/views/<feature>/client/*`.
- There is one legacy auth entry that still mounts from `src/views/auth/components/login.tsx`.
- Recommended migration path for auth: add `src/views/auth/client/index.tsx` and keep `components/*` + `hooks/*` below that client boundary.

## Cross-Cutting Modules

- Layout shell and page wrappers: [src/layouts/main.astro](../src/layouts/main.astro), [src/layouts/page.astro](../src/layouts/page.astro)
- Route definitions: [src/lib/routes.ts](../src/lib/routes.ts)
- Data access modules: [src/firebase/match.ts](../src/firebase/match.ts)
- Domain contracts: [src/types/match.ts](../src/types/match.ts)

## Anti-Patterns to Avoid

1. Calling Firebase directly from small presentational components.
2. Putting route-level layout decisions inside feature components.
3. Creating one giant view with embedded business logic and I/O.
4. Duplicating union types in multiple files instead of centralizing in src/types.

## Corrective Refactors

- Move remote calls from component files to src/firebase/<feature>.ts.
- Move reusable state transitions to hook or store modules.
- Split long views into ordered section components.
- Replace ad-hoc literal types with exported domain types.
