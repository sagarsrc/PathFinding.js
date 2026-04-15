# Visual Demo Audit: `visual/`

## 1) Inventory of `visual/` files and purpose

### App entry and app-owned source
- `/home/sagar/PathFinding.js-fork/visual/index.html`
  - Main demo page layout.
  - Loads vendor libs, then app modules (`view.js`, `controller.js`, `panel.js`, `main.js`).
  - Defines instructions panel, algorithm accordion panel, control buttons, stats area.
- `/home/sagar/PathFinding.js-fork/visual/notsupported.html`
  - Fallback page shown when SVG is unavailable.
- `/home/sagar/PathFinding.js-fork/visual/css/style.css`
  - Custom styles for panels, buttons, stats, footer, and general page layout.
- `/home/sagar/PathFinding.js-fork/visual/js/main.js`
  - Bootstraps app on `document.ready`.
  - Redirects to `notsupported.html` if `Raphael.svg` is false.
  - Calls `Panel.init()` then `Controller.init()`.
- `/home/sagar/PathFinding.js-fork/visual/js/controller.js`
  - Core orchestration/state machine.
  - Initializes grid, binds pointer events, hooks pathfinding node operations, controls animation loop, manages buttons, start/end/wall interactions.
- `/home/sagar/PathFinding.js-fork/visual/js/view.js`
  - Rendering layer (Raphael).
  - Builds grid asynchronously, colors/zooms cells, draws path, handles blocked-node overlays, stats display, coordinate conversion.
- `/home/sagar/PathFinding.js-fork/visual/js/panel.js`
  - Panel behavior and algorithm option parsing.
  - Creates finder instances from current accordion section and option inputs.

### Visual docs/build artifacts
- `/home/sagar/PathFinding.js-fork/visual/doc/state-description.md`
  - Human-readable state/button behavior notes.
- `/home/sagar/PathFinding.js-fork/visual/doc/state-diagram.gv`
  - Graphviz source for state transitions.
- `/home/sagar/PathFinding.js-fork/visual/doc/state-diagram.png`
  - Rendered diagram image.
- `/home/sagar/PathFinding.js-fork/visual/Makefile`
  - `doc` target to render `state-diagram.png` from `.gv`.

### Vendor JS libraries (loaded by visual app)
- `/home/sagar/PathFinding.js-fork/visual/lib/raphael-min.js` (SVG drawing)
- `/home/sagar/PathFinding.js-fork/visual/lib/es5-shim.min.js` (legacy JS compat)
- `/home/sagar/PathFinding.js-fork/visual/lib/jquery-1.7.2.min.js` (DOM/events)
- `/home/sagar/PathFinding.js-fork/visual/lib/state-machine.min.js` (FSM engine)
- `/home/sagar/PathFinding.js-fork/visual/lib/async.min.js` (async task sequencing)
- `/home/sagar/PathFinding.js-fork/visual/lib/pathfinding-browser.min.js` (PF algorithms bundle)

### Vendor jQuery UI JS plugins
- `/home/sagar/PathFinding.js-fork/visual/lib/ui/jquery.ui.core.min.js`
- `/home/sagar/PathFinding.js-fork/visual/lib/ui/jquery.ui.widget.min.js`
- `/home/sagar/PathFinding.js-fork/visual/lib/ui/jquery.ui.mouse.min.js`
- `/home/sagar/PathFinding.js-fork/visual/lib/ui/jquery.ui.draggable.min.js`
- `/home/sagar/PathFinding.js-fork/visual/lib/ui/jquery.ui.accordion.min.js`
- `/home/sagar/PathFinding.js-fork/visual/lib/ui/jquery.ui.slider.min.js`

### Vendor CSS themes
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.all.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.base.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.theme.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.core.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.accordion.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.autocomplete.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.button.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.datepicker.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.dialog.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.progressbar.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.resizable.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.selectable.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.slider.css`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/jquery.ui.tabs.css`

### Vendor theme image assets
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-bg_flat_0_aaaaaa_40x100.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-bg_glass_95_fef1ec_1x400.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-bg_gloss-wave_16_121212_500x100.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-bg_highlight-hard_15_888888_1x100.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-bg_highlight-hard_55_555555_1x100.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-bg_highlight-soft_35_adadad_1x100.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-bg_highlight-soft_60_dddddd_1x100.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-bg_inset-soft_15_121212_1x100.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-icons_666666_256x240.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-icons_aaaaaa_256x240.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-icons_bbbbbb_256x240.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-icons_c98000_256x240.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-icons_cccccc_256x240.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-icons_cd0a0a_256x240.png`
- `/home/sagar/PathFinding.js-fork/visual/lib/themes/images/ui-icons_f29a00_256x240.png`

## 2) Current capabilities of the demo app

### Grid/rendering
- Renders a `64 x 36` grid using Raphael rectangles.
- Uses asynchronous row-by-row grid generation (`async.series`) to avoid blocking UI.
- Displays incremental generation progress text in `#stats` while building.
- Supports blocked-cell overlays with animation (clone + colorize + zoom).
- Maintains dirty coordinate tracking for opened/closed/tested reset behavior.

### Interaction model
- Drag start node (green) and end node (red) across walkable cells.
- Draw walls by mousedown+drag over walkable cells.
- Erase walls by mousedown+drag over blocked cells.
- Prevents drawing over start/end nodes.
- Panels are draggable (`.panel`).
- Instructions panel can be hidden.

### Algorithm selection + options
- Accordion-based selection for:
  - A*
  - IDA*
  - Breadth-First
  - Best-First
  - Dijkstra
  - Jump Point Search (diagonal mode)
  - Orthogonal Jump Point Search
