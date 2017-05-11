'use strict';

const gulp = require('gulp');
const Task = require('./task');

class Css extends Task {
    constructor (zume, dir) {
        super(zume, dir || 'css');
    }

    src(pattern, watchPattern) {
        this.watchSrc(watchPattern || '**/*.css');

        return super.src(pattern || '*.css');
    }

    stylecow(options) {
        options = options || {};

        if (!this.zume.dev) {
            options.code = 'minify';
        }

        return require('./plugins/stylecow')(options);
    }
}

module.exports = Css;
