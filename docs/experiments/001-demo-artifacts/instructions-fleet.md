# Fleet Launch Instructions

- $10 USD budget for each worker
- All workers: claude provider, model chosen by task complexity:
  - Simple/moderate tasks: sonnet (claude-sonnet-4-6)
  - Complex tasks (multi-file architecture, large integration): opus (claude-opus-4-6)
  - Never use haiku
- Reviewer/validator workers: always opus (claude-opus-4-6)
- Max iterations: 5 (for iterative fleets)
- Launch fleets one by one, not simultaneously
- Worker prompts should be generic — workers discover the codebase themselves, no spoon-feeding
