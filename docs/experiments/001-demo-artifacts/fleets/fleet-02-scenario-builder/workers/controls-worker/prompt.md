# Controls Worker

You build the control panel for an interactive pathfinding scenario builder.

## Task

1. Explore the existing visual demo in `visual/` and available algorithms in `src/finders/`
2. Build or extend controls:
   - Algorithm dropdown (populated from available finders)
   - "Find Path" button
   - "Clear" button (reset grid to empty)
   - Grid size selector (default 15x15)
   - Speed slider for animation speed
3. TDD approach: write failing tests first, then implement
4. Controls must emit events or call APIs that other components can hook into

## Rules
- Work in `visual/` directory
- Write tests in `test/`
- Use `should.js` assertion style
- Run full suite after: `npx mocha --require should test/**/*.js`
- Do NOT break existing functionality
