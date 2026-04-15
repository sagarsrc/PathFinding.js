# Algorithm Race Leaderboard

## Shared Map Context

- Grid size: **15x15**
- Wall count: **20**
- Start: **(0, 7)**
- End: **(14, 7)**
- Both algorithms solved the same map and reached the same destination.

## Side-by-Side Comparison

| Metric | A* | Dijkstra | Better |
|---|---:|---:|---|
| Nodes explored | 96 | 201 | **A*** (fewer) |
| Path length | 20 | 20 | **Tie** (same optimal length) |
| Average time over 10 runs (ms) | 0.3228 | 0.660533 | **A*** (faster) |

## Winner

**A\*** wins this race.

A* explores far fewer nodes and finishes in less time while still returning an optimal path of the same length as Dijkstra.

## Why A* Outperforms Dijkstra Here

Dijkstra expands uniformly by cheapest-known distance from the start, so it searches broadly.
A* adds a heuristic estimate of remaining distance to the goal, which focuses exploration toward promising cells and prunes large parts of the search space.
On this map, that guidance cuts expansions from **201** to **96**, which directly reduces runtime.

## Optional Visualization

These results can also be visualized with the Demo 2 scenario builder at:
`/home/sagar/PathFinding.js-fork/visual/scenario/`
