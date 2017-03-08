const through = require('through2');
const ejs = require('ejs');

module.exports = function (config) {
    const options = config.get('templates', {
        delimiter: '?',
        root: config.src('templates')
    });

    options.locals = Object.assign({}, {
        url: function () {
            return config.url.apply(config, arguments);
        }
    }, options.locales || {});

    function run (file, done) {
        const locals = Object.assign({}, file.data || {}, options.locals);

        if (!locals.template) {
            return done(file);
        }

        locals.content = file.contents.toString();

        ejs.renderFile(config.src('templates', locals.template), locals, options, function (err, result) {
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
