const through = require('through2');
const ejs = require('ejs');
const defaults = {
    delimiter: '?'
};

module.exports = function (zume, options) {
    options = Object.assign({}, defaults, options || {});
    options.root = options.root || zume.src('templates');

    function run (file, done) {
        const locals = Object.assign({}, file.data || {});

        if (!locals.template) {
            return done(file);
        }

        locals.content = file.contents.toString();
        locals.zume = zume;

        ejs.renderFile(zume.src('templates', locals.template), locals, options, function (err, result) {
            if (err) {
                console.error(err);
            }

            file.contents = new Buffer(result);

            done(file);
        });
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
