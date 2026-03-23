# Folder Structure And Naming

This guide standardizes folder organization and naming for all new work.

## Canonical Folder Structures

### Simple Screen (read-focused)

```text
src/pages/<feature>/
  index.astro
  views/
    <feature>.tsx
    components/
      <feature>-header.tsx
      <feature>-list.tsx
    hooks/
      use<Feature>.ts
```

### Complex Screen (form-heavy or multi-section)

```text
src/pages/<feature>/
  index.astro
  views/
    <feature>.tsx
    contants.ts
    tools.ts
    components/
      <section-a>-section.tsx
      <section-b>-section.tsx
      <modal-a>-sheet.tsx
    hooks/
      use<Feature>.ts
```

### Shared Modules

```text
src/store/<feature>.ts
src/firebase/<feature>.ts
src/types/<feature>.ts
src/lib/<utility>.ts
```

## Naming Conventions

## Astro files

- Use lowercase route files like index.astro under feature folders.
- Keep imports ordered: Heads, Main, Page, then view container.

## React component files

- Use kebab-case file names.
- Prefer descriptive suffixes:
  - -section.tsx for grouped form/feature sections.
  - -sheet.tsx for sheet/dialog driven content.
  - -card.tsx for repeatable display blocks.
  - -row.tsx and -col.tsx for explicit structural chunks.

Examples:
- [src/pages/match/new/views/components/match-type-section.tsx](../src/pages/match/new/views/components/match-type-section.tsx)
- [src/pages/match/new/views/components/date-sheet.tsx](../src/pages/match/new/views/components/date-sheet.tsx)
- [src/pages/views/components/match-card.tsx](../src/pages/views/components/match-card.tsx)

## Hook files

- Always prefix with use, camel-cased after use.
- One file per screen-level hook unless there is a clear split.

Example:
- [src/pages/views/hooks/useMatches.ts](../src/pages/views/hooks/useMatches.ts)

## Store files

- Use kebab-case by feature intent.
- Export hook with explicit feature naming: useXStore.

Example:
- [src/store/new-match.ts](../src/store/new-match.ts)

## Constants and tools

- Keep feature-only static options inside views/contants.ts.
- Keep feature-only pure helpers inside views/tools.ts.
- Promote to src/lib only when reused across multiple features.

## Types

- Domain types live in src/types.
- Use explicit input vs record interfaces when persistence transforms fields.

Example:
- [src/types/match.ts](../src/types/match.ts)

## Import Conventions

- Use relative imports inside a single feature subtree.
- Use root-level aliases where already established for shared modules.
- Avoid deep cross-feature imports.

## Allowed Dependency Direction

```text
pages -> views -> components
views -> hooks/store
hooks/store -> firebase/types/lib
components -> store/hooks/ui/types
firebase -> types/config
```

Reverse dependencies are not allowed.

## Anti-Patterns to Avoid

1. Generic file names like helpers.ts for unrelated logic.
2. Dropping all feature logic into one huge component file.
3. Importing from another feature's internal components folder.
4. Defining screen-specific constants in src/lib prematurely.

## Review Checklist

- Folder shape matches one of the canonical templates.
- File names communicate purpose without opening the file.
- Screen-specific utilities stay local until reuse is proven.
- Domain types are centralized under src/types.
