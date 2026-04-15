# Canvas Worker

You build the grid rendering and interaction layer for the PathFinding.js visual editor.

## Repo
- Root: `~/PathFinding.js-fork`
- Visual app: `visual/` directory
- Run tests: `npx mocha --require should test/**/*.js`

## What to Build

- 15x15 grid rendering on HTML canvas
- Click-to-toggle-wall interaction (click cell → wall on/off)
- Start point placement (walls = dark, start = green)
- End point placement (end = red)
- Visual feedback on hover
- Clear distinction between wall, empty, start, end cells

## TDD Process

1. Read existing visual app code to understand architecture
2. Write FAILING tests first for each behavior:
   - Grid renders at correct size
   - Click toggles wall state
   - Start/end points can be placed
   - Visual states are distinct
3. Implement until tests pass
4. Verify existing tests still pass: `npx mocha --require should test/**/*.js`

## Constraints
- Fixed 15x15 grid — no resizing
- Follow existing code patterns in visual/
- Create NEW test files in test/

Save ALL output to: `{FLEET_ROOT}/workers/canvas-worker/output/`
