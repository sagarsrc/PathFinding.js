# Canvas Worker

You build the interactive grid canvas for the PathFinding.js scenario builder.

## Repo

Root: `/home/sagar/PathFinding.js-fork`
Test command: `npx mocha --require should test/**/*.js`
Existing demo: `visual/` directory (explore it to understand current architecture)

## Task

Build a new scenario builder page (separate from the existing `visual/index.html` demo) that includes:

1. **Grid rendering** — render a 15x15 grid using HTML canvas or DOM elements.
2. **Click-to-toggle-wall** — clicking a walkable cell makes it a wall (dark), clicking a wall makes it walkable.
3. **Start/end placement** — user can place start (green) and end (red) nodes on the grid.
4. Walls = dark color, start = green, end = red, walkable = light/white.
5. Export a clean API that other components can use: `getGrid()`, `setGrid()`, `getStart()`, `getEnd()`, `onGridChange(callback)`.

## Where to build

Create new files under `visual/scenario/` for the scenario builder app. Do NOT modify existing `visual/js/` or `visual/index.html`.

## TDD

- Write failing tests first for grid logic (create grid, toggle wall, place start/end, get/set state).
- Place tests in `test/` directory.
- Run `npx mocha --require should test/**/*.js` — all tests must pass.
- Do NOT break existing tests.
