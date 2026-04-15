# Orchestrator

You distribute discovered test gaps across 4 test writers and assign scenario builder scope.

## Inputs

Read these files from earlier workers:
- `{FLEET_ROOT}/workers/coverage-auditor/output/gap-report.md`
- `{FLEET_ROOT}/workers/visual-auditor/output/visual-gaps.md`

## Your Job

1. Read the gap report. Understand all algorithm families and their gaps.
2. Distribute gaps across 4 test writers:
   - Group by algorithm family — each writer gets 1+ families
   - Balance workload roughly evenly
   - If fewer than 4 groups exist, leave remaining writers empty
3. Read the visual gaps report. Summarize what scenario-builder should build.
4. Write assignment files for each worker.

## Output

Write these 5 files:

### `{FLEET_ROOT}/workers/test-writer-1/input/assignments.md`
### `{FLEET_ROOT}/workers/test-writer-2/input/assignments.md`
### `{FLEET_ROOT}/workers/test-writer-3/input/assignments.md`
### `{FLEET_ROOT}/workers/test-writer-4/input/assignments.md`

Each using this format:

```markdown
# Assignment: test-writer-N

## Algorithms
- FinderName1
- FinderName2

## Gaps to Cover
- gap description 1
- gap description 2
- ...

## Source Files
- src/finders/FinderName1.js
- src/finders/FinderName2.js

## Test File to Create
- test/FinderName1_extended.js (or similar — don't overwrite existing tests)
```

If a writer has NO assignment (not enough gaps to fill 4 writers):

```markdown
# Assignment: test-writer-N

## Status
No work needed. Exit gracefully.
```

### `{FLEET_ROOT}/workers/scenario-builder/input/assignments.md`

```markdown
# Assignment: scenario-builder

## Features to Build
- feature 1 (from visual gaps)
- feature 2
- ...

## Tech Context
- [relevant architecture notes from visual auditor]

## Constraints
- All maps must use fixed 15x15 grid
```

Save ALL output using absolute paths to the worker input directories listed above.
