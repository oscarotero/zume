'use strict';

const through = require('through2');
const yaml = require('js-yaml');

module.exports = function (options) {
    options = options || {};

    function run (file, done) {
        const data = yaml.load(file.contents.toString());

        file.contents = new Buffer('');
        file.data = Object.assign({}, options, data);
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
