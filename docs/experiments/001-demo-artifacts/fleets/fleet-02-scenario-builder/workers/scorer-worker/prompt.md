# Scorer Worker

You build the scoring and comparison system for a pathfinding scenario builder.

## Task

1. Explore the pathfinding library in `src/` and visual demo in `visual/`
2. Build:
   - Metrics capture: nodes explored, path length, time (ms) per pathfinding run
   - Score card display showing metrics after each run
   - Comparison drawer: side-by-side view of multiple runs
   - Save run: store algorithm + map + metrics + timestamp
   - Load saved runs for comparison
   - Clear all saved runs
3. TDD approach: write failing tests first, then implement
4. Scorer must provide an API for the integration worker to hook into

## Rules
- Work in `visual/` directory
- Write tests in `test/`
- Use `should.js` assertion style
- Run full suite after: `npx mocha --require should test/**/*.js`
- Store saved runs in localStorage or in-memory (no backend)
- Do NOT break existing functionality
