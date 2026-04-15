/**
 * Scorer — score card display and run comparison drawer.
 *
 * Depends on: RunStore, Metrics (inline-ported for browser use)
 * Does NOT require Node.js modules; duplicates minimal logic for browser.
 */

var Scorer = (function() {

    // ── Minimal in-browser RunStore ────────────────────────────────────
    var STORAGE_KEY = 'pf_runs';
    var _counter = 0;

    function _read() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }

    function _write(runs) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(runs)); } catch (e) {}
    }

    function saveRun(record) {
        var runs = _read();
        var saved = {};
        for (var k in record) {
            if (record.hasOwnProperty(k)) saved[k] = record[k];
        }
        saved.id = String(Date.now()) + '_' + (++_counter);
        runs.push(saved);
        _write(runs);
        return saved;
    }

    function loadRuns() { return _read(); }

    function clearRuns() {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }

    function deleteRun(id) {
        _write(_read().filter(function(r) { return r.id !== id; }));
    }

    // ── Metrics ────────────────────────────────────────────────────────
    function pathLength(path) {
        var len = 0;
        for (var i = 1; i < path.length; i++) {
            var dx = path[i][0] - path[i-1][0];
            var dy = path[i][1] - path[i-1][1];
            len += Math.sqrt(dx*dx + dy*dy);
        }
        return len;
    }

    function captureRun(algorithm, path, timeMs, nodesExplored) {
        return {
            algorithm:     algorithm,
            pathLength:    Math.round(pathLength(path) * 100) / 100,
            nodesExplored: nodesExplored,
            timeMs:        parseFloat(timeMs),
            timestamp:     Date.now()
        };
    }

    // ── DOM helpers ────────────────────────────────────────────────────
    function fmt(n) {
        return (n === undefined || n === null) ? '—' : String(n);
    }

    function fmtTime(ms) {
        return parseFloat(ms).toFixed(4) + ' ms';
    }

    function fmtDate(ts) {
        var d = new Date(ts);
        return d.toLocaleTimeString();
    }

    // ── Score card ─────────────────────────────────────────────────────
    function showScoreCard(record) {
        var $card = $('#score_card');
        $card.find('.sc-algorithm').text(record.algorithm);
        $card.find('.sc-path-length').text(fmt(record.pathLength));
        $card.find('.sc-nodes').text(fmt(record.nodesExplored));
        $card.find('.sc-time').text(fmtTime(record.timeMs));
        $card.find('.sc-save-btn').off('click').on('click', function() {
            var saved = saveRun(record);
            refreshDrawer();
            $card.find('.sc-saved-msg').text('Saved #' + saved.id.split('_')[1]).show();
            setTimeout(function() { $card.find('.sc-saved-msg').hide(); }, 2000);
        });
        $card.show();
    }

    // ── Comparison drawer ──────────────────────────────────────────────
    function renderRunRow(run) {
        return $('<tr>')
            .append($('<td>').text(fmtDate(run.timestamp)))
            .append($('<td>').text(run.algorithm))
            .append($('<td>').text(fmt(run.pathLength)))
            .append($('<td>').text(fmt(run.nodesExplored)))
            .append($('<td>').text(fmtTime(run.timeMs)))
            .append($('<td>').append(
                $('<button>').addClass('del-run-btn').text('✕')
                    .data('run-id', run.id)
            ));
    }

    function refreshDrawer() {
        var runs = loadRuns();
        var $tbody = $('#comparison_drawer tbody');
        $tbody.empty();
        if (runs.length === 0) {
            $tbody.append($('<tr>').append(
                $('<td colspan="6">').css('text-align','center').text('No saved runs yet')
            ));
        } else {
            runs.forEach(function(r) { $tbody.append(renderRunRow(r)); });
        }
    }

    // ── Init ───────────────────────────────────────────────────────────
    function init() {
        // Toggle drawer
        $('#show_comparison').on('click', function() {
            refreshDrawer();
            $('#comparison_drawer').toggle();
        });

        // Clear all
        $('#clear_runs_btn').on('click', function() {
            clearRuns();
            refreshDrawer();
        });

        // Delete single run (delegated)
        $('#comparison_drawer').on('click', '.del-run-btn', function() {
            deleteRun($(this).data('run-id'));
            refreshDrawer();
        });

        // Hide score card
        $('#score_card .sc-close').on('click', function() {
            $('#score_card').hide();
        });
    }

    return {
        init:         init,
        captureRun:   captureRun,
        showScoreCard: showScoreCard,
        refreshDrawer: refreshDrawer,
        loadRuns:     loadRuns,
        clearRuns:    clearRuns
    };

})();
