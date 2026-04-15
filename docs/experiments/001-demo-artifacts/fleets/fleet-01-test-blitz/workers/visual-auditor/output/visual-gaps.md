# Visual Demo Audit: PathFinding.js

**Audited:** 2026-04-15  
**Source:** `visual/` vs `src/finders/`

---

## 1. Current Visual App Capabilities

### Grid
- 64×36 node grid (hardcoded, no UI control)
- Mouse drag to draw walls, click-drag on existing wall to erase
- Drag green (start) and red (end) nodes to reposition
- Grid generated asynchronously with progress % in stats area

### Algorithm Selection (accordion panel, right side)
| Algorithm | Heuristic | Diagonal | Bi-directional | Don't Cross Corners | Weight | Time Limit | Visualize Recursion |
|-----------|-----------|----------|----------------|---------------------|--------|------------|---------------------|
| A* | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| IDA* | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| BFS | — | ✓ | ✓ | ✓ | — | — | — |
| Best-First | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Dijkstra | — | ✓ | ✓ | ✓ | — | — | — |
| JPS | ✓ | — (hardcoded: IfAtMostOneObstacle) | — | — | — | — | ✓ |
| Orthogonal JPS | ✓ | — (hardcoded: Never) | — | — | — | — | ✓ |

### Playback Controls
- **Start Search** → triggers pathfinding + step animation at 300 ops/sec
- **Pause Search** → suspends step loop
- **Resume/Cancel** from paused state
- **Restart Search** (while searching or finished)
- **Clear Walls** (resets entire grid)
- **Clear Path** (from finished/modified states)

### Visualization
- Opened nodes: pale green (`#98fb98`)
- Closed nodes: pale cyan (`#afeeee`)
- Tested nodes (IDA*/JPS recursion): light grey (`#e5e5e5`)
- Path: yellow polyline, 3px stroke
- Stats overlay (bottom-left): path length, time (ms), operation count

### State Machine
States: `none → ready → starting → searching → [paused | finished] → modified → ready`  
Full diagram in `visual/doc/`.

---

## 2. Algorithms: Library vs UI

### In `src/finders/` — 9 public finders

| Finder | Exposed in UI | Notes |
|--------|--------------|-------|
| `AStarFinder` | ✓ | Via A* + bi-directional checkbox |
| `BiAStarFinder` | ✓ | Via A* bi-directional checkbox |
| `BreadthFirstFinder` | ✓ | Via BFS + bi-directional |
| `BiBreadthFirstFinder` | ✓ | Via BFS bi-directional checkbox |
| `BestFirstFinder` | ✓ | Via Best-First + bi-directional |
| `BiBestFirstFinder` | ✓ | Via Best-First bi-directional checkbox |
| `DijkstraFinder` | ✓ | Via Dijkstra + bi-directional |
| `BiDijkstraFinder` | ✓ | Via Dijkstra bi-directional checkbox |
| `IDAStarFinder` | ✓ (buggy) | Heuristic reads wrong radio — see bugs |
| `JumpPointFinder` | Partial | Only 2 of 4 diagonal modes exposed |

### JPS Diagonal Movement Variants

| `DiagonalMovement` value | Exposed | How |
|--------------------------|---------|-----|
| `Always` (1) | **NO** | Not in UI |
| `Never` (2) | ✓ | "Orthogonal Jump Point Search" accordion |
| `IfAtMostOneObstacle` (3) | ✓ | "Jump Point Search" accordion |
| `OnlyWhenNoObstacles` (4) | **NO** | Not in UI |

**2 of 4 JPS diagonal modes missing from UI.**

---

## 3. Bugs and Broken Features

### BUG-01: IDA* reads wrong heuristic radio (critical)
**File:** `visual/js/panel.js:160`  
```js
heuristic = $('input[name=jump_point_heuristic]:checked').val();
```
IDA* section has its own radio group named `ida_heuristic`, but code reads `jump_point_heuristic` (the JPS heuristic). IDA* always uses whatever JPS heuristic is selected, ignoring its own heuristic UI. If JPS section has never been interacted with, `val()` returns `undefined`, defaulting to `manhattan` by fallback — but it's still reading the wrong control.

### BUG-02: IDA* weight spinner uses wrong `name` selector
**File:** `visual/js/panel.js:162`  
```js
weight = parseInt($('#ida_section input[name=astar_weight]').val()) || 1;
```
Both A* and IDA* spinner inputs use `name="astar_weight"`. The `#ida_section` scoping likely saves this from a cross-match, but the naming is wrong and fragile. Should use a distinct name like `ida_weight`.

### BUG-03: No "no path found" feedback
**File:** `visual/js/view.js:244–249`, `visual/js/controller.js:174–180`  
When `findPath()` returns `[]`, `View.drawPath([])` silently returns without drawing anything. Stats show `length: 0` with no message. User sees animation stop and empty stats with no indication the path is impossible.

### BUG-04: `toGridCoordinate` ignores canvas offset
**File:** `visual/js/view.js:274–278`  
```js
toGridCoordinate: function(pageX, pageY) {
    return [
        Math.floor(pageX / this.nodeSize),
        Math.floor(pageY / this.nodeSize)
    ];
}
```
Assumes canvas is at `(0,0)`. If browser chrome, zoom level, or any CSS margin/padding shifts the canvas, wall placement and node dragging will be offset. Works only because `body` has `padding: 0; margin: 0` and Raphael renders at top-left.

### BUG-05: `#hide_instruction` CSS selector typo
**File:** `visual/css/style.css:59`  
```css
#hide_instruction:hover { ... }
```
Selector is `#hide_instruction` (no `s`), but element ID is `#hide_instructions` (with `s`). Hover style never applies.

