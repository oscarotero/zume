const through = require('through2');
const minify = require('html-minifier').minify;

module.exports = function (config) {
    const options = config.get('html-minify', {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
    });

    function run (file, done) {
        file.contents = new Buffer(minify(file.contents.toString(), options));
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
