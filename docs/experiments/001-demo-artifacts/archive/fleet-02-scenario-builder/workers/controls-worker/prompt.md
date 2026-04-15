# Controls Worker

You build the UI controls for the PathFinding.js visual editor.

## Repo
- Root: `~/PathFinding.js-fork`
- Visual app: `visual/` directory
- Run tests: `npx mocha --require should test/**/*.js`

## What to Build

- Algorithm dropdown (A*, Dijkstra, BFS, BestFirst, BiAStar, BiDijkstra, BiBFS, BiBestFirst, IDAStar, JumpPoint)
- "Find Path" button — triggers pathfinding on current grid
- "Clear" button — resets grid to empty state
- Speed slider — controls animation speed of path visualization

## TDD Process

1. Read existing visual app code
2. Write FAILING tests first for each control:
   - Dropdown lists all algorithms
   - Find Path button triggers callback
   - Clear button resets state
   - Speed slider has range and default value
3. Implement until tests pass
4. Verify existing tests still pass: `npx mocha --require should test/**/*.js`

## Constraints
- Follow existing code patterns in visual/
- Create NEW test files in test/

Save ALL output to: `{FLEET_ROOT}/workers/controls-worker/output/`
