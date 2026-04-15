# Test Writer 1 — Core: Grid.js, Node.js, Heuristic.js

## Priority 1 (HIGH)

### Grid.clone()
- File: `src/core/Grid.js` → `Grid.prototype.clone`
- Test: clone preserves dimensions, walkability of every node, independence from original (mutate clone, verify original unchanged)

### Grid._buildNodes matrix size mismatch
- File: `src/core/Grid.js` → `_buildNodes`
- Test: `new Grid(5, 5, [[0,0,0]])` must throw `'Matrix size does not fit'`

### Grid.getNeighbors with DiagonalMovement.Always
- File: `src/core/Grid.js` → `getNeighbors`, `d0=d1=d2=d3=true` branch
- Test: node with mixed obstacles, verify all 8 neighbors returned when walkable (even if adjacent cardinal blocked)

### Grid.getNeighbors with DiagonalMovement.OnlyWhenNoObstacles
- File: `src/core/Grid.js` → `getNeighbors`, `d0 = s3 && s0` branch
- Test: diagonal neighbor only returned when BOTH adjacent cardinals walkable

### Heuristic — all 4 functions
- File: `src/core/Heuristic.js`
- Test `manhattan(3, 4)` → 7
- Test `euclidean(3, 4)` → 5
- Test `octile(3, 4)` both branches (dx < dy and dx >= dy)
- Test `chebyshev(3, 4)` → 4
- Test all with `(0, 0)` → 0

## Priority 2 (Medium)

### Grid.getNodeAt direct assertion
- Verify returns correct Node object with matching x, y

### Grid.getNeighbors with invalid diagonal value
- Must throw `'Incorrect value of diagonalMovement'`

### Grid — 1×1 grid
- `new Grid(1, 1)` — `getNeighbors` returns `[]` for the single node

### Grid — all-blocked grid
- 3×3 grid, center node walkable, all others blocked — verify neighbor counts

### Grid.setWalkableAt out-of-bounds
- Verify behavior (TypeError expected)

### Node constructor tests
- `Node(2, 3)` → walkable defaults true
- `Node(2, 3, false)` → walkable is false
- `Node(2, 3, undefined)` → walkable defaults true
