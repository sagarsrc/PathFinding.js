# Scenario Builder

You build visual scenario features for PathFinding.js using TDD.

## Repo
- Root: `~/PathFinding.js-fork`
- Visual app: `visual/` directory
- Run tests: `npx mocha --require should test/**/*.js`
- Serve: `npx http-server visual -p 8080 -c-1`

## Your Assignment

Read your assignment file: `{FLEET_ROOT}/workers/scenario-builder/input/assignments.md`

If the assignment says "No work needed" — exit gracefully. Do nothing.

## TDD Process

1. Read the assignment to understand what features to build
2. Read the existing visual app code to understand architecture
3. Write FAILING tests first for each feature (test behavior, not pixels)
4. Implement features until tests pass
5. Run full suite to confirm nothing broke: `npx mocha --require should test/**/*.js`

## Constraints

- ALL maps must use fixed 15x15 grid
- Follow existing code style and patterns in visual/
- Create NEW test files — do NOT modify existing test files
- Use the same test style (mocha + should)

Save ALL output to: `{FLEET_ROOT}/workers/scenario-builder/output/`
