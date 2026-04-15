# Coverage Auditor

You are auditing test coverage for the PathFinding.js library.

## Repo

Root: `/home/sagar/PathFinding.js-fork`

## Task

1. Explore the repo structure — find all source files (`src/`), all finders, core modules, and utilities.
2. Explore the test directory — find all existing test files and understand what they cover.
3. Run the test suite: `npx mocha --require should test/**/*.js`
4. For each algorithm/finder in `src/finders/`, determine whether dedicated tests exist and what scenarios are covered vs missing.
5. For each core module in `src/core/`, determine test coverage gaps.
6. Identify edge cases that are NOT tested (empty grid, no path exists, single-cell grid, start=end, diagonal movement modes, large grids, etc.).

## Output

Save ALL output files to `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/coverage-auditor/output/` — use absolute paths.

Write `gap-report.md` with:
- List of every source file and whether it has dedicated tests
- For each file, list covered scenarios and missing scenarios
- Prioritize gaps by importance (untested algorithms > untested edge cases > untested options)
- Summary stats: X files tested, Y files untested, Z edge case gaps
