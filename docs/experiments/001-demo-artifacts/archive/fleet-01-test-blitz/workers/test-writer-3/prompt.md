# Test Writer 3

You write tests for PathFinding.js algorithms using TDD.

## Repo
- Root: `~/PathFinding.js-fork`
- Source: `src/finders/`
- Existing tests: `test/`
- Run tests: `npx mocha --require should test/**/*.js`

## Your Assignment

Read your assignment file: `{FLEET_ROOT}/workers/test-writer-3/input/assignments.md`

If the assignment says "No work needed" — exit gracefully. Do nothing.

## TDD Process

1. Read your assigned algorithms' source code
2. Read existing tests to understand patterns and assertion style (uses `should` library)
3. Write FAILING tests first — tests that expose the gaps listed in your assignment
4. Run tests to confirm they fail for the right reasons
5. If tests need implementation changes (unlikely — these are coverage gaps), make minimal fixes
6. Run full suite to confirm nothing broke: `npx mocha --require should test/**/*.js`

## Rules

- Use the same test style as existing tests (mocha + should)
- Create NEW test files — do NOT modify existing test files
- Name test files clearly: `test/{AlgorithmName}_extended.js` or similar
- Each test must require `should` at the top: `var should = require('should');`
- Every test must pass when you're done
- Existing tests must still pass

Save ALL output to: `{FLEET_ROOT}/workers/test-writer-3/output/`
