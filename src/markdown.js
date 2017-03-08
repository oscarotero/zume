const through = require('through2');
const MarkdownIt = require('markdown-it');

module.exports = function (config) {
    const md = new MarkdownIt(config.get('markdown', {
        html: true,
        linkify: true,
        typographer: true
    }));

    function run (file, done) {
        file.contents = new Buffer(md.render(file.contents.toString()));
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
