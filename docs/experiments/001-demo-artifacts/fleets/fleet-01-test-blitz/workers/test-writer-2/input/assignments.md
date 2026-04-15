# Test Writer 2 — Util.js + Test Scenarios

## Priority 1 (HIGH)

### Util.backtrace
- File: `src/core/Util.js` → `backtrace`
- Test: build a chain of nodes with `.parent` pointers, verify returned path array is correct order

### Util.biBacktrace
- File: `src/core/Util.js` → `biBacktrace`
- Test: two chains meeting in middle, verify concat + reverse produces correct full path

### Util.pathLength
- File: `src/core/Util.js` → `pathLength`
- Test: known path coords → expected length (manhattan segments + diagonal segments)
- Test: empty path → 0
- Test: single point → 0

### Util.smoothenPath
- File: `src/core/Util.js` → `smoothenPath`
- **BUG**: `lastValidCoord` used without `var` declaration (line ~167) — implicit global, throws in strict mode
- Test: provide a grid + zigzag path, verify smoothed path is valid (all points walkable, line-of-sight between consecutive points)
- Test: empty path and straight-line path (no-op cases)

### Add no-path scenario to test scenarios
- File: `test/PathTestScenarios.js`
- Add scenario: start fully enclosed by walls, no path exists
- Expected: `path.length === 0` for ALL finders

### Add start==end scenario
- File: `test/PathTestScenarios.js`
- Add scenario: startX===endX, startY===endY
- Expected: path is `[[x,y]]` or `[]` depending on finder behavior

## Priority 2 (Medium)

### Util.interpolate — missing branches
- Horizontal line (dy=0): `interpolate(0, 3, 5, 3)`
- Diagonal line: `interpolate(0, 0, 3, 3)`
- Same point: `interpolate(2, 2, 2, 2)`
- Negative direction: `interpolate(5, 5, 0, 0)`

### Util.compressPath edge cases
- Path length 1: single point
- Path length 2: two points

### Util.expandPath — single point
- `expandPath([[3,4]])` → `[[3,4]]`

### Add 1×1 grid scenario
- 1×1 grid, start and end at (0,0)
