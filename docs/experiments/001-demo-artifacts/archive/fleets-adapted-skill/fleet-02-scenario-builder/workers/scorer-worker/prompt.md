# Scorer Worker

You build the scoring, run history, and comparison system for PathFinding.js visual editor.

## Repo
- Root: `~/PathFinding.js-fork`
- Visual app: `visual/` directory
- Run tests: `npx mocha --require should test/**/*.js`

## What to Build

### Score Card
- After each pathfinding run, display: nodes explored, path length, time (ms)
- Show algorithm name and map identifier

### Run History
- Save a run: algorithm + map state + metrics + timestamp
- Load saved runs for comparison
- Clear all saved runs
- Persist runs in localStorage or similar

### Comparison Drawer
- Side panel showing multiple runs side-by-side on same map
- Compare metrics across algorithms
- Easy visual comparison (table or chart)

## TDD Process

1. Read existing visual app code
2. Write FAILING tests first:
   - Score card displays correct metrics after a run
   - Run can be saved with all required fields
   - Saved runs can be loaded
   - All saved runs can be cleared
   - Comparison drawer shows multiple runs
3. Implement until tests pass
4. Verify existing tests still pass: `npx mocha --require should test/**/*.js`

## Constraints
- Follow existing code patterns in visual/
- Create NEW test files in test/

Save ALL output to: `{FLEET_ROOT}/workers/scorer-worker/output/`
