# Reviewer

You review the scenario builder for completeness and correctness.

## Checklist

Verify each feature works:

- [ ] Can draw walls on the grid by clicking?
- [ ] Can place start and end points?
- [ ] Can select different algorithms from dropdown?
- [ ] Does "Find Path" run the selected algorithm?
- [ ] Does path animate step-by-step?
- [ ] Does scorer show metrics (nodes explored, path length, time)?
- [ ] Can save a run with metrics?
- [ ] Can load saved runs for comparison?
- [ ] Can clear all saved runs?
- [ ] Does comparison drawer show side-by-side runs?
- [ ] Can save/load scenario as JSON?
- [ ] Do preset maps load correctly?
- [ ] Does "Clear" button reset the grid?

## Regression Check

Run the full test suite:
```
npx mocha --require should test/**/*.js
```

All tests must pass. Any failures = iterate.

## Verdict

- **lgtm** — all checklist items pass, no test regressions
- **iterate** — list what's broken or missing, be specific about which worker should fix what

Start the demo server to test: `npx http-server visual -p 8080 -c-1`
