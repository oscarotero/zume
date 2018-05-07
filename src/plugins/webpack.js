const { Transform } = require('stream');
const webpack = require('webpack');
const File = require('vinyl');
const MemoryFS = require('memory-fs');
const path = require('path');
const merge = require('merge-options');
const defaults = {
    entry: {},
    output: {
        filename: '[name].js'
    },
    node: false,
    module: {
        rules: [
            {
                test: /\.jsm$/,
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

module.exports = function(options = {}) {
    const opt = merge(
        defaults,
        {
            mode: options.zume.dev ? 'development' : 'production',
            context: options.zume.src(options.dir),
            output: {
                publicPath: options.zume.url(options.dir) + '/',
                path: options.zume.dest(options.dir)
            }
        },
        options.options
    );

    if (typeof options.options === 'function') {
        options.options(opt);
    }

    const fs = new MemoryFS();

    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            const name = path.basename(file.path, '.js');
            opt.entry[name] = './' + file.relative;
            done();
        },
        flush(done) {
            if (!Object.keys(opt.entry).length) {
                return done();
            }

            const compiler = webpack(opt);
            compiler.outputFileSystem = fs;

            compiler.run((err, stats) => {
                if (err) {
                    console.error(err);
                }

                Object.keys(stats.compilation.assets).forEach(f => {
                    const filename = path.join(compiler.outputPath, f);

                    this.push(
                        new File({
                            base: compiler.outputPath,
                            contents: fs.readFileSync(filename),
                            path: filename
                        })
                    );
                });

                done();
            });
        }
    });
};
