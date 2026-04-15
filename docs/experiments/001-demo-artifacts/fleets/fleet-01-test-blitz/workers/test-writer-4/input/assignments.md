# Test Writer 4 — Bidirectional Finders + JPS (all variants)

## Priority 1 (HIGH)

### JPFAlwaysMoveDiagonally — zero coverage
- File: `src/finders/JPFAlwaysMoveDiagonally.js`
- Add to test suite via `JumpPointFinder({ diagonalMovement: DiagonalMovement.Always })`
- Test on all 4 existing maze scenarios — verify path found (start/end positions correct)
- Test `_findNeighbors` pruning: parent-directed diagonal, horizontal, vertical, no-parent fallback

### JPFMoveDiagonallyIfNoObstacles — zero coverage
- File: `src/finders/JPFMoveDiagonallyIfNoObstacles.js`
- Add to test suite via `JumpPointFinder({ diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles })`
- Test on all 4 existing maze scenarios
- Note: forced-neighbor diagonal detection is commented out (lines 44–47) — document behavior

### BiAStarFinder — meeting-in-middle isolation
- File: `src/finders/BiAStarFinder.js`
- Test on known small grid topology where meeting point is verifiable
- Test no-path scenario → `return []`
- Test start==end
- Test weight option

### BiDijkstraFinder — same bidirectional gaps
- File: `src/finders/BiDijkstraFinder.js`
- No-path scenario, start==end

### JumpPointFinder factory — all 4 modes
- File: `src/finders/JumpPointFinder.js`
- Test: `DiagonalMovement.Always` → returns JPFAlwaysMoveDiagonally instance
- Test: `DiagonalMovement.OnlyWhenNoObstacles` → returns JPFMoveDiagonallyIfNoObstacles instance
- Test: no option (default) → falls through to JPFMoveDiagonallyIfAtMostOneObstacle

## Priority 2 (Medium)

### JPFNeverMoveDiagonally — error throw
- File: `src/finders/JPFNeverMoveDiagonally.js`
- Test `_jump` with dx===0 && dy===0 → throws `"Only horizontal and vertical movements are allowed"`

### JPFMoveDiagonallyIfAtMostOneObstacle — uncovered branches
- File: `src/finders/JPFMoveDiagonallyIfAtMostOneObstacle.js`
- `trackJumpRecursion: true` option
- Diagonal forced-neighbor branches (requires specific obstacle layout)
- Diagonal blocked early-return null (line 71–75)
- No-path scenario

### BiBreadthFirstFinder — no-path + start==end
- File: `src/finders/BiBreadthFirstFinder.js`

### JumpPointFinderBase — uncovered branches
- File: `src/finders/JumpPointFinderBase.js`
- `findPath` returning `[]`
- `_identifySuccessors`: `jumpNode.closed` skip branch
- `_identifySuccessors`: `openList.updateItem` branch (jump node already open with higher g)
