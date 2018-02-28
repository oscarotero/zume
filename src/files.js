const Task = require('./task');

class Files extends Task {
    constructor(zume, options) {
        options = Object.assign({
            pattern: '**',
            incremental: true
        }, options);

        options.watchPattern = options.watchPattern || options.pattern;

        super(zume, options);
    }
}

module.exports = Files;
