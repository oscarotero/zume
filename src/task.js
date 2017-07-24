'use strict';

const gulp = require('gulp');
const through = require('through2');

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
        this.stream = this.stream.pipe(plugin);

        return this;
    }

    each(fn, data) {
        data = data || {};
        const files = [];

        return this.pipe(through.obj(function (file, encoding, callback) {
            fn(file, data);
            files.push(file);
            callback();
        }, function (done) {
            files.forEach(file => this.push(file));
            done();
        }));
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
