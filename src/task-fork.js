const { Transform } = require('stream');

class TaskFork {
    constructor(task, handler) {
        this.task = task;

        if (typeof handler === 'function') {
            const files = [];
            this.files = files;

            this.task.pipe(
                new Transform({
                    objectMode: true,
                    transform(file, encoding, done) {
                        if (handler(file)) {
                            done(null, file);
                        } else {
                            files.push(file);
                            done();
                        }
                    }
                })
            );
        } else if (handler instanceof task.constructor) {
            this.dest = handler;
        }
    }

    exec(fnName, options) {
        this.task[fnName](options);

        return this;
    }

    pipe(plugin) {
        this.task.pipe(plugin);

        return this;
    }

    each(fn, data = {}) {
        this.task.each(fn, data);

        return this;
    }

    merge() {
        //Mode merge with the same stream
        if (this.files) {
            const files = this.files;

            return this.task.pipe(
                new Transform({
                    objectMode: true,
                    transform(file, encoding, done) {
                        done(null, file);
                    },
                    flush(done) {
                        files.forEach(file => this.push(file));
                        done();
                    }
                })
            );
        }

        //Mode merge with other stream
        const task = this.task;

        this.dest.watch = task.watch.concat(this.dest.watch);
        task.watch = this.dest.watch;

        return this.dest.pipe(
            new Transform({
                objectMode: true,
                transform(file, encoding, done) {
                    done(null, file);
                },
                flush(selfDone) {
                    const files = [];
                    const dest = this;
                    task.pipe(
                        new Transform({
                            objectMode: true,
                            transform(file, encoding, done) {
                                files.push(file);
                                done();
                            },
                            flush(done) {
                                files.forEach(file => dest.push(file));
                                done();
                                selfDone();
                            }
                        })
                    );
                }
            })
        );
    }
}

module.exports = TaskFork;
