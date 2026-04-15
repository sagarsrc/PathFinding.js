# PathFinding.js Coverage Gap Report

## Baseline
- Repo: `/home/sagar/PathFinding.js-fork`
- Test command: `npx mocha --require should test/**/*.js`
- Result: `57 passing (31ms)` on 2026-04-15 (UTC)

## Source Inventory and Coverage

### Finders (`src/finders/`)

| Source file | Dedicated tests? | Covered scenarios | Missing scenarios |
|---|---|---|---|
| `src/finders/AStarFinder.js` | Yes | 4 shared maze scenarios; shortest-path assertions in default config | No-path case; `start=end`; blocked start/end; custom `heuristic`; non-default `weight`; all diagonal modes (`Always`, `OnlyWhenNoObstacles`); deprecated flags mapping (`allowDiagonal`, `dontCrossCorners`) |
| `src/finders/BestFirstFinder.js` | Yes | 4 shared maze scenarios; start/end path validity for non-optimal solver | Behavior differences from A* with weighted heuristic; diagonal mode matrix; custom heuristic |
| `src/finders/BreadthFirstFinder.js` | Yes | 4 shared maze scenarios; shortest-path assertions default config | No-path; `start=end`; blocked endpoints; diagonal mode variants and deprecated flags |
| `src/finders/DijkstraFinder.js` | Yes | 4 shared maze scenarios; shortest-path assertions | No-path; blocked endpoints; diagonal variants; confirms heuristic is zeroed under options |
| `src/finders/BiAStarFinder.js` | Yes | 4 shared maze scenarios; valid endpoint-only assertions | Meeting-point correctness under corner cases; no-path; `start=end`; custom heuristic/weight; full diagonal mode coverage |
| `src/finders/BiBestFirstFinder.js` | Yes | 4 shared maze scenarios; valid endpoint-only assertions | Heuristic inflation behavior and path quality tradeoff not validated; diagonal variants |
| `src/finders/BiBreadthFirstFinder.js` | Yes | 4 shared maze scenarios; shortest-path assertions | No-path; `start=end`; blocked endpoints; diagonal option matrix |
| `src/finders/BiDijkstraFinder.js` | Yes | 4 shared maze scenarios; shortest-path assertions | No-path; blocked endpoints; diagonal option matrix |
| `src/finders/IDAStarFinder.js` | Yes | 4 shared maze scenarios; endpoint validity for non-optimal run | `timeLimit` cutoff; `trackRecursion`; custom heuristic/weight; no-path; `start=end`; diagonal modes |
| `src/finders/JumpPointFinder.js` | Partial (indirect via two mode tests) | Factory dispatch exercised for `IfAtMostOneObstacle` and `Never` | Factory branches for `Always` and `OnlyWhenNoObstacles` untested |
| `src/finders/JumpPointFinderBase.js` | No | Indirectly used by JPS subclasses | Base successor identification behavior not isolated; `trackJumpRecursion` not tested |
| `src/finders/JPFAlwaysMoveDiagonally.js` | No | None directly | Entire algorithm pathfinding and jump/neighbor logic untested |
| `src/finders/JPFMoveDiagonallyIfAtMostOneObstacle.js` | Yes (via `JumpPointFinder`) | 4 shared maze scenarios for this mode | No-path; `start=end`; blocked endpoints; forced-neighbor corner cases; recursion tracking |
| `src/finders/JPFMoveDiagonallyIfNoObstacles.js` | No | None directly | Entire algorithm pathfinding and jump/neighbor pruning untested |
| `src/finders/JPFNeverMoveDiagonally.js` | Yes (via `JumpPointFinder`) | 4 shared maze scenarios for this mode | No-path; `start=end`; blocked endpoints; forced-neighbor edge cases; recursion tracking |

### Core (`src/core/`)

