'use strict';

const Task = require('./task');

class Css extends Task {
    constructor(zume, options) {
        options = Object.assign({
            base: 'css',
            watchPattern: '**/*.css',
            pattern: '*.css'
        }, options);

        super(zume, options);
        this.reload = '*.css';
    }

    stylecow(options) {
        options = options || {};

        if (!this.zume.dev) {
            options.code = 'minify';
        }

        return this.pipe(require('./plugins/stylecow')(options));
    }
}

module.exports = Css;
