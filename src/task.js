'use strict';

const gulp = require('gulp');

class Task {
    constructor (zume, dir) {
        this.zume = zume;
        this.dir = dir || '';
        this.watch = [];
    }

    src(pattern) {
        if (Array.isArray(pattern)) {
            return pattern.map((pattern) => this.zume.src(this.dir, pattern));
        }

        return this.zume.src(this.dir, pattern);
    }

    dest() {
        return gulp.dest(this.zume.dest(this.dir));
    }
}

module.exports = Task;
