# Persistence Worker

You build save/load and preset maps for the PathFinding.js scenario builder.

## Repo

Root: `/home/sagar/PathFinding.js-fork`
Test command: `npx mocha --require should test/**/*.js`

## Task

Build persistence features under `visual/scenario/`:

1. **Save scenario as JSON** — serialize grid state (walls, start, end) to a JSON format.
2. **Load scenario from JSON** — deserialize and restore grid state.
3. **Preset map library** — provide 3-5 built-in maps, all fixed 15x15 grid:
   - Empty (no walls)
   - Maze (complex maze pattern)
   - Spiral (spiral wall pattern)
   - Bottleneck (narrow passage between two open areas)
   - Random (random wall placement, ~30% density)

Export a clean API: `saveScenario(gridState)`, `loadScenario(json)`, `getPresets()`, `loadPreset(name)`.

## Where to build

Add to `visual/scenario/`. Do NOT modify existing `visual/js/` or `visual/index.html`.

## TDD

- Write failing tests first for: save/load roundtrip, preset loading, preset grid dimensions (all must be 15x15), JSON format validation.
- Place tests in `test/` directory.
- Run `npx mocha --require should test/**/*.js` — all tests must pass.
- Do NOT break existing tests.
