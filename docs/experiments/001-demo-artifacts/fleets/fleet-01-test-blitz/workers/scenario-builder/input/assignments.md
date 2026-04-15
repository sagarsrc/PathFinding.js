# Scenario Builder — Visual Demo Test Scenarios + Bug Verification

## Priority 1 (Critical Bugs)

### BUG-01: IDA* reads wrong heuristic radio
- File: `visual/js/panel.js:160`
- Build scenario TC-06: select each IDA* heuristic, verify behavior changes
- Document: `jump_point_heuristic` read instead of `ida_heuristic`

### BUG-03: No "no path found" feedback
- Files: `visual/js/view.js:244–249`, `visual/js/controller.js:174–180`
- Build scenario TC-04: fully enclose start with walls, run search
- Document: stats show length 0, no user-facing message

### BUG-07: Stale pre-built bundle
- File: `visual/lib/pathfinding-browser.min.js`
- Verify: compare bundle contents vs current `src/` — document any drift

## Priority 2 (Correctness Scenarios)

### TC-01: Open grid, A* Manhattan, no diagonal
- Expected: straight horizontal/vertical path, reasonable ops count

### TC-02: Open grid, A* Euclidean, diagonal allowed
- Expected: diagonal shortcuts visible

### TC-03: Start == End position
- Expected: immediate finish, path length 0, ops 0

### TC-05: Bi-directional A* vs A* comparison
- Expected: bi-directional uses fewer operations

### TC-07: JPS on open grid
- Expected: matches A* result, jump points visible in opened-node pattern

### TC-09: Weight > 1 in A*
- Expected: longer path, lower op count

### TC-10: IDA* time limit on large maze
- Expected: early termination, empty path

## Priority 3 (Interaction + Edge Case Scenarios)

### TC-11 through TC-18: Interaction tests
- Drag start/end nodes, wall drawing/erasing, pause/resume, accordion switching
- Document expected state transitions per state machine

### TC-19 through TC-25: Edge cases
- Corner-to-corner path, dense maze, single-node corridor
- BUG-04 (coordinate offset) triggered by TC-25 (page scroll)
- BUG-05 (`#hide_instruction` typo) — verify hover style missing

## Priority 4 (UI/UX Gaps to Document)

- Missing JPS diagonal modes (Always, OnlyWhenNoObstacles) not in UI
- No animation speed control (hardcoded 300 ops/sec)
- No grid size control (hardcoded 64×36)
- No touch/mobile support (BUG-08)
- Console.log noise in controller
- No "export grid" feature
