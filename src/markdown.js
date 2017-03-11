'use strict';

const through = require('through2');
const MarkdownIt = require('markdown-it');
const defaults = {
    html: true,
    linkify: true,
    typographer: true
};

module.exports = function (zume, options) {
    let md;

    if (options instanceof MarkdownIt) {
        md = options;
    } else {
        options = Object.assign({}, defaults, options || {});
        md = new MarkdownIt(options);
    }

    function run (file, done) {
        file.contents = new Buffer(md.render(file.contents.toString()));
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
