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

## Deployment
Hosted on GitHub Pages at https://kadza.github.io/basket/
