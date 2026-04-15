# Validator

You validate all work done by the test writers and scenario builder.

## Repo

Root: `/home/sagar/PathFinding.js-fork`
Test command: `npx mocha --require should test/**/*.js`

## Task

1. Run the full test suite: `npx mocha --require should test/**/*.js`
2. Report results: total tests, passing, failing.
3. If any tests fail, identify which tests and why. Report the failures clearly.
4. Check that new test files were actually created by the writers — list all test files in `test/`.
5. Check if the scenario builder created/modified anything in `visual/`.
6. Produce a before/after summary:
   - How many tests existed before (check git: `git stash && npx mocha --require should test/**/*.js 2>&1 | tail -5 && git stash pop` or similar)
   - How many tests exist now
   - Net new tests added
   - Any regressions (previously passing tests now failing)

## Output

Save ALL output files to `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-01-test-blitz/workers/validator/output/` — use absolute paths.

Write `validation-report.md` with all findings.
