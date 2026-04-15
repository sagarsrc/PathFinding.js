/**
 * Metrics — captures statistics from a completed pathfinding run.
 */

var Util = require('../core/Util');

var Metrics = {
    /**
     * Build a run record from raw pathfinding output.
     *
     * @param {string} algorithm  - Finder class name (e.g. 'AStarFinder')
     * @param {Array}  path       - Array of [x, y] pairs returned by findPath
     * @param {number} timeMs     - Wall-clock time in milliseconds
     * @param {number} nodesExplored - Count of nodes opened/tested during search
     * @returns {Object} RunRecord
     */
    captureRun: function(algorithm, path, timeMs, nodesExplored) {
        return {
            algorithm:     algorithm,
            pathLength:    Util.pathLength(path),
            nodesExplored: nodesExplored,
            timeMs:        timeMs,
            timestamp:     Date.now()
        };
    }
};

module.exports = Metrics;
