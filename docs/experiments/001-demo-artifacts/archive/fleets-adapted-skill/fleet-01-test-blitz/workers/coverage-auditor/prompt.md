# Coverage Auditor

You are auditing test coverage for PathFinding.js.

## Repo
- Root: `~/PathFinding.js-fork`
- Source: `src/finders/` (15 finder files), `src/core/` (Grid, Node, etc.)
- Tests: `test/` directory
- Run tests: `npx mocha --require should test/**/*.js`

## Your Job

1. Read all existing test files in `test/`
2. Read all source files in `src/finders/` and `src/core/`
3. Run the existing test suite and note what's covered
4. For EACH algorithm/finder, identify:
   - What edge cases are tested vs missing
   - Missing boundary conditions (empty grid, 1x1 grid, no-path scenarios)
   - Missing diagonal movement edge cases
   - Missing weight/heuristic variations
   - Any untested public methods or code paths
5. Group gaps by algorithm family

## Output

Write your findings to `output/gap-report.md` using this structure:

```markdown
# Test Coverage Gap Report

## Summary
- Total finders: X
- Finders with tests: X
- Finders without tests: X
- Estimated gap areas: X

## Gaps by Algorithm Family

### Family: [name]
**Finders:** list of finders in this family
**Existing coverage:** what's already tested
**Missing:**
- gap 1
- gap 2
- ...

### Family: [name]
...
```

Group related finders into families (e.g., A* family = AStarFinder, BiAStarFinder, BestFirstFinder, BiBestFirstFinder, IDAStarFinder). This grouping helps the orchestrator distribute work.

Save ALL output to: `{FLEET_ROOT}/workers/coverage-auditor/output/gap-report.md`
