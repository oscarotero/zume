const path = require('path');
const through = require('through2');
const merge = require('merge-options');
const defaults = {
    base: ''
};

class Task {
    constructor(zume, options = {}) {
        this.zume = zume;
        this.options = merge(defaults, { watchPattern: options.pattern }, options);
        this.watch = [];
        this.reload = '*';
    }

    src() {
        if (this.options.watchPattern) {
            this.watchSrc(this.options.watchPattern);
        }

        let base, src;

        if (this.options.src && path.isAbsolute(this.options.src)) {
            base = this.options.src;
        } else {
            base = this.zume.src(this.options.src || this.options.base);
        }

        if (Array.isArray(this.options.pattern)) {
            src = this.options.pattern.map(pattern =>
                path.join(base, pattern)
            );
        } else {
            src = path.join(base, this.options.pattern);
        }

        this.stream = this.zume.gulp().src(src, {
            base: base,
            since: this.options.incremental
                ? this.zume.gulp().lastRun(this.options.task)
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
            this.pipe(this.zume.gulp().dest(this.zume.dest(this.options.base)));

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
