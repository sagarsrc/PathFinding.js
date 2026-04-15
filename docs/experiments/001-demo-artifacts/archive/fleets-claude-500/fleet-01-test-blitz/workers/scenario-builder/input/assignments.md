# Scenario Builder Assignment

## Master Visual Gap Inventory (from visual audit)
- No automated tests for `visual/js/*`, `visual/index.html`, or UI interactions.
- High-risk uncovered areas: controller state transitions, button state mapping, operation replay timing, panel parser wiring, view dirty-node reset, DOM draw/erase/drag flows.
- Known potential defects to cover: IDA* heuristic selector mismatch in `Panel.getFinder`, unreachable `modified` transition usage in controller, CSS selector typo `#hide_instruction:hover` vs `#hide_instructions`.

## Your Scope
Own visual/scenario tests and integration harness for demo behaviors.

### Gaps to cover (specific files/functions/edge cases)
1. `visual/js/controller.js`
- State machine contract tests: legal/illegal transitions and side effects.
- Button label/disabled/callback mapping for `ready`, `searching`, `paused`, `finished`, `modified`.
- `hookPathFinding`, `step`, `loop`, `clearOperations`, finish-on-queue-depletion behavior.
- Mouse interaction scenarios for drag/draw/erase flows.

2. `visual/js/panel.js`
- Table-driven parser tests by accordion selection -> finder class + options.
- Regression test for IDA* heuristic selector using wrong radio group.
- Input sanitization tests (`weight >= 1`, IDA `timeLimit` fallback `-1`, diagonal/JPS options).

3. `visual/js/view.js`
- Unit tests for `generateGrid`, coordinate converters, dirty tracking, blocked overlays, footprint clearing.
- `buildSvgPath`, draw/clear path behavior, `showStats` formatting.

4. Boot and compatibility scenarios
- `visual/js/main.js`: verify `Panel.init()` before `Controller.init()`.
- `Raphael.svg=false` redirects to `visual/notsupported.html`; `Raphael.svg=true` initializes normally.
- Include lightweight DOM integration scenarios for controls (start/pause/resume/restart/cancel/clear).

5. Style-level regression check
- Add a focused test or static assertion catching selector mismatch for hide-instructions hover rule.

## Where to put new tests
- `test/visual/controller.spec.js`
- `test/visual/panel.spec.js`
- `test/visual/view.spec.js`
- `test/visual/main-and-dom-integration.spec.js`

## TDD Rule (required)
Write failing tests first, then implement. Verify existing tests still pass.

## Verify command
`npx mocha --require should test/**/*.js`
