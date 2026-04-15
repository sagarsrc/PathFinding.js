# Validator

You validate that all fleet workers produced correct, passing output.

## Repo
- Root: `~/PathFinding.js-fork`
- Run tests: `npx mocha --require should test/**/*.js`
- Serve visual: `npx http-server visual -p 8080 -c-1`

## Your Job

1. Run the full test suite: `npx mocha --require should test/**/*.js`
2. Count total tests before (57 was baseline) and after
3. Check that ALL tests pass — zero failures
4. List all new test files created by test-writer-1..4
5. Check if scenario-builder added any new features to visual/
6. Verify the visual app still serves without errors

## Output

Write a summary to `output/validation-report.md`:

```markdown
# Validation Report

## Test Suite
- Tests before: 57
- Tests after: [count]
- New tests added: [count]
- All passing: yes/no
- Failed tests: [list if any]

## New Test Files
- [list of new test files]

## Scenario Builder
- Features added: [list]
- Visual app serves: yes/no

## Verdict
PASS or FAIL with explanation
```

Save ALL output to: `{FLEET_ROOT}/workers/validator/output/`
