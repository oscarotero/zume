const { Transform } = require('stream');

class TaskFork {
    constructor(task, filter) {
        this.task = task;
        this.restore = [];

        return this.task.pipe(
            new Transform({
                objectMode: true,
                transform(file, encoding, done) {
                    if (filter(file)) {
                        done(null, file);
                    } else {
                        this.restore.push(file);
                        done();
                    }
                }
            })
        );
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
        const files = this.restore;

        return this.task.pipe(
            new Transform({
                objectMode: true,
                flush(done) {
                    files.forEach(file => this.push(file));
                    done();
                }
            })
        );
    }
}

module.exports = TaskFork;
