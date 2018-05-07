const { Transform } = require('stream');
const ejs = require('ejs');
const ejsLint = require('ejs-lint');
const path = require('path');
const defaults = {
    delimiter: '?',
    outputFunctionName: 'echo'
};

module.exports = function(options = {}) {
    options = Object.assign({}, defaults, options);

    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            const locals = Object.assign(
                {},
                options.locals || {},
                file.data || {}
            );

            if (file.error) {
                file.contents = renderError(file.error, file.errorExtra);
                return done(null, file);
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
                return done(null, file);
            }

            ejs.renderFile(template, locals, options, function(err, result) {
                if (err) {
                    console.error(err);
                }

                file.contents = new Buffer(result);

                done(null, file);
            });
        }
    });
};

function renderError(error, extra) {
    return new Buffer(
        ejs.render(`
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
</html>`)
    );
}
