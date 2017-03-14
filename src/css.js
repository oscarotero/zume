'use strict';

const gulp = require('gulp');
const Task = require('./task');

class Css extends Task {
    src() {
        this.watchPaths.push(this.zume.src('css/*.css'));
        return this.zume.src('css/**/*.css');
    }

    dest() {
        return gulp.dest(this.zume.dest('css'));
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
