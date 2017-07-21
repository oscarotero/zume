'use strict';

const Task = require('./task');

class Files extends Task {
    src(pattern, watchPattern) {
        this.watchSrc(watchPattern || pattern || '**');

        return super.src(pattern || '**');
    }
}

module.exports = Files;
