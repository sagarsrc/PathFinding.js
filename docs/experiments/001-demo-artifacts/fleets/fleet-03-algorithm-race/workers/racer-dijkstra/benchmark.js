#!/usr/bin/env node
'use strict';

var PF = require('../../../../../../../');
var fs = require('fs');
var path = require('path');
var MAPS = require('./maps');

var RUNS = 1000;

function buildGrid(mapDef) {
    var matrix = [];
    for (var r = 0; r < mapDef.rows; r++) {
        matrix.push(new Array(mapDef.cols).fill(0));
    }
    mapDef.walls.forEach(function(w) {
        matrix[w[1]][w[0]] = 1;
    });
    return new PF.Grid(mapDef.cols, mapDef.rows, matrix);
}

function countExplored(grid) {
    var count = 0;
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            if (grid.getNodeAt(x, y).closed) count++;
        }
    }
    return count;
}

function runBenchmark(mapDef) {
    var finder = new PF.DijkstraFinder();

    // single run to get path + nodes explored
    var grid = buildGrid(mapDef);
    var path = finder.findPath(mapDef.startX, mapDef.startY, mapDef.endX, mapDef.endY, grid);
    var nodesExplored = countExplored(grid);
    var pathLength = path.length;

    // timing: average over RUNS
    var start = process.hrtime.bigint();
    for (var i = 0; i < RUNS; i++) {
        var g = buildGrid(mapDef);
        var f = new PF.DijkstraFinder();
        f.findPath(mapDef.startX, mapDef.startY, mapDef.endX, mapDef.endY, g);
    }
    var elapsed = process.hrtime.bigint() - start;
    var avgMs = Number(elapsed) / 1e6 / RUNS;

    return {
        map: mapDef.name,
        pathLength: pathLength,
        nodesExplored: nodesExplored,
        avgTimeMs: avgMs.toFixed(4)
    };
}

var results = [
    runBenchmark(MAPS.sparse),
    runBenchmark(MAPS.spiral)
];

// Print to console
results.forEach(function(r) {
    console.log('\n=== Map: ' + r.map + ' ===');
    console.log('Path length   : ' + r.pathLength);
    console.log('Nodes explored: ' + r.nodesExplored);
    console.log('Avg time (ms) : ' + r.avgTimeMs + ' (over ' + RUNS + ' runs)');
});

// Write results.md
var outDir = path.join(__dirname, 'output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

var md = '# Dijkstra Benchmark Results\n\n';
md += 'Algorithm: **Dijkstra** (zero-heuristic A\\*)\n';
md += 'Runs per map: **' + RUNS + '**\n\n';

results.forEach(function(r) {
    md += '## Map: ' + r.map + '\n\n';
    md += '| Metric | Value |\n';
    md += '|--------|-------|\n';
    md += '| Path length (nodes) | ' + r.pathLength + ' |\n';
    md += '| Nodes explored | ' + r.nodesExplored + ' |\n';
    md += '| Avg execution time | ' + r.avgTimeMs + ' ms |\n\n';
});

fs.writeFileSync(path.join(outDir, 'results.md'), md);
console.log('\nResults saved to output/results.md');
