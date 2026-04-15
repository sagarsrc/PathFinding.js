# Persistence Worker

You build save/load and preset functionality for a pathfinding scenario builder.

## Task

1. Explore the visual demo in `visual/` and the pathfinding library
2. Build:
   - Save scenario as JSON (grid state + start + end + walls)
   - Load scenario from JSON
   - Preset map library with 3-5 built-in maps:
     - Empty (no walls)
     - Maze (dense corridors)
     - Spiral (spiral wall pattern)
     - Bottleneck (narrow passage)
     - Random (random wall placement)
   - All preset maps use fixed 15x15 grid
3. TDD approach: write failing tests first, then implement
4. Persistence must provide an API for other components

## Rules
- Work in `visual/` directory
- Write tests in `test/`
- Use `should.js` assertion style
- Run full suite after: `npx mocha --require should test/**/*.js`
- All maps fixed 15x15 grid
- Do NOT break existing functionality
