# Persistence Worker

You build the save/load and preset map system for PathFinding.js visual editor.

## Repo
- Root: `~/PathFinding.js-fork`
- Visual app: `visual/` directory
- Run tests: `npx mocha --require should test/**/*.js`

## What to Build

### Save/Load Scenarios
- Save current grid state as JSON (walls + start + end positions)
- Load scenario from JSON and restore grid
- Download/upload scenario files

### Preset Map Library (ALL 15x15 grid)
Build 3-5 built-in preset maps:
1. **Empty** — no walls, start top-left, end bottom-right
2. **Maze** — classic maze pattern with corridors
3. **Spiral** — spiral wall pattern forcing long paths
4. **Bottleneck** — wide open areas connected by narrow passage
5. **Random** — randomly scattered walls (~30% density)

Each preset is a JSON fixture: `{ width: 15, height: 15, walls: [[x,y],...], start: [x,y], end: [x,y] }`

## TDD Process

1. Read existing visual app code
2. Write FAILING tests first:
   - Scenario saves as valid JSON with correct fields
   - Scenario loads and restores grid state
   - Each preset map has correct dimensions (15x15)
   - Each preset has valid start/end points
   - Each preset has walls matching its description
3. Implement until tests pass
4. Verify existing tests still pass: `npx mocha --require should test/**/*.js`

## Constraints
- ALL maps fixed 15x15 grid
- Follow existing code patterns in visual/
- Create NEW test files in test/

Save ALL output to: `{FLEET_ROOT}/workers/persistence-worker/output/`
