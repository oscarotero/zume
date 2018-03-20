const through = require('through2');

class TaskFork {
    constructor(task, filter) {
        this.task = task;
        this.restore = [];

        this.task.pipe(
            through.obj((file, encoding, callback) => {
                if (filter(file)) {
                    callback(null, file);
                } else {
                    this.restore.push(file);
                    callback();
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
            through.obj(
                function(file, encoding, callback) {
                    callback(null, file);
                },
                function(done) {
                    files.forEach(file => this.push(file));
                    done();
                }
            )
        );
    }
}

module.exports = TaskFork;
