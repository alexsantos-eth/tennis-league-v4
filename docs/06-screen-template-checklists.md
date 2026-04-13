# Screen Templates And Checklists

These templates speed up consistent implementation.

## Template A: Minimal Read-Only Screen

Use when the screen mostly displays data.

```text
src/pages/<feature>/index.astro
src/views/<feature>/client/index.tsx
src/views/<feature>/client/components/<feature>-header.tsx
src/views/<feature>/client/hooks/use<Feature>.tsx
src/firebase/<feature>.ts
src/types/<feature>.ts
```

Checklist:
- Uses one screen hook for fetch/loading/error.
- No global store unless proven necessary.
- Components are presentational and small.

## Template B: Multi-Section Form Screen

Use when many sections build one payload.

```text
src/pages/<feature>/index.astro
src/views/<feature>/client/index.tsx
src/views/<feature>/client/components/*-section.tsx
src/views/<feature>/client/components/*-sheet.tsx
src/views/<feature>/client/contants.ts
src/views/<feature>/client/tools/*.ts
src/store/<feature>.ts
src/firebase/<feature>.ts
src/types/<feature>.ts
```

Checklist:
- Store contains shared draft state and transitions.
- Submit action is centralized and typed.
- Section components only select/write relevant store slices.
- Sheet open/close state is not duplicated in multiple components.

## Template C: Hybrid Screen (List + Create/Edit controls)

Use when a screen combines display and controlled edits.

```text
src/views/<feature>/client/hooks/use<FeatureList>.tsx
src/store/<feature>-draft.ts
src/views/<feature>/client/components/<feature>-list.tsx
src/views/<feature>/client/components/<feature>-editor-sheet.tsx
```

Checklist:
- Hook owns list fetch lifecycle.
- Store owns draft/edit transitions only.
- Firebase module exposes list + mutate operations.

## Quality Gates For All Templates

- Route entry follows layout composition conventions.
- Naming follows kebab-case file strategy and semantic suffixes.
- Type contracts separate persisted record from input payload.
- Firebase module has no JSX imports.
- No component performs direct Firestore calls.
- Error and loading states exist for async reads.

## Quick PR Checklist

- Architecture choice documented (hook-first or store-first).
- New files fit canonical folder shape.
- No duplicated literal unions outside src/types.
- Route and middleware behavior verified if access rules changed.
- Screen tested manually for main flow, error flow, and empty flow.
