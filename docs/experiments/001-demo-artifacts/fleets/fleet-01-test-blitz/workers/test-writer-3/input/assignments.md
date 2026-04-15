# Test Writer 3 — Standard Finders: AStar, Dijkstra, BFS, BestFirst, IDAStar

## Priority 1 (HIGH)

### AStarFinder — weight > 1
- File: `src/finders/AStarFinder.js`
- Test: `new AStarFinder({ weight: 5 })` on a grid where optimal path differs from greedy path
- Verify: finds path (not empty), path may be longer than optimal (suboptimal accepted)

### AStarFinder — custom heuristic
- File: `src/finders/AStarFinder.js`
- Test: pass `opt.heuristic = function(dx, dy) { return 0; }` (behaves like Dijkstra)
- Verify: finds valid path

### AStarFinder — no-path scenario
- File: `src/finders/AStarFinder.js`
- Test: completely blocked end node → `path.length === 0`

### IDAStarFinder — timeLimit option
- File: `src/finders/IDAStarFinder.js`
- Test: `new IDAStarFinder({ timeLimit: 0.001 })` on large open grid
- Verify: returns `[]` (timeout triggered)

### IDAStarFinder — no-path scenario
- Test: blocked end → returns `[]`

## Priority 2 (Medium)

### AStarFinder — start == end
- Verify behavior when startX===endX, startY===endY

### AStarFinder — deprecated allowDiagonal API
- `new AStarFinder({ allowDiagonal: true })` → should work, use diagonal movement

### AStarFinder — deprecated dontCrossCorners API
- `new AStarFinder({ allowDiagonal: true, dontCrossCorners: true })` → maps to OnlyWhenNoObstacles

### DijkstraFinder — no-path + start==end
- Same as AStar gaps but verify zero-heuristic override

### BreadthFirstFinder — diagonal options + no-path
- Test all DiagonalMovement modes
- Test no-path returns `[]`

### BestFirstFinder — custom heuristic + no-path
- Verify heuristic multiplied by 1000000 internally
- Test no-path returns `[]`

### IDAStarFinder — trackRecursion: true
- `new IDAStarFinder({ trackRecursion: true })` — verify `node.tested` set during search
