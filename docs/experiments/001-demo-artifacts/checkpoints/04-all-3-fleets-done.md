---
title: "all-3-fleets-done"
experiment: 001-demo-artifacts
created: "2026-04-15 18:16 UTC"
---

```mermaid
graph LR
    A[Fleet 1: test blitz] -->|done, $5.98| B[Fleet 2: scenario builder]
    B -->|done, $2.13| C[Fleet 3: algorithm race]
    C -->|done, ~$1| D[Next: optimize Dijkstra]
```

## What
- **Fleet 01** (dag-fleet, 9 workers): test coverage blitz. 6 new test files, minor source fixes. $5.98. Committed `dc50c9b`.
- **Fleet 02** (iterative-fleet, 6 workers): scenario builder. LGTM iteration 2. Built `visual/scenario-builder.html` with grid canvas, controls, scorer, presets, save/load. $2.13. Committed `f7c15f7`.
- **Fleet 03** (dag-fleet, 3 workers): A* vs Dijkstra race on sparse + spiral maps. Leaderboard produced. ~$1. Not yet committed.
- Fixed spiral preset in `visual/js/scenario-controls.js` — old one was broken (unsealed inner ring).
- Fixed `View.init()` in `visual/js/view.js` — was stacking SVG canvases on reinit (preset load stacking bug).

## Key Takeaways
- **Sparse map**: A* wins clearly — 121 nodes vs 203 (Dijkstra). Heuristic cuts search space ~40%.
- **Spiral map**: Both explore 132 nodes (identical). Dijkstra actually faster in wall-clock (no heuristic overhead). But A* still "wins" or ties on nodes.
- Spiral is the ideal map to showcase Dijkstra optimization — heuristic gives zero benefit, so any Dijkstra optimization has maximum impact.
- Iterative fleet reviewer MUST write verdict to `iterations/<N>/review.md` — discovered hard way in fleet 02.
- Worker prompts should be minimal — no file ownership, no absolute paths. Workers discover codebase.

## Issues
- Fleet 02 took 3 launch attempts (reviewer verdict bug, trailing comma in JSON)
- `View.init()` stacking SVGs — fixed by calling `paper.remove()` + clearing startNode/endNode refs
- VM nearly crashed from RAM — not fleet-related, Cursor server + extension hosts eating ~15GB

## Decisions
- Two-map race (sparse + spiral) instead of one — shows A* advantage AND where it disappears
- Leaderboard just reports results, no optimization suggestions baked in — keep fleet 03 clean
- Spiral map: start (0,0), end (7,7) center, 3-layer spiral, path length 117

## Next
1. Commit fleet 03 results
2. Showcase: optimize Dijkstra to beat A* on spiral map. Avenues to explore:
   - Bidirectional search (search from both ends, meet in middle)
   - Early termination (stop when target dequeued from queue)
   - BFS equivalence on unit-cost grids (skip priority queue, use simple queue)
   - Spatial pruning (bounding box, skip nodes far from goal region)
3. Run optimized Dijkstra on spiral map, compare against vanilla A*
4. Integrate winning optimization into scenario builder as a selectable algorithm
5. Files to know:
   - `src/finders/DijkstraFinder.js` — current Dijkstra implementation
   - `src/finders/AStarFinder.js` — A* (Dijkstra extends this with heuristic=null)
   - `visual/scenario-builder.html` — the demo page
   - `visual/js/scenario-controls.js` — algorithm list + presets
