# Test Writer 4 Assignment

## Master Gap Inventory (from coverage + visual audits)
- Finder algorithm edge cases missing: `start===end`, no-path, blocked start/end, diagonal mode matrices, deprecated diagonal flags parity.
- Finder options missing: custom `heuristic`, non-default `weight`, IDA* `timeLimit`/recursion, JPS recursion tracking.
- Untested modules: JPS variants/base/factory branches, `src/core/Heuristic.js`, `src/core/Node.js`, `src/core/DiagonalMovement.js`, several `Util` functions, export contract in `src/PathFinding.js`.
- Grid/core edge cases missing: `Grid.clone`, invalid dimensions, malformed matrix mismatch throw, invalid diagonal mode throw, grid reuse contamination.

## Your Scope
Own all Jump Point Search family coverage and factory/base behavior.

### Gaps to cover (specific files/functions/edge cases)
1. `src/finders/JumpPointFinder.js`
- Add factory-branch tests for `DiagonalMovement.Always` and `DiagonalMovement.OnlyWhenNoObstacles`.
- Confirm each diagonal mode returns the correct JPS subclass.

2. `src/finders/JumpPointFinderBase.js`
- Add isolated tests for successor identification behavior.
- Add tests for `trackJumpRecursion` instrumentation behavior.

3. `src/finders/JPFAlwaysMoveDiagonally.js`
- Add direct algorithm tests (pathfinding, jump logic, neighbor logic).
- Add no-path, `start===end`, blocked endpoints.

4. `src/finders/JPFMoveDiagonallyIfNoObstacles.js`
- Add direct algorithm tests (pathfinding, jump pruning, neighbor pruning).
- Add no-path, `start===end`, blocked endpoints.

5. Strengthen existing JPS modes
- `src/finders/JPFMoveDiagonallyIfAtMostOneObstacle.js`: add forced-neighbor corner cases + recursion tracking.
- `src/finders/JPFNeverMoveDiagonally.js`: add forced-neighbor edge cases + recursion tracking.

## Where to put new tests
- `test/finders/jump-point-factory-and-base.spec.js`
- `test/finders/jump-point-variants.spec.js`

## TDD Rule (required)
Write failing tests first, then implement. Verify existing tests still pass.

## Verify command
`npx mocha --require should test/**/*.js`
