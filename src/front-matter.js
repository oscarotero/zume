'use strict';

const through = require('through2');
const matter = require('front-matter');

module.exports = function (zume, options) {
    options = options || {};

    function run (file, done) {
        const data = matter(file.contents.toString());

        file.contents = new Buffer(data.body);
        file.data = Object.assign({}, options, data.attributes);
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
