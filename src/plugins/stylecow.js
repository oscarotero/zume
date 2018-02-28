const through = require('through2');
const stylecow = require('stylecow-core');
const File = require('vinyl');
const path = require('path');
const plugins = require('stylecow-plugins');
const defaults = {
    "support": {
        "explorer": 10,
        "edge": false,
        "firefox": 39,
        "chrome": 43,
        "safari": 8,
        "opera": false,
        "android": 4.1,
        "ios": 8.1
    },
    "plugins": [
        "base64",
        "bower-loader",
        "npm-loader",
        "calc",
        "color",
        "custom-media",
        "custom-selector",
        "extend",
        "fixes",
        "flex",
        "import",
        "matches",
        "msfilter-background-alpha",
        "msfilter-linear-gradient",
        "msfilter-transform",
        "nested-rules",
        "prefixes",
        "rem",
        "variables",
        "webkit-gradient"
    ],
    "code": "normal",
    "map": "auto"
}

module.exports = function (options = {}) {
    options = Object.assign({}, defaults, options);

    const tasks = new stylecow.Tasks();
    const coder = new stylecow.Coder(options.code);

    if (options.map) {
        coder.sourceMap(options.map);
    }

    if (options.support) {
        tasks.minSupport(options.support);
    }

    tasks.use(plugins(options.plugins));

    if (options.modules) {
        options.modules.forEach(function (module) {
            tasks.use(require(module));
        });
    }

    function run (file, done) {
        try {
            const css = stylecow.parse(file.contents.toString('utf8'), 'Root', null, file.path);
            tasks.run(css);

            const code = coder.run(css, file.relative);
            file.contents = new Buffer(code.css);

            if (code.mapFile) {
                done(file, new File({
                    path: code.mapFile,
                    contents: new Buffer(code.map)
                }));
            } else {
                done(file);
            }
        } catch (error) {
            file.contents = new Buffer(stylecow.cssError(error).toString());
            console.error(error.message);
            done(file);
        }
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file, sourcemap) => {
            if (sourcemap) {
                this.push(sourcemap);
            }
            callback(null, file);
        });
    });
};
