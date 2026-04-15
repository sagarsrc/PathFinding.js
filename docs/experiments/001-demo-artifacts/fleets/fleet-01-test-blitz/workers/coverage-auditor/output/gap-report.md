# Coverage Gap Report — PathFinding.js

**Date:** 2026-04-15  
**Test suite:** `npx mocha --require should test/**/*.js`  
**Result:** 57 passing, 0 failing

---

## Summary

The test suite validates that finders return a valid path on 4 maze scenarios. This covers the happy path for most finders but leaves large swaths of branch logic, edge cases, utility functions, and two entire finder implementations completely untested.

---

## `src/core/Node.js`

**What IS tested:** Node objects created implicitly by Grid; `x`, `y`, `walkable` properties read indirectly.

**What is NOT tested:**
- `Node(x, y, false)` — explicit non-walkable constructor argument
- `Node(x, y)` with `walkable === undefined` → defaults to `true` (branch never directly asserted)
- No direct unit tests for Node at all

**Priority:** Low — simple data class, but a dedicated test would catch regressions if the constructor changes.

---

## `src/core/Grid.js`

**What IS tested:**
- `new Grid(width, height)` — size, all nodes walkable
- `new Grid(width, height, matrix)` — size, walkability from matrix, `setWalkableAt`, `isInside`, `getNeighbors` with `DiagonalMovement.Never` and `DiagonalMovement.IfAtMostOneObstacle`
- `new Grid(matrix)` — matrix-only constructor

**What is NOT tested:**

| Gap | Function/Branch | Priority |
|-----|----------------|----------|
| `clone()` never called | `Grid.prototype.clone` | **HIGH** — used internally by finders to avoid mutating caller's grid; broken clone = silently corrupt results |
| `getNodeAt(x, y)` not directly asserted | `Grid.prototype.getNodeAt` | Medium |
| Matrix size mismatch throws | `_buildNodes`: `throw new Error('Matrix size does not fit')` | **HIGH** — only error-throwing branch in Grid; never exercised |
| `getNeighbors` with `DiagonalMovement.Always` | `d0=d1=d2=d3=true` branch | **HIGH** — JPFAlwaysMoveDiagonally relies on this; whole branch uncovered |
| `getNeighbors` with `DiagonalMovement.OnlyWhenNoObstacles` | `d0 = s3 && s0` branch | **HIGH** — JPFMoveDiagonallyIfNoObstacles relies on this |
| `getNeighbors` with invalid diagonal value | `throw new Error('Incorrect value of diagonalMovement')` | Medium |
| `setWalkableAt` out-of-bounds (no guard) | Would throw `TypeError: Cannot set properties of undefined` | Medium |
| 1×1 grid | All four cardinal neighbors OOB | Medium |
| All-blocked grid (no walkable neighbors) | `getNeighbors` returns `[]` | Medium |

---

## `src/core/Heuristic.js`

**What IS tested:** Nothing. No test file covers this module.

**What is NOT tested:**

| Gap | Function | Priority |
|-----|----------|----------|
| `manhattan(dx, dy)` return value | `manhattan` | **HIGH** — used as default heuristic; wrong value = wrong paths |
| `euclidean(dx, dy)` return value | `euclidean` | **HIGH** |
| `octile(dx, dy)` — both branches (`dx < dy` and `dx >= dy`) | `octile` | **HIGH** — default for diagonal finders |
| `chebyshev(dx, dy)` return value | `chebyshev` | Medium |
| Inputs: `dx=0, dy=0` (same node) | all functions | Medium |
| Inputs: negative values (callers pass `Math.abs(...)` but Heuristic itself has no guard) | all functions | Low |

---

## `src/core/Util.js`

**What IS tested:**
- `interpolate(0,1,0,4)` — one vertical line
- `expandPath([])` — empty
- `expandPath([[0,1],[0,4]])` and `expandPath([[0,1],[0,4],[2,6]])` — two cases
- `compressPath([])` and single-direction paths

