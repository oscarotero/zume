const { Transform } = require('stream');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const attrs = require('markdown-it-attrs');
const container = require('markdown-it-container');
const defaults = {
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return `<pre><code class="hljs ${lang}">${
                hljs.highlight(lang, code).value
            }</code></pre>`;
        }

        return '';
    }
};

module.exports = function(options) {
    const md = new MarkdownIt(defaults);

    ['section', 'figure', 'figcaption', 'header', 'footer'].forEach(name => {
        md.use(container, name, {
            validate: params =>
                params.trim() === name || params.trim().startsWith(`${name} `),
            render: (tokens, idx, _options, env, self) => {
                tokens[idx].tag = name;
                return self.renderToken(tokens, idx, _options, env, self);
            }
        });
    });

    md.use(container, 'div');
    md.use(attrs);

    if (typeof options === 'function') {
        options(md);
    }

    const markdown = text => (text ? md.render(text) : '');
    const markdownInline = text => (text ? md.renderInline(text) : '');

    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            file.contents = Buffer.from(md.render(file.contents.toString()));
            file.data.markdown = markdown;
            file.data.markdownInline = markdownInline;
            done(null, file);
        }
    });
};
