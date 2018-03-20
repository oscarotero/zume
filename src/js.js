const Task = require('./task');
const TaskFork = require('./task-fork');
const merge = require('merge-options');
const defaults = {
    base: 'js',
    watchPattern: '**/*.js',
    pattern: '*.js'
};

class JsFork extends TaskFork {
    webpack(options) {
        return this.exec('webpack', options);
    }
}

class Js extends Task {
    constructor(zume, options) {
        super(zume, merge(defaults, options));
        this.reload = '*.js';
    }

    fork(fn) {
        return new JsFork(this, fn);
    }

    webpack(options) {
        return this.pipe(
            require('./plugins/webpack')({
                zume: this.zume,
                options: options,
                dir: this.options.base
            })
        );
    }
}

module.exports = Js;
