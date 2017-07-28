'use strict';

const Task = require('./task');

class Js extends Task {
    constructor(zume, dir) {
        super(zume, dir || 'js');
        this.reload = '*.js';
    }

    src(pattern, watchPattern) {
        this.watchSrc(watchPattern || '**/*.js');

        return super.src(pattern || '*.js');
    }

    webpack(options) {
        options = options || {};

        if (!this.zume.dev) {
            options.plugins = options.plugins || [];
            options.plugins.push(new webpack.optimize.DedupePlugin());
            options.plugins.push(new webpack.optimize.UglifyJsPlugin());
        } else {
            options.devtool = 'source-map';
        }

        options.context = this.zume.src(this.dir);
        options.output = options.output || {};
        options.output.publicPath = this.zume.url(this.dir) + '/';
        options.output.path = this.zume.dest(this.dir);

        return this.pipe(require('./plugins/webpack')(options));
    }
}

module.exports = Js;
