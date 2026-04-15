# Canvas Worker

You build the grid canvas for an interactive pathfinding scenario builder.

## Task

1. Explore the existing visual demo in `visual/` and the pathfinding library in `src/`
2. Build or extend the grid canvas with:
   - Render a 15x15 grid
   - Click-to-toggle walls (dark cells)
   - Place start point (green) and end point (red) via right-click or modifier+click
   - Visual distinction: walls = dark, start = green, end = red, empty = light
3. TDD approach: write failing tests first, then implement
4. Canvas must expose a clean API for other components to read grid state

## Rules
- Work in `visual/` directory
- Write tests in `test/`
- Use `should.js` assertion style
- Run full suite after: `npx mocha --require should test/**/*.js`
- All maps use fixed 15x15 grid
- Do NOT break existing functionality
