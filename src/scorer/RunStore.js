/**
 * RunStore — persists pathfinding run records to a storage backend.
 *
 * Storage must implement: getItem(key), setItem(key, val), removeItem(key).
 * Defaults to an in-memory store when none is provided (browser: pass localStorage).
 */

var STORAGE_KEY = 'pf_runs';

function MemStorage() {
    this._data = {};
}
MemStorage.prototype.getItem = function(key) {
    return this._data.hasOwnProperty(key) ? this._data[key] : null;
};
MemStorage.prototype.setItem = function(key, val) {
    this._data[key] = String(val);
};
MemStorage.prototype.removeItem = function(key) {
    delete this._data[key];
};

function RunStore(storage) {
    this._storage = storage || new MemStorage();
    this._counter = 0;
}

RunStore.prototype._read = function() {
    var raw = this._storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch (e) { return []; }
};

RunStore.prototype._write = function(runs) {
    this._storage.setItem(STORAGE_KEY, JSON.stringify(runs));
};

/**
 * Save a run record. Assigns a unique id and returns the stored record.
 */
RunStore.prototype.saveRun = function(record) {
    var runs = this._read();
    var id = String(Date.now()) + '_' + (++this._counter);
    var saved = {};
    for (var k in record) {
        if (record.hasOwnProperty(k)) saved[k] = record[k];
    }
    saved.id = id;
    runs.push(saved);
    this._write(runs);
    return saved;
};

/**
 * Return all saved runs (oldest first).
 */
RunStore.prototype.loadRuns = function() {
    return this._read();
};

/**
 * Return a single run by id, or null if not found.
 */
RunStore.prototype.getRunById = function(id) {
    var runs = this._read();
    for (var i = 0; i < runs.length; i++) {
        if (runs[i].id === id) return runs[i];
    }
    return null;
};

/**
 * Delete a single run by id. No-op if id not found.
 */
RunStore.prototype.deleteRun = function(id) {
    var runs = this._read();
    var filtered = runs.filter(function(r) { return r.id !== id; });
    this._write(filtered);
};

/**
 * Remove all saved runs.
 */
RunStore.prototype.clearRuns = function() {
    this._storage.removeItem(STORAGE_KEY);
};

module.exports = RunStore;
