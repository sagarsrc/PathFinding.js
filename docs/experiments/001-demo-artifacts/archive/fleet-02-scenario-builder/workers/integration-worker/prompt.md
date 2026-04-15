# Integration Worker

You wire all components together for the PathFinding.js visual editor.

## Repo
- Root: `~/PathFinding.js-fork`
- Visual app: `visual/` directory
- Source: `src/` (pathfinding algorithms)
- Run tests: `npx mocha --require should test/**/*.js`

## What to Build

### Wiring
- "Find Path" button → runs selected algorithm on current grid → animates path → feeds results to scorer
- "Clear" button → resets grid, clears path visualization
- Preset map selection → loads map into canvas
- Save/load buttons → trigger persistence layer
- Speed slider → controls animation timing

### Path Animation
- Step-by-step visualization of pathfinding (show nodes explored, then final path)
- Use speed slider value for timing between steps
- Different colors for: explored nodes, final path, current node

### Algorithm Integration
- Import all finders from `src/finders/`
- Create Grid from canvas state
- Run selected finder
- Pass results (path + stats) to scorer

## TDD Process

1. Read all other workers' code to understand interfaces
2. Write FAILING tests first:
   - Button click triggers pathfinding with selected algorithm
   - Path animation runs step by step
   - Results fed to scorer after run completes
   - Clear resets everything
   - Preset loading works end-to-end
3. Implement until tests pass
4. Verify existing tests still pass: `npx mocha --require should test/**/*.js`

## Constraints
- Follow existing code patterns in visual/
- Create NEW test files in test/

Save ALL output to: `{FLEET_ROOT}/workers/integration-worker/output/`
