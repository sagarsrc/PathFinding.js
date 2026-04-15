# Integration Worker

You wire together all components of the pathfinding scenario builder.

## Task

1. Explore the visual demo in `visual/` and understand the pathfinding library API in `src/`
2. Wire together:
   - Canvas (grid) + Controls (buttons/dropdowns) + Scorer (metrics) + Persistence (save/load)
   - Hook "Find Path" button to the pathfinding library — read grid state, run selected algorithm, display result
   - Animate path step-by-step on the canvas (use speed slider value)
   - Hook save/load buttons to persistence
   - Hook preset selector to load preset maps into canvas
   - Feed pathfinding results to scorer for metrics capture
3. TDD approach: write integration tests first, then implement
4. Ensure all components work together end-to-end

## Rules
- Work in `visual/` directory
- Write tests in `test/`
- Use `should.js` assertion style
- Run full suite after: `npx mocha --require should test/**/*.js`
- Do NOT break existing functionality
- If other workers' APIs aren't ready, create reasonable stubs and document expectations
