'use strict';

const through = require('through2');
const MarkdownIt = require('markdown-it');
const defaults = {
    html: true,
    linkify: true,
    typographer: true
};

module.exports = function (options) {
    let md;

    if (options && options.constructor.name === MarkdownIt.name) {
        md = options;
    } else {
        options = Object.assign({}, defaults, options || {});
        md = new MarkdownIt(options);
    }

    const markdown = (text) => md.render(text);
    const markdownInline = (text) => md.renderInline(text);

    function run (file, done) {
        file.contents = new Buffer(md.render(file.contents.toString()));
        file.data.markdown = markdown;
        file.data.markdownInline = markdownInline;
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
