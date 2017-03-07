const through = require('through2');
const path = require('path');

module.exports = function () {
    return through.obj(function (file, encoding, callback) {
        callback(null, run(file));
    });
}

function run (file) {
    let newPath = file.path.replace(/\.md$/, '');

    if (path.basename(newPath) !== 'index') {
        newPath = path.join(newPath, 'index');
    }

    file.path = newPath + '.html';
    return file;
}
