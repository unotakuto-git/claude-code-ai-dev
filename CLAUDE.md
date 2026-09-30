# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

A dependency-free TODO app (vanilla HTML/CSS/JS, no build system or tests). Open `index.html` in a browser to run it.

- `index.html` – markup; `style.css` – styling (light/dark); `app.js` – state, rendering, and persistence.
- Todos are stored in `localStorage` under the key `todos-v1` as `{id, text, done}`.
- `app.js` re-renders the whole list from the `todos` array after each change via `update()`.

- GitHub remote (public): https://github.com/unotakuto-git/claude-code-ai-dev (branch `main`, tracked by the local `main`).
- Deployed with GitHub Pages from the `main` branch root: https://unotakuto-git.github.io/claude-code-ai-dev/ (pushing to `main` redeploys).

- Vercel (team `uno-4856`, CLI logged in): the static app is project `claude-code-ai-dev` → https://claude-code-ai-dev.vercel.app/. Both Vercel projects are connected to the GitHub repo (production branch `main`), so pushing to `main` redeploys them.

## Next.js version (`nextjs-todo/`)

A separate Next.js 16 (App Router, TypeScript) port of the same app; the static app in the repo root is untouched.

- Run: `cd nextjs-todo && npm run dev`; check with `npm run lint` and `npm run build`.
- `app/TodoApp.tsx` is the single client component; it reads/writes the same `todos-v1` localStorage key through a small `useSyncExternalStore` store. `app/globals.css` is a copy of the root `style.css`.
- `nextjs-todo/AGENTS.md` says this Next.js version differs from older ones; read `nextjs-todo/node_modules/next/dist/docs/` before changing framework-level code.
- Vercel project `nextjs-todo` (Root Directory `nextjs-todo`) → https://nextjs-todo-olive.vercel.app/. Manual deploy: `cd nextjs-todo && vercel --prod`.
- Git Bash rewrites `/v9/...` paths; set `MSYS_NO_PATHCONV=1` when calling `vercel api`.

## Secrets

API keys are kept outside this directory. Never place key files or credentials in the repository.
