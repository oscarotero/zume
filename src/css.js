const Task = require('./task');
const TaskFork = require('./task-fork');
const merge = require('merge-options');
const defaults = {
    base: 'css',
    watchPattern: '**/*.css',
    pattern: '*.css'
};

class CssFork extends TaskFork {
    postcss(options) {
        return this.exec('postcss', options);
    }
}

class Css extends Task {
    constructor(zume, options) {
        super(zume, merge(defaults, options));
        this.reload = '*.css';
    }

    fork(fn) {
        return new CssFork(this, fn);
    }

    postcss(options) {
        options = options || {};
        options.zume = this.zume;

        return this.pipe(require('./plugins/postcss')(options));
    }
}

module.exports = Css;
