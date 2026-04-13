# Screen Development Docs

This folder contains the style and architecture guides to keep screen work consistent.

## Reading Order

1. [01-architecture-overview.md](./01-architecture-overview.md)
2. [02-folder-structure-and-naming.md](./02-folder-structure-and-naming.md)
3. [03-separation-of-responsibilities.md](./03-separation-of-responsibilities.md)
4. [04-new-screen-playbook.md](./04-new-screen-playbook.md)
5. [05-reference-home-vs-match-new.md](./05-reference-home-vs-match-new.md)
6. [06-screen-template-checklists.md](./06-screen-template-checklists.md)

## Intended Audience

- Developers creating new screens.
- Reviewers validating architecture and consistency.

## How To Use In Practice

1. Start with architecture and folder conventions.
2. Use the playbook while implementing the screen.
3. Compare with Home vs Match/New to choose pattern.
4. Run the template checklist before opening the PR.

## Source References Used

- [../src/pages/index.astro](../src/pages/index.astro)
- [../src/pages/match/new/index.astro](../src/pages/match/new/index.astro)
- [../src/views/home/client/index.tsx](../src/views/home/client/index.tsx)
- [../src/views/home/client/hooks/useMatches.tsx](../src/views/home/client/hooks/useMatches.tsx)
- [../src/views/match/new/client/index.tsx](../src/views/match/new/client/index.tsx)
- [../src/store/new-match.ts](../src/store/new-match.ts)
- [../src/firebase/match.ts](../src/firebase/match.ts)
- [../src/types/match.ts](../src/types/match.ts)
- [../src/layouts/main.astro](../src/layouts/main.astro)
- [../src/lib/routes.ts](../src/lib/routes.ts)
