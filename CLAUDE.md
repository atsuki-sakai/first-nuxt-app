# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build locally
- `npm run postinstall` - Prepare Nuxt (runs automatically after install)

### Testing
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

### Docker Environment
- `npm run docker:up` - Start application with Docker Compose (recommended)
- `npm run docker:build` - Build Docker image manually
- `npm run docker:run` - Run Docker container manually
- `npm run docker:down` - Stop Docker containers
- `npm run docker:logs` - View container logs
- `npm run docker:shell` - Access container shell

## Architecture Overview

This is a **Nuxt.js 4 + Vue 3 + TypeScript** Todo application using the Composition API and Tailwind CSS for styling.

### Core Architecture Patterns

**Composables-First State Management**: No external state management library (Pinia, Vuex) is used. Instead, the application uses Vue 3's Composition API with composables pattern:
- `useTodos()` - Central state management for all Todo operations
- `useTodoForm()` - Form state and validation logic
- `useUiHelpers()` - UI state helpers (modals, toasts, etc.)

**File-Based Routing**: Pages automatically become routes:
- `/` → `pages/index.vue`
- `/todos` → `pages/todos/index.vue`
- `/todos/create` → `pages/todos/create.vue`
- `/todos/[id]` → `pages/todos/[id]/index.vue`
- `/todos/[id]/edit` → `pages/todos/[id]/edit.vue`

**Auto-Import System**: Nuxt 4 automatically imports:
- Vue 3 functions (`ref`, `computed`, `watch`, etc.)
- Custom composables from `composables/`
- Types from `types/`
- Components from `components/`

### Data Flow Architecture

```
User Interaction → Component → Composable → Reactive State → Computed Properties → UI Update
                                    ↓
                              LocalStorage Persistence
```

1. **Components** handle UI interactions and emit events
2. **Composables** contain business logic and state management
3. **Reactive State** (`ref`/`reactive`) automatically tracks dependencies
4. **Computed Properties** derive state and auto-update when dependencies change
5. **LocalStorage** persistence via `watch()` for data persistence

### Key Technical Decisions

**Docker Environment**:
- Node.js 20 required for Nuxt 4.1.2 compatibility
- Multi-stage build for production optimization
- Includes native binding support for oxc-parser

**TypeScript Integration**:
- Strict mode enabled in `nuxt.config.ts`
- Auto-imports work with TypeScript definitions
- Custom types in `types/todo.ts` are globally available

**Testing Setup**:
- Vitest for unit tests with `@nuxt/test-utils`
- `@vue/test-utils` for component testing
- `happy-dom` for fast DOM simulation

### Critical Implementation Notes

**Composable Pattern**: The `useTodos()` composable is the single source of truth for all Todo state. It uses Vue's reactivity system for automatic dependency tracking, eliminating the need for manual dependency arrays (unlike React's `useEffect`).

**Auto-Import Dependencies**: When adding new composables or types, ensure they're exported properly - Nuxt will auto-detect and import them across the application without explicit import statements.

**Docker Compatibility**: The application requires Node.js 20+ due to Nuxt 4 engine requirements. Docker setup includes build tools (python3, make, g++) for native dependencies compilation.