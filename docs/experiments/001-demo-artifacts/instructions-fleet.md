# Fleet Launch Instructions

## Budget & Models

- $10 USD budget per worker
- All workers: claude provider, model by task complexity:
  - Simple/moderate tasks: sonnet (claude-sonnet-4-6)
  - Complex tasks (multi-file architecture, large integration): opus (claude-opus-4-6)
  - Never use haiku
- Reviewer/validator workers: always opus (claude-opus-4-6)

## Execution

- Max iterations: 5 (for iterative fleets)
- Launch fleets one by one, not simultaneously
- Worker prompts should be generic — workers discover the codebase themselves, no spoon-feeding

## Reviewer Verdict (iterative fleets)

Reviewer workers MUST write a verdict file for the orchestrator to pick up:

- **Path:** `iterations/<N>/review.md` (relative to fleet root, which is the worker's cwd)
- **Never use absolute paths** in reviewer prompts
- File MUST contain a line: `verdict: lgtm` or `verdict: iterate`
- To determine iteration N: list `iterations/` dir, find highest-numbered subdir without a `review.md`
- If no verdict file is found, orchestrator treats it as `iterate` (wastes an iteration)

Example `iterations/1/review.md`:
```
verdict: iterate

## Issues
- canvas-worker: wall toggle not working
- scorer-worker: metrics panel missing time display
```

## Lessons Learned

- Fleet 01 (dag-fleet): completed successfully, 9/9 workers, $5.98 total
- Fleet 02 (iterative-fleet): iteration 1 reviewer failed to write verdict file because prompt didn't specify where/how — fixed by adding explicit path + discovery instructions
