# Test Writer 3 Assignment

## Master Gap Inventory (from coverage + visual audits)
- Finder algorithm edge cases missing: `start===end`, no-path, blocked start/end, diagonal mode matrices, deprecated diagonal flags parity.
- Finder options missing: custom `heuristic`, non-default `weight`, IDA* `timeLimit`/recursion, JPS recursion tracking.
- Untested modules: JPS variants/base/factory branches, `src/core/Heuristic.js`, `src/core/Node.js`, `src/core/DiagonalMovement.js`, several `Util` functions, export contract in `src/PathFinding.js`.
- Grid/core edge cases missing: `Grid.clone`, invalid dimensions, malformed matrix mismatch throw, invalid diagonal mode throw, grid reuse contamination.

## Your Scope
Cover IDA* options and core utility/math primitives.

### Gaps to cover (specific files/functions/edge cases)
1. `src/finders/IDAStarFinder.js`
- Add tests for `timeLimit` cutoff behavior.
- Add tests for `trackRecursion` behavior.
- Add custom `heuristic` + `weight` behavior.
- Add no-path, `start===end`, blocked endpoint scenarios.
- Add diagonal mode coverage.

2. `src/core/Util.js`
- Add direct tests for `backtrace`, `biBacktrace`, `pathLength`, `smoothenPath`.
- Add edge-case interpolation tests (reverse, diagonal, degenerate/same-point).

3. `src/core/Heuristic.js`
- Add correctness tests for `manhattan`, `euclidean`, `octile`, `chebyshev`.

4. `src/core/Node.js`
- Add constructor default tests.
- Add explicit `walkable=false` initialization and field initialization assertions.

5. `src/core/DiagonalMovement.js`
- Add enum integrity/compatibility tests for expected constant values/shape.

## Where to put new tests
- `test/finders/idastar.spec.js`
- `test/core/util-advanced.spec.js`
- `test/core/heuristic-node-diagonal.spec.js`

## TDD Rule (required)
Write failing tests first, then implement. Verify existing tests still pass.

## Verify command
`npx mocha --require should test/**/*.js`
