'use strict';

const through = require('through2');
const inline = require('inline-source');

module.exports = function (options) {
    options = options || {};

    function run (file, done) {
        inline(file.contents.toString(), options, function (err, html) {
            if (err) {
                console.error(err);
                return done();
            }

            file.contents = new Buffer(html);
            done(file);
        });
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
