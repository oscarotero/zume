'use strict';

const through = require('through2');
const webpack = require('webpack');
const File = require('vinyl');
const path = require('path');
const MemoryFS = require('memory-fs');
const defaults = {
    entry: {},
    output: {
        filename: '[name].js'
    },
    node: false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};

module.exports = function (options) {
    const opt = Object.assign(
        {},
        defaults,
        (typeof options.options === 'object') ? options.options : {}
    );

    if (!options.zume.dev) {
        opt.plugins = opt.plugins || [];
        opt.plugins.push(new webpack.optimize.DedupePlugin());
        opt.plugins.push(new webpack.optimize.UglifyJsPlugin());
    } else {
        opt.devtool = 'source-map';
    }

    opt.context = options.zume.src(options.dir);
    opt.output.publicPath = options.zume.url(options.dir) + '/';
    opt.output.path = options.zume.dest(options.dir);

    if (typeof options.options === 'function') {
        options.options(opt);
    }

    function run (file, done) {
        const name = path.basename(file.path, '.js');
        opt.entry[name] = './' + file.relative;
        done();
    }

    function execute (done) {
        if (!Object.keys(opt.entry).length) {
            return done();
        }

        const compiler = webpack(opt);
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
