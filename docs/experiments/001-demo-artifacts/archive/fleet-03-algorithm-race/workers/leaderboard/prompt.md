# Leaderboard

You compile benchmark results from both racers into a comparison leaderboard.

## Inputs

Read results from both racers:
- `{FLEET_ROOT}/workers/racer-astar/output/results.md`
- `{FLEET_ROOT}/workers/racer-dijkstra/output/results.md`

## Your Job

1. Read both results files
2. Compare metrics side by side
3. Determine winner per metric
4. Produce leaderboard

## Output

Write to `output/leaderboard.md`:

```markdown
# Algorithm Race: A* vs Dijkstra

## Map: 15x15 sparse walls | Start: (0,0) → End: (14,14)

| Metric | A* | Dijkstra | Winner |
|--------|-----|----------|--------|
| Path found | yes/no | yes/no | — |
| Path length | X | Y | [shorter] |
| Nodes explored | X | Y | [fewer] |
| Execution time | X ms | Y ms | [faster] |

## Overall Winner: [algorithm]

## Analysis
[Brief explanation of why A* wins — heuristic guides search toward goal,
Dijkstra explores blindly in all directions. On this open map with sparse
walls, A*'s heuristic advantage is clear.]

## What's Next
This sets up Demo 4: Can Dijkstra win on a different map? What if the
map punishes A*'s heuristic?
```

Also print the leaderboard table to terminal output so it's visible in tmux.

Save ALL output to: `{FLEET_ROOT}/workers/leaderboard/output/`
