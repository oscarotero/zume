'use strict';

const through = require('through2');
const ejs = require('ejs');
const path = require('path');
const defaults = {
    delimiter: '?'
};

module.exports = function (options) {
    options = Object.assign({}, defaults, options || {});

    function run (file, done) {
        const locals = Object.assign({}, options.locals || {}, file.data || {});

        if (!locals.template) {
            return done(file);
        }

        locals.content = file.contents.toString();

        ejs.renderFile(path.join(options.root, locals.template), locals, options, function (err, result) {
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
