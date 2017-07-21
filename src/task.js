'use strict';

const gulp = require('gulp');

class Task {
    constructor (zume, dir) {
        this.zume = zume;
        this.dir = dir || '';
        this.watch = [];
    }

    src(pattern) {
        let src;

        if (Array.isArray(pattern)) {
            src = pattern.map((pattern) => this.zume.src(this.dir, pattern));
        } else {
            src = this.zume.src(this.dir, pattern);
        }

        this.stream = gulp.src(src);

        return this;
    }

    pipe(plugin) {
        this.stream.pipe(plugin);

        return this;
    }

    dest(done) {
        if (done) {
            this.stream.on('end', function () { done(); });
        }

        this.pipe(gulp.dest(this.zume.dest(this.dir)));
        this.pipe(this.zume.refresh());

        return this;
    }

    watchSrc(pattern) {
        if (Array.isArray(pattern)) {
            this.watch = this.watch.concat(
                pattern.map((pattern) => this.zume.src(this.dir, pattern))
            );
            return;
        }

        return this.watch.push(this.zume.src(this.dir, pattern));
    }
}

module.exports = Task;
