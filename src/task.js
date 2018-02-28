const gulp = require('gulp');
const through = require('through2');

class Task {
    constructor(zume, options) {
        this.zume = zume;
        this.options = Object.assign({ base: '' }, options);
        this.watch = [];
        this.reload = '*';
    }

    src() {
        if (this.options.watchPattern) {
            this.watchSrc(this.options.watchPattern);
        }

        const base = this.options.src || this.options.base;
        let src;

        if (Array.isArray(this.options.pattern)) {
            src = this.options.pattern.map(pattern =>
                this.zume.src(base, pattern)
            );
        } else {
            src = this.zume.src(base, this.options.pattern);
        }

        this.stream = gulp.src(src, {
            since: this.options.incremental
                ? gulp.lastRun(this.options.task)
                : undefined
        });

        return this;
    }

    pipe(plugin) {
        this.stream = this.stream.pipe(plugin);

        return this;
    }

    each(fn, data = {}) {
        const files = [];

        return this.pipe(
            through.obj(
                function(file, encoding, callback) {
                    fn(file, data);
                    files.push(file);
                    callback();
                },
                function(done) {
                    files.forEach(file => this.push(file));
                    done();
                }
            )
        );
    }

    filter(fn) {
        return this.pipe(
            through.obj(function(file, encoding, callback) {
                if (fn(file)) {
                    callback(null, file);
                } else {
                    callback();
                }
            })
        );
    }

    dest() {
        return new Promise((resolve, reject) => {
            this.pipe(gulp.dest(this.zume.dest(this.options.base)));

            this.stream.on('end', () => {
                if (this.reload) {
                    this.zume.sync.reload(this.reload);
                }

                resolve();
            });
        });
    }

    watchSrc(pattern) {
        const base = this.options.src || this.options.base;

        if (Array.isArray(pattern)) {
            this.watch = this.watch.concat(
                pattern.map(pattern => this.zume.src(base, pattern))
            );
            return;
        }

        return this.watch.push(this.zume.src(base, pattern));
    }
}

module.exports = Task;
