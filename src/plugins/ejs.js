'use strict';

const through = require('through2');
const ejs = require('ejs');
const ejsLint = require('ejs-lint');
const path = require('path');
const defaults = {
    delimiter: '?'
};

module.exports = function (options) {
    options = Object.assign({}, defaults, options || {});

    function run (file, done) {
        const locals = Object.assign({}, options.locals || {}, file.data || {});

        if (file.error) {
            file.contents = renderError(file.error, file.errorExtra);
            return done(file);
        }

        if (!locals.template) {
            return done();
        }

        locals.content = file.contents.toString();

        const template = path.join(options.root, locals.template);
        const err = ejsLint(ejs.fileLoader(template).toString(), options);

        if (err) {
            console.error(template, err);
            file.contents = renderError(err, template);
            return done(file);
        }

        ejs.renderFile(template, locals, options, function (err, result) {
            if (err) {
                console.error(err);
            }

            file.contents = new Buffer(result);

            done(file);
        });
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}

function renderError(error, extra) {
    return new Buffer(ejs.render(`
<html>
    <head>
        <title>Zume error</title>
        <style>
            body { font-family: sans-serif; }
            h1 { color: red; }
            pre { background: #ddd; padding: 8px; }
            small { color: #999; }
        </style>
    </head>
    <body>
        <h1>Error</h1>
        <pre>${error.toString()}</pre>
        <small>${extra || ''}</small>
    </body>
</html>`));
}
