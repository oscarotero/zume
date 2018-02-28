const through = require('through2');
const path = require('path');
const defaults = {
    pretty: true
};

module.exports = function (options = {}) {
    options = Object.assign({}, defaults, options);

    function run (file, done) {
        if (file.data && file.data.permalink) {
            file.path = path.join(path.dirname(file.path), file.data.permalink);
        } else {
            let newPath = file.path.replace(/\.[\w]+$/, '');

            if (options.pretty && path.basename(newPath) !== 'index') {
                newPath = path.join(newPath, 'index');
            }

            file.path = `${newPath}.html`;
        }

        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
