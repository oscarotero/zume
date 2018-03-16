const path = require('path');
const through = require('through2');
const merge = require('merge-options');
const defaults = {
    base: ''
};

class Task {
    constructor(zume, options = {}) {
        this.zume = zume;
        this.options = merge(
            defaults,
            { watchPattern: options.pattern },
            options
        );
        this.watch = [];
        this.reload = '*';

        if (this.options.src) {
            if (!path.isAbsolute(this.options.src)) {
                throw new Error(
                    `"src" must be an absolute path (${this.options.src})`
                );
            }

            this.cwd = path.join(this.options.src, this.options.base);
        } else {
            this.cwd = this.zume.src(this.options.base);
        }
    }

    src() {
        if (this.options.watchPattern) {
            this.watchSrc(this.options.watchPattern);
        }

        let src;
        if (Array.isArray(this.options.pattern)) {
            src = this.options.pattern.map(pattern =>
                path.join(this.cwd, pattern)
            );
        } else {
            src = path.join(this.cwd, this.options.pattern);
        }

        this.stream = this.zume.gulp().src(src, {
            base: this.cwd,
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

    dest(dir) {
        if (!dir || !path.isAbsolute(dir)) {
            dir = this.zume.dest(dir || this.options.base);
        } else {
            dir = path.join(dir, this.options.base);
        }

        return new Promise((resolve, reject) => {
            this.pipe(this.zume.gulp().dest(dir));

            this.stream.on('end', () => {
                if (this.reload) {
                    this.zume.sync.reload(this.reload);
                }

                resolve();
            });
        });
    }

    watchSrc(pattern) {
        if (Array.isArray(pattern)) {
            this.watch = this.watch.concat(
                pattern.map(pattern => path.join(this.cwd, pattern))
            );
            return;
        }

        return this.watch.push(path.join(this.cwd, pattern));
    }
}

module.exports = Task;
