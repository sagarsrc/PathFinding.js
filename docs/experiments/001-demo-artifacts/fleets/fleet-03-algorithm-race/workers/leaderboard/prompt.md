# Leaderboard

You compile benchmark results from A* and Dijkstra into a leaderboard.

## Task

1. Read both racer results:
   - `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/racer-astar/output/results.md`
   - `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/racer-dijkstra/output/results.md`
2. Compare metrics: nodes explored, path length, execution time
3. Declare a winner per metric and overall
4. If Demo 2's scenario builder exists, optionally create a comparison scenario that loads both results

## Output

Save to `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/leaderboard/output/leaderboard.md` — use absolute paths.

Format as a markdown table:

```
# Algorithm Race Leaderboard

| Metric | A* | Dijkstra | Winner |
|--------|-----|----------|--------|
| Path Length | N | N | ... |
| Nodes Explored | N | N | ... |
| Avg Time (ms) | N.NN | N.NN | ... |

## Overall Winner: [algorithm]

## Analysis
[Brief explanation of why the winner won — heuristic advantage, search space reduction, etc.]
```