- Options parsed per algorithm include combinations of:
  - heuristic
  - allowDiagonal
  - bi-directional
  - dontCrossCorners
  - weight
  - timeLimit
  - recursion tracking
- `Panel.getFinder()` returns a concrete PF finder instance with parsed options.

### Search/animation/state machine
- Uses explicit state machine with states such as: `ready`, `starting`, `searching`, `paused`, `finished`, `modified`, drag/draw/erase intermediary states.
- Hooks `PF.Node` property setters (`opened`, `closed`, `tested`) to collect operation queue.
- Runs search on cloned grid, records elapsed time + operation count.
- Replays collected operations at configured rate (`operationsPerSecond = 300`).
- Supports Start / Pause / Resume / Restart / Cancel / Clear Path / Clear Walls flow depending on state.
- Draws final path polyline and shows stats (length, time, operations).

### Fallback support
- Redirects to `notsupported.html` when browser lacks Raphael SVG support.

## 3) Testable behaviors (programmatic targets)

### Controller state machine and transitions
- Valid/invalid transitions for all declared events (`init`, `start`, `search`, `pause`, `resume`, `finish`, `restart`, `reset`, `clear`, `dragStart`, etc.).
- Button labels/enabled state + bound callbacks per entry state (`onready`, `onsearching`, `onpaused`, `onfinished`, `onmodified`).
- Asynchronous transitions (`onleavenone`, deferred `onrestart`/`onreset`) and resulting side effects.

### Controller operational logic
- `hookPathFinding()` instrumentation pushes expected operation objects when node flags mutate.
- `step()` drains queue, skips unsupported ops, calls `finish()` when exhausted.
- `loop()` respects current state (`searching` only).
- `mousedown`/`mousemove`/`mouseup` behavior across drag/draw/erase modes.
- Default start/end placement computation based on window and panel width.

### View rendering logic (unit-testable with mocks/stubs)
- `generateGrid()` creates the expected `rects[y][x]` structure and paper size.
- Coordinate conversion correctness (`toGridCoordinate`, `toPageCoordinate`).
- Dirty-state bookkeeping (`setCoordDirty`, `getDirtyCoords`, `clearFootprints`).
- Walkable/block overlay management (`setWalkableAt`, `clearBlockedNodes`).
- Path conversion (`buildSvgPath`) and draw/clear path behavior.
- Stats text formatting in `showStats()`.

### Panel parsing + finder creation
- Correct finder type selection based on active accordion header.
- Mapping of checkbox/radio/input values to finder options.
- Input sanitization logic (weight minimum 1, IDA timeLimit fallback to `-1`).
- Diagonal mode configuration for JPS variants.

### DOM/UI behavior (integration/e2e)
- Boot sequence order (`Panel.init` then `Controller.init`).
- Disabled/enabled states of control buttons across interactions.
- Accordion selection affecting `Panel.getFinder()` output.
- Panel hide action and panel draggable behavior initialization.

## 4) Gaps: missing coverage / likely untested

### Current automated coverage status
- First-party tests exist only under `/home/sagar/PathFinding.js-fork/test` and target core algorithm/data-structure modules (`Grid`, `Util`, finder path scenarios).
- Build test command (`gulp test`) runs `./test/**/*.js` only.
- No visual demo tests (no tests for `visual/js/*`, `visual/index.html`, or UI interactions).

### High-value uncovered logic/risk areas
- No regression tests for controller state transitions and button state mapping.
- No tests for operation replay timing and completion behavior.
- No tests for panel option parsing and finder wiring.
- No tests for view dirty-node reset semantics.
- No DOM integration tests for draw/erase/drag interactions.

### Notable correctness risks observed during audit
- `Panel.getFinder()` IDA* branch reads heuristic from `input[name=jump_point_heuristic]` instead of `ida_heuristic`.
  - This can silently couple IDA* heuristic selection to the wrong radio group.
- `Controller` has `modify` state/handlers, but no direct call sites to `modify()` were found in visual JS.
  - The documented `finished -> modified` transition appears effectively unexercised.
- CSS typo: hover rule uses `#hide_instruction:hover` but element id is `#hide_instructions`.
  - Cosmetic but indicates no style-level regression check.

## 5) Prioritized visual test opportunities

1. **Controller state-machine contract tests (highest ROI)**
- Verify each state entry mutates button text/callback/disabled state exactly as expected.
- Verify illegal transitions are rejected and legal transitions invoke expected side effects.

2. **Panel parser tests (high ROI, bug-prone)**
- Table-driven tests for each accordion section -> finder class + option object.
- Explicit regression test for IDA* heuristic selector name mismatch.

3. **Controller operation pipeline tests**
- Unit tests for `hookPathFinding`, `step`, `clearOperations`, `finish` trigger at queue depletion.
- Deterministic test by stubbing `setTimeout` and `View` methods.

4. **View unit tests with Raphael stub**
- Grid creation shape/count and coordinate helpers.
- Dirty tracking and footprint clearing.
- Path SVG string construction.

5. **Lightweight browser integration tests (Playwright/Cypress)**
- User flows: draw walls, drag start/end, start/pause/resume/restart/cancel/clear.
- Assert DOM text states and visual class/attribute changes (or SVG attr snapshots).

6. **Smoke tests for startup compatibility paths**
- `Raphael.svg = false` redirects to `notsupported.html`.
- `Raphael.svg = true` initializes panels + controller and renders grid.

## 6) Suggested test harness approach (minimal-invasive)

- Unit layer: run in Node + jsdom, stub Raphael and PF finder internals as needed.
- Integration layer: Playwright against `npx http-server visual -p 8080 -c-1`.
- Keep visual tests isolated from core algorithm tests; add separate npm script (e.g., `test:visual`).
