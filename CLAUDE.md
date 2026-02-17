# Basket - Basketball Team Generator

## Overview
Web app that creates balanced basketball teams from a pool of players based on skill ratings. Players are loaded from a Google Sheets spreadsheet via the OpenSheet API.

## Tech Stack
- Plain JavaScript (ES6 modules), HTML5, CSS3
- No build step, no framework
- `http-server` for local development

## Project Structure
- `index.html` — Entry point
- `index.js` — UI logic, data fetching, DOM manipulation
- `index.css` — Responsive styles (mobile-first, breakpoint at 768px)
- `createTeams.js` — Core team-balancing algorithm (pure function)
- `createTeams.test.js` — Tests for the algorithm
- `players.json` — Fallback/static player data

## Commands
- `npm start` — Run local server on port 8080
- `npm test` — Run tests (`node createTeams.test.js`)

## Key Patterns
- No build/transpile step; files are served directly
- `createTeams()` is a pure function: takes players array, team count, and optional pre-assignments; returns balanced teams
- Player data is fetched from Google Sheets at runtime; `players.json` exists as static data
- Tests use a simple custom runner with `console.table()` output (no test framework)
- UI is built with direct DOM manipulation (no virtual DOM or templating)

## Worktree Workflow (New Features)
When starting a new feature, always use a git worktree so multiple features can be developed in parallel:

1. Create the worktree under the mounted volume:
   ```
   git worktree add /workspaces/basket/.worktrees/<feature-name> -b <feature-name>
   ```
2. Work inside that worktree directory for all file edits and git operations.
3. `.worktrees/` is in `.gitignore` — never commit worktree contents to the main repo.
4. Git commands (commit, push, branch) must run **inside the container** — host paths don't resolve correctly for worktree git metadata.
5. When done with a feature (merged or abandoned), clean up:
   ```
   git worktree remove /workspaces/basket/.worktrees/<feature-name>
   ```

## Deployment
Hosted on GitHub Pages at https://kadza.github.io/basket/
