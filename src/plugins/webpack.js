const through = require('through2');
const webpack = require('webpack');
const File = require('vinyl');
const path = require('path');
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
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};

module.exports = function (options = {}) {
    const opt = Object.assign(
        {},
        defaults,
        (typeof options.options === 'object') ? options.options : {}
    );

    if (!options.zume.dev) {
        opt.mode = 'development';
    } else {
        opt.mode = 'production';
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

        compiler.run((err, stats) => {
            if (err) {
                console.error(err);
            }

            Object.keys(stats.compilation.assets).forEach(f =>
                this.push(new File({
                    base: compiler.outputPath,
                    contents: new Buffer(stats.compilation.assets[f]._value),
                    path: path.join(compiler.outputPath, f)
                }))
            );

            done();
        });
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    }, execute);
}
