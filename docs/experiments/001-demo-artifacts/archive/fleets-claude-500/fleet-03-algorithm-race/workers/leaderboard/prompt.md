# Leaderboard

You read both racer results and produce a comparison leaderboard.

## Inputs

Read results from both racers:
- `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/racer-astar/output/results.md`
- `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/racer-dijkstra/output/results.md`

## Task

1. Read both result files.
2. Compare metrics side-by-side:
   - Nodes explored: which explored fewer?
   - Path length: same or different? (both should find optimal path)
   - Time: which was faster?
3. Declare a winner and explain why A* wins (heuristic prunes search space).
4. Optionally: if Demo 2's scenario builder exists at `visual/scenario/`, note that these results could be visualized there.

## Output

Save ALL output files to `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/leaderboard/output/` — use absolute paths.

Write `leaderboard.md` with:
- Side-by-side comparison table
- Winner declaration
- Brief explanation of why A* outperforms Dijkstra on this map
- The shared map description for context
