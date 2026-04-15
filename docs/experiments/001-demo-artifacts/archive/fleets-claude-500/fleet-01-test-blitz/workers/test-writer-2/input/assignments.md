# Test Writer 2 Assignment

## Master Gap Inventory (from coverage + visual audits)
- Finder algorithm edge cases missing: `start===end`, no-path, blocked start/end, diagonal mode matrices, deprecated diagonal flags parity.
- Finder options missing: custom `heuristic`, non-default `weight`, IDA* `timeLimit`/recursion, JPS recursion tracking.
- Untested modules: JPS variants/base/factory branches, `src/core/Heuristic.js`, `src/core/Node.js`, `src/core/DiagonalMovement.js`, several `Util` functions, export contract in `src/PathFinding.js`.
- Grid/core edge cases missing: `Grid.clone`, invalid dimensions, malformed matrix mismatch throw, invalid diagonal mode throw, grid reuse contamination.

## Your Scope
Cover bidirectional finder family plus shared regression scenarios.

### Gaps to cover (specific files/functions/edge cases)
1. `src/finders/BiAStarFinder.js`
- Add no-path, `start===end`, blocked endpoints.
- Add meeting-point correctness edge tests.
- Add custom `heuristic` and `weight` tests.
- Add full diagonal mode coverage.

2. `src/finders/BiBestFirstFinder.js`
- Add tests for heuristic inflation behavior and path-quality tradeoff.
- Add diagonal mode variant coverage.

3. `src/finders/BiBreadthFirstFinder.js`
- Add no-path, `start===end`, blocked endpoint scenarios.
- Add diagonal option matrix tests.

4. `src/finders/BiDijkstraFinder.js`
- Add no-path and blocked endpoint scenarios.
- Add diagonal option matrix tests.

5. Shared robustness regressions (across at least one bi-directional and one non-bi finder)
- Reused-grid contamination check (multiple searches on same grid instance should not leak state).
- Single-cell `1x1` start=end scenario.

6. `src/PathFinding.js`
- Add explicit export-contract tests for expected constructors/functions.

## Where to put new tests
- `test/finders/bidirectional.spec.js`
- `test/regressions/shared-state-and-exports.spec.js`

## TDD Rule (required)
Write failing tests first, then implement. Verify existing tests still pass.

## Verify command
`npx mocha --require should test/**/*.js`