**What is NOT tested:**

| Gap | Function/Branch | Priority |
|-----|----------------|----------|
| `backtrace` never directly tested | `backtrace` | **HIGH** — all finders call it; tested only transitively through maze scenarios |
| `biBacktrace` never directly tested | `biBacktrace` | **HIGH** — bidirectional finders rely on it; `pathA.concat(pathB.reverse())` has subtle ordering |
| `pathLength` zero tests | `pathLength` | **HIGH** — no test file imports or calls this |
| `smoothenPath` zero tests | `smoothenPath` | **HIGH** — complex Bresenham-based path smoother; uses undeclared `lastValidCoord` (latent bug) |
| `interpolate` horizontal line (dy=0) | `sx≠0, sy=0` branch | Medium |
| `interpolate` diagonal line | mixed `err` advancement | Medium |
| `interpolate` same point (`x0==x1, y0==y1`) | early break | Medium |
| `interpolate` negative direction (`sx=-1` or `sy=-1`) | `sx/sy < 0` branches | Medium |
| `compressPath` path of length 1 | `path.length < 3` early return with 1 element | Medium |
| `compressPath` path of length 2 | `path.length < 3` early return with 2 elements | Medium |
| `expandPath` single-point path | `len < 2` early return | Low |
| **Bug: `smoothenPath` uses `lastValidCoord` without `var`** | line 167 — implicit global in strict mode | **HIGH** — would throw `ReferenceError` in strict mode |

---

## `src/finders/AStarFinder.js`

**What IS tested:** `new AStarFinder()` (defaults) on 4 maze scenarios, optimal path length verified.

**What is NOT tested:**

| Gap | Option/Branch | Priority |
|-----|--------------|----------|
| `weight > 1` (suboptimal weighted A*) | `this.weight` applied to heuristic | **HIGH** — core feature, untested |
| Custom heuristic (`opt.heuristic`) | `this.heuristic = opt.heuristic` branch | **HIGH** |
| Deprecated `allowDiagonal: true` API | `this.allowDiagonal` fallback logic | Medium |
| Deprecated `dontCrossCorners: true` → `OnlyWhenNoObstacles` | nested deprecated branch | Medium |
| `diagonalMovement: DiagonalMovement.Always` | `octile` heuristic auto-selection | Medium |
| `diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles` | `octile` heuristic auto-selection | Medium |
| No-path scenario (completely blocked) | `return []` at end of `findPath` | **HIGH** — every finder has this branch; never exercised |
| Start == End | `node === endNode` on first pop | Medium |

---

## `src/finders/DijkstraFinder.js`

**What IS tested:** Default instantiation on 4 maze scenarios, optimal path length verified.

**What is NOT tested:** Same gaps as AStarFinder (diagonal options, no-path, start==end). Additionally, the zero-heuristic override is never explicitly validated.

**Priority:** Medium

---

## `src/finders/BreadthFirstFinder.js`

**What IS tested:** Default (non-diagonal) instantiation on 4 maze scenarios.

**What is NOT tested:**
- `allowDiagonal: true` deprecated API
- `dontCrossCorners` deprecated API
- All `DiagonalMovement` explicit options
- No-path scenario
- Start == End

**Priority:** Medium

---

## `src/finders/BestFirstFinder.js`

**What IS tested:** Default instantiation on 4 maze scenarios (non-optimal check only).

**What is NOT tested:**
- Custom heuristic (`orig` function override multiplied by 1000000)
- Diagonal movement options
- No-path scenario

**Priority:** Medium

---

## `src/finders/BiAStarFinder.js`

**What IS tested:** Default instantiation on 4 maze scenarios (non-optimal, start/end position only).

**What is NOT tested:**
- Meeting-in-middle logic: both `return Util.biBacktrace(node, neighbor)` lines never isolated
- No-path scenario: `return []` never hit
- Start == End
- `weight` option
- Custom heuristic
- Diagonal movement options

