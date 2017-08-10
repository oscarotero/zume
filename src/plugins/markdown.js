'use strict';

const through = require('through2');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const defaults = {
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return `<pre><code class="hljs ${lang}">${hljs.highlight(lang, code).value}</code></pre>`;
        }

        return '';
    }
};

module.exports = function (options) {
    let md;

    if (options && options.constructor.name === MarkdownIt.name) {
        md = options;
    } else {
        md = new MarkdownIt(defaults);

        if (typeof options === 'function') {
            options(md);
        }
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
