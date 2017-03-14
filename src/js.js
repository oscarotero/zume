'use strict';

const gulp = require('gulp');
const Task = require('./task');

class Js extends Task {
    src() {
        this.watchPaths.push(this.zume.src('js/*.js'));
        return this.zume.src('js/**/*.js');
    }

    dest() {
        return gulp.dest(this.zume.dest('css'));
    }

    webpack(options) {
        options = options || {};

        if (!this.zume.dev) {
            options.plugins = options.plugins || [];
            options.plugins.push(new webpack.optimize.DedupePlugin());
            options.plugins.push(new webpack.optimize.UglifyJsPlugin());
        }

        options.context = this.zume.src('js');
        options.output = options.output || {};
        options.output.publicPath = this.zume.url('js');
        options.output.path = this.zume.dest('js');

        return require('./plugins/webpack')(options);
    }
}

module.exports = Js;
