const fs = require('fs');
const path = require('path');
const PF = require('/home/sagar/PathFinding.js-fork');

const WIDTH = 15;
const HEIGHT = 15;
const START = [0, 7];
const END = [14, 7];
const WALLS = [
  [3, 1], [3, 2], [3, 3], [3, 4],
  [7, 5], [7, 6], [7, 7], [7, 8], [7, 9],
  [11, 2], [11, 3], [11, 4], [11, 5], [11, 6],
  [5, 10], [5, 11], [5, 12],
  [9, 0], [9, 1], [9, 2]
];
const ITERATIONS = 10;

const OUTPUT_DIR = '/home/sagar/PathFinding.js-fork/docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/racer-dijkstra/output';
const RESULTS_PATH = path.join(OUTPUT_DIR, 'results.md');

function createGrid() {
  const grid = new PF.Grid(WIDTH, HEIGHT);
  for (const [x, y] of WALLS) {
    grid.setWalkableAt(x, y, false);
  }
  return grid;
}

function countExploredNodes(grid) {
  let count = 0;
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      const node = grid.getNodeAt(x, y);
      if (node.opened || node.closed) {
        count += 1;
      }
    }
  }
  return count;
}

function runOne() {
  const grid = createGrid();
  const finder = new PF.DijkstraFinder({ diagonalMovement: PF.DiagonalMovement.Never });

  const t0 = process.hrtime.bigint();
  const pathCoords = finder.findPath(START[0], START[1], END[0], END[1], grid);
  const t1 = process.hrtime.bigint();

  const elapsedMs = Number(t1 - t0) / 1e6;
  const nodesExplored = countExploredNodes(grid);

  return {
    pathCoords,
    pathLengthSteps: pathCoords.length > 0 ? pathCoords.length - 1 : 0,
    nodesExplored,
    elapsedMs
  };
}

const runs = [];
for (let i = 0; i < ITERATIONS; i += 1) {
  runs.push(runOne());
}

const first = runs[0];
const averageTimeMs = runs.reduce((sum, run) => sum + run.elapsedMs, 0) / runs.length;

const results = `# Dijkstra Benchmark Results

- Algorithm name: Dijkstra
- Grid size: ${WIDTH}x${HEIGHT}
- Wall count: ${WALLS.length}
- Start: (${START[0]}, ${START[1]})
- End: (${END[0]}, ${END[1]})
- Nodes explored: ${first.nodesExplored}
- Path length: ${first.pathLengthSteps}
- Average time (ms) over ${ITERATIONS} runs: ${averageTimeMs.toFixed(6)}

## Path

${first.pathCoords.map(([x, y]) => `- (${x}, ${y})`).join('\n')}
`;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(RESULTS_PATH, results, 'utf8');

console.log(`Wrote results to ${RESULTS_PATH}`);
console.log(`Average time (ms): ${averageTimeMs.toFixed(6)}`);
console.log(`Nodes explored: ${first.nodesExplored}`);
console.log(`Path length (steps): ${first.pathLengthSteps}`);
console.log(`Path coordinates: ${JSON.stringify(first.pathCoords)}`);
