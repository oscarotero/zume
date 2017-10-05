'use strict';

const through = require('through2');
const yaml = require('js-yaml');

module.exports = function (options) {
    options = options || {};

    function run (file, done) {
        try {
            const data = yaml.load(file.contents.toString());

            file.data = Object.assign({}, options, data);
        } catch (error) {
            console.error(error);
            file.data = {}
        }

        file.contents = new Buffer('');
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}