### BUG-06: `parent` attribute operation never visualized
**File:** `visual/js/view.js:171–174`  
```js
case 'parent':
    // XXX: Maybe draw a line from this node to its parent?
    break;
```
Parent-pointer updates are logged as operations but silently dropped during playback. No tree/path-so-far visualization.

### BUG-07: `pathfinding-browser.min.js` is a stale pre-built bundle
**File:** `visual/lib/pathfinding-browser.min.js`  
Demo uses a pre-built bundle, not built from `src/`. Any changes to `src/` are NOT reflected in the visual demo without a rebuild. No Makefile target verified to automate this. The `visual/Makefile` should be checked — but the bundle could be out of date with current source.

### BUG-08: No touch/mobile event support
**File:** `visual/js/controller.js:339–343`  
Only `mousedown`, `mousemove`, `mouseup` bound. No `touchstart`/`touchmove`/`touchend`. Demo is unusable on mobile/tablet.

---

## 4. UI/UX Gaps

| Gap | Detail |
|-----|--------|
| No animation speed control | `operationsPerSecond = 300` hardcoded; no slider to slow/speed visualization |
| No grid size control | 64×36 hardcoded; can't resize to test edge cases |
| No preset obstacle patterns | Can't load maze/sparse/dense presets for repeatable testing |
| No algorithm comparison mode | Can't run two algorithms side-by-side |
| JPS diagonal mode not user-selectable | Hardcoded per accordion; `Always` and `OnlyWhenNoObstacles` inaccessible |
| No keyboard shortcuts | No hotkeys for start/pause/clear |
| No "export grid" feature | Can't save/load obstacle layouts |
| Panels overlap canvas on small screens | Fixed-position panels with no responsive behavior |
| Stats always bottom-left | Could overlap instructions panel on narrow viewport |
| No node coordinate display | Mouse position not shown as (col, row) |
| Instructions panel not keyboard-dismissible | Only closeable via click on "hide" |
| `console.log` calls left in controller | `onready`, `onstarting`, `onsearching`, `onpaused`, `onfinished` all log state to console — dev noise in production |

---

## 5. Suggested Visual Test Scenarios

### Correctness Tests

| Scenario | Expected Behavior |
|----------|------------------|
| **TC-01** Open grid, A* Manhattan, no diagonal | Yellow path = straight horizontal/vertical route; ops count reasonable |
| **TC-02** Open grid, A* Euclidean, diagonal allowed | Diagonal shortcuts visible in path |
| **TC-03** Start = End position | Immediate finish, path length = 0, operation count = 0 |
| **TC-04** No path exists (fully enclosed start) | Stats show length 0; **currently: no "no path" message — BUG-03** |
| **TC-05** Bi-directional A* vs A* on same grid | Bi-directional should use fewer operations; compare op counts |
| **TC-06** IDA* heuristic selection (all 4 options) | Verify each heuristic actually changes behavior — **currently broken by BUG-01** |
| **TC-07** JPS on open grid | Path should match A* path; jump points visible in opened-node pattern |
| **TC-08** Orthogonal JPS — no diagonal | Path uses only cardinal moves |
| **TC-09** Weight > 1 in A* (weighted heuristic) | Path longer but op count lower (suboptimal path accepted sooner) |
| **TC-10** IDA* time limit = 1s on large maze | Should terminate early, return empty path |

### Interaction Tests

| Scenario | Expected Behavior |
|----------|------------------|
| **TC-11** Drag start node during `ready` state | Green node moves, grid updates cleanly |
| **TC-12** Drag end node during `finished` state | Transitions to `modified`, Start Search re-enabled |
| **TC-13** Draw wall on top of start/end node | Should not be possible (event handler guards) |
| **TC-14** Erase wall during `erasingWall` state | Grey cell clears with zoom animation |
| **TC-15** Pause mid-search, clear, restart | No stale footprints; fresh search from ready state |
| **TC-16** Rapid click Start → Pause → Resume × N | No animation queue corruption |
| **TC-17** Switch algorithm via accordion after search finished | Panel selection changes; next Start uses new algorithm |
| **TC-18** "Clear Walls" (button 3 in ready) | All walls cleared, start/end stay, grid fully white |

### Edge Case / Stress Tests

| Scenario | Expected Behavior |
|----------|------------------|
| **TC-19** Start and end at grid corners (0,0) → (63,35) | Long path found; no coordinate overflow |
| **TC-20** Dense maze (>90% walls) with existing path | Correct path found through narrow corridor |
| **TC-21** Single-node-wide corridor | All algorithms navigate it correctly |
| **TC-22** BFS on large open grid (many operations) | Animation doesn't freeze; async loop handles high op count |
| **TC-23** IDA* on open grid (high recursion) | `trackRecursion` visualizes grey tested nodes correctly |
| **TC-24** Resize browser window mid-search | Panels reposition (they're fixed); canvas doesn't resize — potential coordinate drift |
| **TC-25** Page scroll (if possible) | `toGridCoordinate` breaks — **BUG-04** |

---

## Summary

**Critical bugs:** BUG-01 (IDA* heuristic reads wrong radio), BUG-03 (silent no-path failure), BUG-07 (stale bundle).  
**Missing algorithms:** `DiagonalMovement.Always` JPS and `DiagonalMovement.OnlyWhenNoObstacles` JPS.  
**Highest-value fixes:** Add no-path feedback, fix IDA* heuristic selector, expose remaining JPS diagonal modes, add animation speed slider.
