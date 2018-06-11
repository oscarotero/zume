const { Transform } = require('stream');
const cheerio = require('cheerio');
const path = require('path');

module.exports = function(options) {
    if (typeof options === 'function') {
        options = { fn: options };
    }

    options.parser = options.parser || {};

    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            options.parser.xmlMode = path.extname(file.path) !== '.html';

            const $ = cheerio.load(file.contents.toString(), options.parser);
            options.fn($, file);

            if (options.parser.xmlMode) {
                file.contents = Buffer.from($.xml());
            } else {
                file.contents = Buffer.from($.html());
            }

            done(null, file);
        }
    });
};
