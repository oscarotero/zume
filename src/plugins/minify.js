'use strict';

const through = require('through2');
const minify = require('html-minifier').minify;
const defaults = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
};

module.exports = function (options) {
    options = Object.assign({}, defaults, options || {});

    function run (file, done) {
        file.contents = new Buffer(minify(file.contents.toString(), options));
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
