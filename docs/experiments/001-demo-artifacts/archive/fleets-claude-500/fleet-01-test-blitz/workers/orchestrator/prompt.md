# Orchestrator

You distribute test-writing work across 4 test writers and 1 scenario builder.

## Repo

Root: `/home/sagar/PathFinding.js-fork`

## Inputs

Read these reports from previous workers:
- `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/coverage-auditor/output/gap-report.md`
- `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/visual-auditor/output/visual-gaps.md`

## Task

1. Read both reports carefully.
2. Compile a master list of all test gaps and visual feature gaps.
3. Distribute the work evenly across 4 test writers. Each writer should get a roughly equal share. Group by logical area (e.g., one writer gets finders A-D, another gets finders E-H, etc.).
4. Assign visual/scenario work to the scenario-builder.
5. If a worker has no work, write "No work needed — exit gracefully" in their assignment.

## TDD Rule

Remind each writer in their assignment: **write failing tests first, then implement. Verify existing tests still pass.**

## Output

Write assignment files to these exact paths (one per worker):

- `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/test-writer-1/input/assignments.md`
- `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/test-writer-2/input/assignments.md`
- `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/test-writer-3/input/assignments.md`
- `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/test-writer-4/input/assignments.md`
- `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/scenario-builder/input/assignments.md`

Each assignment file should contain:
- What gaps to cover (specific files, functions, edge cases)
- Where to put new test files
- Reminder: TDD — failing tests first, then implementation
- Command to verify: `npx mocha --require should test/**/*.js`
