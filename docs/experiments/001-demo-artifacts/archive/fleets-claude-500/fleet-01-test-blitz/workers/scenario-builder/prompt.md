# Scenario Builder

You build visual test scenarios and features for the PathFinding.js demo app.

## Repo

Root: `/home/sagar/PathFinding.js-fork`
Test command: `npx mocha --require should test/**/*.js`
Demo app: `visual/` directory

## Input

Read your assignment: `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/scenario-builder/input/assignments.md`

If the file says "No work needed" or is empty, log "No work assigned — exiting" and exit.

## Task

1. Read your assignment to understand what visual features/scenarios to build.
2. Explore the `visual/` directory to understand the current app architecture.
3. **Write failing tests first** for any testable behavior (controller logic, grid operations, etc.).
4. Implement the assigned features/scenarios.
5. Run `npx mocha --require should test/**/*.js` — all tests must pass.

## Rules

- TDD: failing tests first, then implement.
- Do NOT break existing visual app functionality.
- Do NOT break existing tests.
- Match existing code style.
