const through = require('through2');
const cheerio = require('cheerio');
const path = require('path');

module.exports = function (options) {
    if (typeof options === 'function') {
        options = {fn: options};
    }

    options.parser = options.parser || {};

    function run (file, done) {
        options.parser.xmlMode = path.extname(file.path) !== '.html';

        const $ = cheerio.load(file.contents.toString(), options.parser);
        options.fn($, file);

        if (options.parser.xmlMode) {
            file.contents = new Buffer($.xml());
        } else {
            file.contents = new Buffer($.html());
        }

        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
