const path = require('path');
const { Transform } = require('stream');
const merge = require('merge-options');
const TaskFork = require('./task-fork');
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
                this.options.src = this.zume.src(this.options.src);
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
        this.stream = this.stream
            .pipe(plugin)
            .on('error', this.logError.bind(this));

        return this;
    }

    each(fn, data = {}) {
        const files = [];

        return this.pipe(
            new Transform({
                objectMode: true,
                transform(file, encoding, done) {
                    fn(file, data);
                    files.push(file);
                    done();
                },
                flush(done) {
                    files.forEach(file => this.push(file));
                    done();
                }
            })
        );
    }

    filter(fn) {
        return this.pipe(
            new Transform({
                objectMode: true,
                transform(file, encoding, done) {
                    if (fn(file)) {
                        done(null, file);
                    } else {
                        done();
                    }
                }
            })
        );
    }

    fork(fn) {
        return new TaskFork(this, fn);
    }

    add(options = {}) {
        options.incremental = false;
        return new TaskFork(this.zume.html(options), this);
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

    logError(err) {
        console.error(`Error from "${this.options.task}" task:`);
        console.error(err.toString());
    }
}

module.exports = Task;
