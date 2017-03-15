'use strict';

const gulp = require('gulp');
const Task = require('./task');

class Js extends Task {
    constructor (zume, dir) {
        super(zume, dir || 'js');
    }

    src(pattern) {
        this.watch.push(super.src('**/*.js'));

        return super.src(pattern || '*.js');
    }

    webpack(options) {
        options = options || {};

        if (!this.zume.dev) {
            options.plugins = options.plugins || [];
            options.plugins.push(new webpack.optimize.DedupePlugin());
            options.plugins.push(new webpack.optimize.UglifyJsPlugin());
        }

        options.context = this.zume.src(this.dir);
        options.output = options.output || {};
        options.output.publicPath = this.zume.url(this.dir);
        options.output.path = this.zume.dest(this.dir);

        return require('./plugins/webpack')(options);
    }
}

module.exports = Js;
