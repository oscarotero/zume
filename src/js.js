'use strict';

const through = require('through2');
const webpack = require('webpack');
const File = require('vinyl');
const path = require('path');
const MemoryFS = require('memory-fs');
const defaults = {
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
    options.entry = options.entry || {};

    function run (file, done) {
        const name = path.basename(file.path, '.js');
        options.entry[name] = './' + file.relative;
        done();
    }

    function execute (done) {
        const compiler = webpack(options);
        const fs = new MemoryFS();

        compiler.outputFileSystem = fs;

        compiler.run((err, stats) => {
            if (err) {
                console.error(err);
            }

            Object.keys(stats.compilation.assets).forEach((f) => {
                const dest = stats.compilation.assets[f].existsAt;

                this.push(new File({
                    base: compiler.outputPath,
                    contents: fs.readFileSync(dest),
                    path: dest
                }));
            });

            done();
        });
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    }, execute);
}