| Source file | Dedicated tests? | Covered scenarios | Missing scenarios |
|---|---|---|---|
| `src/core/Grid.js` | Yes | Constructor (with/without matrix); matrix-driven walkability; `isInside`; `setWalkableAt`; `getNeighbors` for `Never` + one `IfAtMostOneObstacle` case | `clone`; `getNodeAt`; `isWalkableAt` out-of-bounds; matrix-size mismatch throw; `getNeighbors` for `Always` and `OnlyWhenNoObstacles`; invalid `diagonalMovement` throw; tiny grids (`1x1`, empty/invalid sizes) |
| `src/core/Util.js` | Yes (partial) | `interpolate`; `expandPath`; `compressPath` basic behavior | `backtrace`; `biBacktrace`; `pathLength`; `smoothenPath`; reverse/diagonal/degenerate interpolation edge cases |
| `src/core/Heuristic.js` | No | None | `manhattan`, `euclidean`, `octile`, `chebyshev` correctness |
| `src/core/DiagonalMovement.js` | No | None | enum integrity and compatibility expectations |
| `src/core/Node.js` | No | None | constructor defaults, explicit `walkable=false`, field initialization |

### Root `src/`

| Source file | Dedicated tests? | Covered scenarios | Missing scenarios |
|---|---|---|---|
| `src/PathFinding.js` | No | Indirectly exercised by requiring root export in tests | Explicit export contract checks (all expected constructors/functions present) |
| `src/banner` | No | None | No tests (build/banner artifact, low runtime risk) |

## Priority Gaps

### P0: Untested algorithms / branches (highest)
1. `src/finders/JPFAlwaysMoveDiagonally.js` has no dedicated coverage.
2. `src/finders/JPFMoveDiagonallyIfNoObstacles.js` has no dedicated coverage.
3. `src/finders/JumpPointFinder.js` factory branches for `Always` and `OnlyWhenNoObstacles` are untested.
4. `src/finders/JumpPointFinderBase.js` behavior is not isolated (only indirect).
5. `src/core/Heuristic.js`, `src/core/Node.js`, `src/core/DiagonalMovement.js` are fully untested.
6. `src/core/Util.js` has major untested functions (`backtrace`, `biBacktrace`, `pathLength`, `smoothenPath`).

### P1: Untested edge cases (medium)
1. No explicit tests for no-path-exists behavior across finders.
2. No explicit tests for `start === end`.
3. No explicit tests for blocked start or blocked end.
4. No explicit tests for single-cell (`1x1`) grids.
5. No explicit tests for invalid/degenerate grid dimensions or malformed matrices.
6. No explicit tests for all diagonal movement modes across all finders.
7. No tests for grid reuse contamination (running multiple searches on same grid instance).
8. No tests for `Grid.clone()` fidelity.

### P2: Untested options/parameters (lower)
1. `heuristic` overrides in A*/BiA*/IDA* family.
2. `weight` parameter effects in A*/BiA*/IDA*.
3. Deprecated options (`allowDiagonal`, `dontCrossCorners`) compatibility mapping.
4. `IDAStarFinder` options: `timeLimit`, `trackRecursion`.
5. JPS recursion-tracking options (`trackJumpRecursion`).

## Global Edge-Case Gaps (counted)
1. `start=end`
2. no path exists
3. blocked start
4. blocked end
5. single-cell grid
6. empty/invalid grid dimensions
7. malformed matrix shape mismatch throw
8. all diagonal modes across all finders
9. invalid diagonal mode throw path
10. large-grid stress/performance assertions
11. weighted heuristic behavior validation
12. custom heuristic validation
13. deprecated diagonal flags behavior parity
14. IDA* time-limit cutoff behavior
15. IDA* recursion tracking behavior
16. JPS recursion tracking behavior
17. grid clone independence
18. repeated-search state contamination on reused grid

## Summary Stats
- Total source files: **22**
- Files with dedicated tests: **13**
- Files without dedicated tests: **9**
- Identified edge-case gaps: **18**

