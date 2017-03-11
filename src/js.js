'use strict';

const webpack = require('webpack');
const defaults = {
    entry: {
        main: './main.js'
    },
    output: {
        filename: '[name].js'
    }
};

module.exports = function (zume, options) {
    options = Object.assign({}, defaults, options || {});

    if (!zume.get('dev')) {
        options.plugins = options.plugins || [];
        options.plugins.push(new webpack.optimize.DedupePlugin());
        options.plugins.push(new webpack.optimize.UglifyJsPlugin());
    }

    options.context = zume.src('js');
    options.output.publicPath = zume.url('js');
    options.output.path = zume.dest('js');

    webpack(options, function (err) {
        if (err) {
            console.error(err);
        }
    });
}
