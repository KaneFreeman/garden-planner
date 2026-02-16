# Copilot instructions (garden-planner UI)

## Project overview

- React 18 + TypeScript UI built with Vite.
- UI is a PWA with service worker registration and update handling.
- State uses Redux Toolkit; routing uses React Router.
- UI talks to the API via `VITE_API_URL`.

## Tech stack

- React 18, TypeScript (strict), Vite
- MUI (material, lab, x-date-pickers)
- Redux Toolkit + React Redux
- React Router 6
- PWA: `vite-plugin-pwa` + Workbox

## Source layout

- `src/index.tsx`: app bootstrap, service worker update events
- `src/App.tsx`: providers (theme, store, router, localization), update snackbar
- `src/Main.tsx`: login gate + main views
- Feature folders live under `src/` (auth, gardens, plants, tasks, containers, etc.)
- Reusable UI in `src/components/`
- API wrappers/hooks in `src/api/`
- Store slices in `src/store/`

## Runtime config

- Environment variables are prefixed with `VITE_`.
- See `.env.example` for required values:
  - `VITE_PUBLIC_URL`
  - `VITE_API_URL`

## Scripts (preferred)

- `yarn start` (dev)
- `yarn build` (tsc + vite build)
- `yarn lint`
- `yarn format`

## Formatting and linting

- Prettier: single quotes, trailing commas disabled, print width 120.
- ESLint is enabled with TypeScript and import rules.
- Prefer fixes that keep lint clean; do not add unused vars (use `_` for ignored args).

## Coding conventions

- Use functional React components with hooks.
- Keep logic in hooks or store slices; components should remain presentational where possible.
- Prefer existing utilities in `src/utility/` and hooks in `src/hooks/`.
- Follow existing patterns for API calls in `src/api/` and selectors in `src/store/slices/`.
- Keep MUI theme usage centralized (theme is created in `App.tsx`).

## PWA notes

- Service worker update flow dispatches `pwaupdateavailable` and `pwaupdateconfirm` events.
- If changing the update flow, ensure the update snackbar and reload behavior still work.

## What not to touch

- Avoid editing build artifacts or generated files (none tracked in repo).
- Do not add new env var prefixes (stick to `VITE_`).
