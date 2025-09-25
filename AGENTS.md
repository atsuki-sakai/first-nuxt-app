# Repository Guidelines

## Project Structure & Module Organization
- `app.vue` anchors layout meta and global shells; feature routes live in `pages/` with todos flows under `pages/todos/` (`index.vue`, `create.vue`, `[id].vue`).
- UI primitives sit in `components/ui/`; todo-specific widgets in `components/todo/`; Nuxt auto-imports both directories.
- Domain logic belongs in `composables/` with shared contracts in `types/`; keep layout wrappers in `layouts/` and static assets in `public/`.
- Keep configuration centralized in `nuxt.config.ts`; never track `.nuxt/` artifacts.

## Build, Test, and Development Commands
- `npm install` uses Node 22.20.0 from `.nvmrc` to install dependencies.
- `npm run dev` starts the Vite-powered Nuxt dev server with DevTools enabled.
- `npm run build` generates the production SSR bundle and runs type checks.
- `npm run preview` serves the built bundle locally for smoke testing.
- `npm run generate` emits static assets when SSG output is required.
- `npx vue-tsc --noEmit` runs standalone TypeScript validation for composables or schema work.

## Coding Style & Naming Conventions
- Author Vue components with `<script setup lang="ts">`, 2-space indentation, and single quotes in scripts.
- Name components `PascalCase.vue`, composables `useFeature.ts`, and keep helpers co-located with their feature.
- Favor Tailwind utility classes for styling; add brief comments only around non-obvious logic.

## Testing Guidelines
- Prefer `Vitest` with `@vue/test-utils`; store specs next to sources (e.g., `components/todo/__tests__/TodoItem.spec.ts`).
- Cover each feature with at least one happy-path and one error-path test; mock composables through injected factories.
- Run `npx vue-tsc --noEmit` before opening a PR until additional test runners are configured.

## Commit & Pull Request Guidelines
- Use Conventional Commit prefixes (`feat:`, `fix:`, `docs:`) and keep each commit focused.
- PRs should explain intent, list manual test notes, and include screenshots for UI updates.
- Link tracking issues where possible, request review before merging, and avoid bundling refactors with feature work.

## Environment & Tooling Tips
- Respect `.nvmrc`; refresh caches with `rm -rf .nuxt` if builds misbehave.
- Store secrets in untracked `.env` files that mirror deployment variables.
