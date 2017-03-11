const through = require('through2');
const path = require('path');

module.exports = function () {
    function run (file, done) {
        let newPath = file.path.replace(/\.md$/, '');

        if (path.basename(newPath) !== 'index') {
            newPath = path.join(newPath, 'index');
        }

        file.path = newPath + '.html';
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}
