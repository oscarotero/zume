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

        if (!locals.template) {
            return done();
        }

        locals.content = file.contents.toString();

        const template = path.join(options.root, locals.template);
        const err = ejsLint(ejs.fileLoader(template).toString(), options);

        if (err) {
            console.error(template, err);
            file.contents = new Buffer(`
<html>
<body>
<pre>
${template}
${err.toString()}
</pre>
</body>
</html>`);

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
