const Task = require('./task');
const merge = require('merge-options');
const defaults = {
    base: 'js',
    watchPattern: '**/*.js',
    pattern: '*.js'
};

class Js extends Task {
    constructor(zume, options) {
        super(zume, merge(defaults, options));
        this.reload = '*.js';
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