**Priority:** **HIGH** — bidirectional meeting logic is complex; non-optimal check only confirms path exists, not correctness.

---

## `src/finders/BiDijkstraFinder.js`

**What IS tested:** On 4 maze scenarios with optimal path length verified (marked `optimal: true` in test suite).

**What is NOT tested:** Same gaps as BiAStarFinder. No-path scenario never hit.

**Priority:** **HIGH** — same biBacktrace concern.

---

## `src/finders/BiBreadthFirstFinder.js`

**What IS tested:** 4 maze scenarios, optimal path length verified.

**What is NOT tested:** No-path, start==end, diagonal options.

**Priority:** Medium

---

## `src/finders/IDAStarFinder.js`

**What IS tested:** Default instantiation on 4 maze scenarios (non-optimal check only).

**What is NOT tested:**

| Gap | Option/Branch | Priority |
|-----|--------------|----------|
| `timeLimit` option | `new Date().getTime() - startTime > this.timeLimit * 1000` branch | **HIGH** — timeout returns `[]`; branch never exercised |
| `trackRecursion: true` | `neighbour.retainCount`, `neighbour.tested` tracking branches | Medium |
| No-path scenario | `t === Infinity` → `return []` | **HIGH** |
| `diagonalMovement` options (non-default) | deprecated/explicit diagonal branches | Medium |
| Deep recursion / stack overflow risk on large open grids | no stress test | Low |

---

## `src/finders/JumpPointFinder.js` (factory)

**What IS tested:**
- `DiagonalMovement.IfAtMostOneObstacle` → `JPFMoveDiagonallyIfAtMostOneObstacle`
- `DiagonalMovement.Never` → `JPFNeverMoveDiagonally`

**What is NOT tested:**
- `DiagonalMovement.Always` → `JPFAlwaysMoveDiagonally` (**never instantiated in any test**)
- `DiagonalMovement.OnlyWhenNoObstacles` → `JPFMoveDiagonallyIfNoObstacles` (**never instantiated in any test**)
- Default (no `diagonalMovement` opt) → falls through to `JPFMoveDiagonallyIfAtMostOneObstacle`

**Priority:** **HIGH**

---

## `src/finders/JPFAlwaysMoveDiagonally.js`

**What IS tested:** Nothing. Zero coverage.

**What is NOT tested:**
- `_jump`: all branches — diagonal forced-neighbor detection, horizontal sub-jump, vertical sub-jump, `trackJumpRecursion` branch
- `_findNeighbors`: parent-directed pruning (diagonal), parent-directed pruning (horizontal/vertical), no-parent fallback
- Any maze scenario end-to-end

**Priority:** **HIGH** — entire file is dead from test perspective

---

## `src/finders/JPFMoveDiagonallyIfNoObstacles.js`

**What IS tested:** Nothing. Zero coverage.

**What is NOT tested:**
- `_jump`: diagonal branch (forced-neighbor check is commented out — potential design gap), horizontal sub-jump check, vertical path with commented-out horizontal jump check
- `_findNeighbors`: all branches
- Any maze scenario end-to-end
- Note: forced-neighbor diagonal detection is **commented out** (lines 44–47) — different behavior from `JPFAlwaysMoveDiagonally` and `JPFMoveDiagonallyIfAtMostOneObstacle`

**Priority:** **HIGH** — entire file is dead; also has commented-out logic that may indicate unfinished implementation

---

## `src/finders/JPFMoveDiagonallyIfAtMostOneObstacle.js`

**What IS tested:** 4 maze scenarios (non-optimal, start/end positions only).

**What is NOT tested:**
- `trackJumpRecursion: true` option
- `_jump` diagonal forced-neighbor branches (only reachable with specific obstacle layouts not in test scenarios)
- `_jump` line 71–75: diagonal blocked early-return `null` branch
- `_findNeighbors` diagonal pruning with forced neighbors
- No-path scenario

