const through = require('through2');
const MarkdownIt = require('markdown-it');

module.exports = function (md) {
    md = md || new MarkdownIt();

    return through.obj(function (file, encoding, callback) {
        callback(null, run(file, md));
    });
}

function run (file, md) {
    file.contents = new Buffer(md.render(String(file.contents)));
    return file;
}
