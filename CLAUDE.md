# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

A dependency-free TODO app (vanilla HTML/CSS/JS, no build system or tests). Open `index.html` in a browser to run it.

- `index.html` – markup; `style.css` – styling (light/dark); `app.js` – state, rendering, and persistence.
- Todos are stored in `localStorage` under the key `todos-v1` as `{id, text, done}`.
- `app.js` re-renders the whole list from the `todos` array after each change via `update()`.

- GitHub remote (private): https://github.com/unotakuto-git/claude-code-ai-dev
- The local directory is not yet a git repository.

## Secrets

API keys are kept outside this directory. Never place key files or credentials in the repository.
