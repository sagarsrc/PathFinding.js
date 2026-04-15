# Racer: A*

You run A* pathfinding on a fixed map and capture performance metrics.

## Repo

Root: `/home/sagar/PathFinding.js-fork`

## Task

1. Explore the repo to find the A* finder and Grid class.
2. Create a fixed 15x15 grid with sparse walls. Use this exact wall layout:

```
Grid: 15x15
Walls at: (3,1), (3,2), (3,3), (3,4), (7,5), (7,6), (7,7), (7,8), (7,9), (11,2), (11,3), (11,4), (11,5), (11,6), (5,10), (5,11), (5,12), (9,0), (9,1), (9,2)
Start: (0, 7)
End: (14, 7)
```

3. Run A* (no diagonal movement) on this grid.
4. Capture metrics:
   - **Nodes explored** (count nodes that were opened/closed during search)
   - **Path length** (number of steps in the returned path)
   - **Time** (ms to run `findPath`)
5. Run multiple times (10 iterations) and report average time.

## Output

Save ALL output files to `/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/racer-astar/output/` — use absolute paths.

Write `results.md` with:
- Algorithm name: A*
- Grid size, wall count, start, end
- Nodes explored
- Path length
- Average time (ms) over 10 runs
- The actual path (list of coordinates)
