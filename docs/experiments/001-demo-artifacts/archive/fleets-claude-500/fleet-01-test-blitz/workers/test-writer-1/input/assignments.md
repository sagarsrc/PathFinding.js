# Test Writer 1 Assignment

## Master Gap Inventory (from coverage + visual audits)
- Finder algorithm edge cases missing: `start===end`, no-path, blocked start/end, diagonal mode matrices, deprecated diagonal flags parity.
- Finder options missing: custom `heuristic`, non-default `weight`, IDA* `timeLimit`/recursion, JPS recursion tracking.
- Untested modules: JPS variants/base/factory branches, `src/core/Heuristic.js`, `src/core/Node.js`, `src/core/DiagonalMovement.js`, several `Util` functions, export contract in `src/PathFinding.js`.
- Grid/core edge cases missing: `Grid.clone`, invalid dimensions, malformed matrix mismatch throw, invalid diagonal mode throw, grid reuse contamination.

## Your Scope
Cover single-direction classic finders plus core grid behavior.

### Gaps to cover (specific files/functions/edge cases)
1. `src/finders/AStarFinder.js`
- Add explicit tests for: no-path, `start===end`, blocked start/end.
- Add tests for custom `heuristic`, non-default `weight` impact, all diagonal modes (`Always`, `OnlyWhenNoObstacles`, `IfAtMostOneObstacle`, `Never`).
- Add compatibility tests for deprecated flags mapping: `allowDiagonal`, `dontCrossCorners`.

2. `src/finders/BestFirstFinder.js`
- Validate behavior difference from A* when heuristic is weighted/inflated.
- Add custom heuristic test and diagonal mode matrix coverage.

3. `src/finders/BreadthFirstFinder.js`
- Add no-path, `start===end`, blocked endpoints, diagonal mode variants + deprecated flags parity.

4. `src/finders/DijkstraFinder.js`
- Add no-path and blocked endpoint tests.
- Add diagonal mode coverage.
- Add assertion that heuristic option is effectively zeroed/ignored.

5. `src/core/Grid.js`
- Add coverage for `clone`, `getNodeAt`, `isWalkableAt` out-of-bounds behavior.
- Add malformed matrix size mismatch throw.
- Add `getNeighbors` coverage for `Always` and `OnlyWhenNoObstacles`.
- Add invalid `diagonalMovement` throw path.
- Add tiny/degenerate cases: `1x1`, invalid dimensions.

## Where to put new tests
- `test/finders/classic-single-direction.spec.js`
- `test/core/grid.edge-cases.spec.js`

## TDD Rule (required)
Write failing tests first, then implement. Verify existing tests still pass.

## Verify command
`npx mocha --require should test/**/*.js`
