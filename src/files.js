const Task = require('./task');
const merge = require('merge-options');
const defaults = {
    pattern: '**',
    incremental: true
};

class Files extends Task {
    constructor(zume, options) {
        super(zume, merge(defaults, options));
    }
}

module.exports = Files;
