'use strict';

const gulp = require('gulp');

class Task {
    constructor (zume) {
        this.zume = zume;
        this.watchPaths = [];
    }

    watch(task) {
        return this.zume.watch(this.watchPaths, task);
    }
}

module.exports = Task;
