const PF = require('/home/sagar/PathFinding.js-fork');

const WIDTH = 15;
const HEIGHT = 15;
const START = [0, 7];
const END = [14, 7];
const WALLS = [
  [3,1], [3,2], [3,3], [3,4],
  [7,5], [7,6], [7,7], [7,8], [7,9],
  [11,2], [11,3], [11,4], [11,5], [11,6],
  [5,10], [5,11], [5,12],
  [9,0], [9,1], [9,2]
];

const ITERATIONS = 10;

function createGrid() {
  const grid = new PF.Grid(WIDTH, HEIGHT);
  WALLS.forEach(([x, y]) => grid.setWalkableAt(x, y, false));
  return grid;
}

function countExploredNodes(grid) {
  let explored = 0;
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      const node = grid.getNodeAt(x, y);
      if (node.opened || node.closed) {
        explored += 1;
      }
    }
  }
  return explored;
}

function runOnce() {
  const grid = createGrid();
  const finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.Never
  });

  const t0 = process.hrtime.bigint();
  const path = finder.findPath(START[0], START[1], END[0], END[1], grid);
  const t1 = process.hrtime.bigint();

  const elapsedMs = Number(t1 - t0) / 1e6;
  const exploredNodes = countExploredNodes(grid);
  const pathLength = path.length > 0 ? path.length - 1 : 0;

  return { elapsedMs, exploredNodes, pathLength, path };
}

const runs = [];
for (let i = 0; i < ITERATIONS; i += 1) {
  runs.push(runOnce());
}

const avgTimeMs = runs.reduce((sum, r) => sum + r.elapsedMs, 0) / runs.length;
const first = runs[0];

const results = {
  algorithm: 'A*',
  gridSize: `${WIDTH}x${HEIGHT}`,
  wallCount: WALLS.length,
  start: START,
  end: END,
  nodesExplored: first.exploredNodes,
  pathLength: first.pathLength,
  averageTimeMs: avgTimeMs,
  path: first.path,
  iterations: ITERATIONS,
  timesMs: runs.map((r) => r.elapsedMs)
};

console.log(JSON.stringify(results, null, 2));