**Priority:** **HIGH** — complex jump logic, obstacle-triggered branches never verified

---

## `src/finders/JPFNeverMoveDiagonally.js`

**What IS tested:** 4 maze scenarios (non-optimal, start/end positions only).

**What is NOT tested:**
- `_jump` line 58: `throw new Error("Only horizontal and vertical movements are allowed")` — `dx===0 && dy===0` branch
- `_jump` forced-neighbor horizontal detection
- `_jump` vertical sub-jump (`this._jump(x+1,y,...) || this._jump(x-1,y,...)`)
- `trackJumpRecursion: true` option
- No-path scenario

**Priority:** **HIGH** — error-throwing branch and vertical sub-jump never covered

---

## `src/finders/JumpPointFinderBase.js`

**What IS tested:** `findPath` runs indirectly through JPFNeverMoveDiagonally and JPFMoveDiagonallyIfAtMostOneObstacle on 4 scenarios.

**What is NOT tested:**
- `findPath` returning `[]` (no path found)
- `_identifySuccessors`: `jumpNode.closed` skip branch (requires specific topology)
- `_identifySuccessors`: `openList.updateItem` branch (jump node already open with higher g)

**Priority:** Medium

---

## Test Scenario Coverage (`test/PathTestScenarios.js`)

**What IS tested:** 4 scenarios — all have walkable start/end, all have valid paths.

**What is NOT tested:**

| Missing Scenario | Impact |
|-----------------|--------|
| No path exists (start and end fully separated by walls) | `return []` branch in every finder untested |
| Start position == End position | trivial path `[[x,y]]` behavior undefined/varies |
| 1×1 grid | boundary condition for all neighbor lookups |
| Start or End on a wall node | undefined behavior |
| Entirely open grid (no obstacles) | already partially covered by scenario 4 |
| Thin corridor (1 cell wide) | stress-tests diagonal vs non-diagonal |

**Priority:** **HIGH** — no-path scenario is missing for all 11 tested finders

---

## Prioritized Fix List

| Priority | Gap |
|----------|-----|
| **HIGH** | Add `JPFAlwaysMoveDiagonally` to PathTest.js |
| **HIGH** | Add `JPFMoveDiagonallyIfNoObstacles` to PathTest.js |
| **HIGH** | Add no-path scenario to PathTestScenarios.js; assert `path.length === 0` for all finders |
| **HIGH** | Unit test `Heuristic.manhattan`, `euclidean`, `octile` (both branches), `chebyshev` |
| **HIGH** | Unit test `Util.pathLength`, `Util.smoothenPath` |
| **HIGH** | Fix and test `smoothenPath` undeclared `lastValidCoord` variable (implicit global) |
| **HIGH** | Unit test `Grid.clone()` — verify walkability preserved, verify independence from original |
| **HIGH** | Test `Grid._buildNodes` matrix-size-mismatch error throw |
| **HIGH** | Test `AStarFinder` with `weight > 1` |
| **HIGH** | Test `IDAStarFinder` with `timeLimit` option |
| **HIGH** | Test `BiAStarFinder` / `BiDijkstraFinder` meeting-in-middle on known topology |
| Medium | Unit test `Util.backtrace`, `Util.biBacktrace` directly |
| Medium | Test `interpolate` horizontal, diagonal, negative-direction, same-point cases |
| Medium | Test `Grid.getNeighbors` with `Always` and `OnlyWhenNoObstacles` modes |
| Medium | Test deprecated `allowDiagonal` / `dontCrossCorners` constructor paths |
| Medium | Test `JPFNeverMoveDiagonally._jump` error throw (dx===0 && dy===0) |
| Medium | Test `IDAStarFinder` with `trackRecursion: true` |
| Low | Direct Node constructor tests |
| Low | Test `DiagonalMovement` enum values are as expected |
