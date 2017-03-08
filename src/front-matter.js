const through = require('through2');
const matter = require('front-matter');

module.exports = function (config) {
    function run (file, done) {
        const data = matter(file.contents.toString());

        file.contents = new Buffer(data.body);
        file.data = config.get('metadata', data.attributes);
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
