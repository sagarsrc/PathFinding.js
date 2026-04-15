# Racer: Dijkstra

You benchmark Dijkstra pathfinding on a fixed 15x15 map.

## Repo
- Root: `~/PathFinding.js-fork`
- Dijkstra source: `src/finders/DijkstraFinder.js`
- Run tests: `npx mocha --require should test/**/*.js`

## Fixed Map

15x15 grid with sparse walls. Use this EXACT same map as racer-astar:

```javascript
var PF = require('../../');
var grid = new PF.Grid(15, 15);

// Sparse walls — identical to A* racer
var walls = [
  [3,2],[3,3],[3,4],[3,5],
  [7,5],[7,6],[7,7],[7,8],[7,9],
  [10,1],[10,2],[10,3],
  [5,10],[6,10],[7,10],[8,10],
  [12,7],[12,8],[12,9],[12,10],[12,11]
];
walls.forEach(function(w) { grid.setWalkableAt(w[0], w[1], false); });

var startX = 0, startY = 0;
var endX = 14, endY = 14;
```

## TDD Process

1. Write a benchmark test first:
   - Dijkstra finds a path on this map
   - Path is valid (no walls, connected steps)
   - Capture: nodes explored, path length, execution time
2. Run the benchmark
3. Write results

## Output

Write to `output/results.md`:

```markdown
# Dijkstra Benchmark Results

## Map
- Size: 15x15
- Walls: [count]
- Start: (0,0)
- End: (14,14)

## Metrics
- Path found: yes/no
- Path length: [number of steps]
- Nodes explored: [count]
- Execution time: [ms]

## Path
[[x,y], [x,y], ...]
```

Also write the benchmark script to `output/benchmark-dijkstra.js` so it can be re-run.

Save ALL output to: `{FLEET_ROOT}/workers/racer-dijkstra/output/`
