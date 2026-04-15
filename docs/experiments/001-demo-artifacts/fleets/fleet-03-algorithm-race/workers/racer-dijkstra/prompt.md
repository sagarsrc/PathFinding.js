# Racer: Dijkstra

You benchmark Dijkstra pathfinding on a fixed map and capture metrics.

## Task

1. Explore the pathfinding library in `src/` — find the Dijkstra implementation
2. Create a benchmark script that:
   - Sets up a 15x15 grid with sparse walls (use the EXACT wall layout below)
   - Sets start at (0, 0) and end at (14, 14)
   - Runs Dijkstra on this grid
   - Captures: nodes explored, path length, execution time (ms)
   - Runs 100 iterations for stable timing
3. Write tests first (TDD): test that Dijkstra finds a path, test metrics capture works
4. Run the benchmark and capture results

## Output

Save results to `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/racer-dijkstra/output/results.md` — use absolute paths.

Format:
```
# Dijkstra Benchmark Results

- Grid: 15x15
- Walls: [list wall positions]
- Start: (0, 0)
- End: (14, 14)
- Path found: yes/no
- Path length: N
- Nodes explored: N
- Avg time (100 runs): N.NN ms
```

## Important

Use this EXACT wall layout so both racers use the same map:
```javascript
var walls = [[2,1],[2,2],[2,3],[2,4],[4,3],[4,4],[4,5],[4,6],[6,1],[6,2],[6,3],[8,5],[8,6],[8,7],[8,8],[10,2],[10,3],[10,4],[12,6],[12,7],[12,8],[12,9]];
```

## Rules
- Run full suite after: `npx mocha --require should test/**/*.js`
- Do NOT modify existing library code
