const Task = require('./task');
const merge = require('merge-options');
const defaults = {
    base: 'css',
    watchPattern: '**/*.css',
    pattern: '*.css'
};

class Css extends Task {
    constructor(zume, options) {
        super(zume, merge(defaults, options));
        this.reload = '*.css';
    }

    postcss(options) {
        options = options || {};
        options.zume = this.zume;

        return this.pipe(require('./plugins/postcss')(options));
    }
}

module.exports = Css;
