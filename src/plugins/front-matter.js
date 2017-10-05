'use strict';

const through = require('through2');
const matter = require('front-matter');

module.exports = function (options) {
    options = options || {};

    function run (file, done) {
        try {
            const data = matter(file.contents.toString());

            file.contents = new Buffer(data.body);
            file.data = Object.assign({}, options, data.attributes);
        } catch (error) {
            console.error(error);
            file.contents = new Buffer('');
            file.data = {}
        }

        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
