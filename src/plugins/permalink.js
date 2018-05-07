const { Transform } = require('stream');
const path = require('path');
const merge = require('merge-options');
const defaults = {
    pretty: true
};

module.exports = function(options = {}) {
    options = merge(defaults, options);

    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            if (file.data && file.data.permalink) {
                file.path = path.join(
                    path.dirname(file.path),
                    file.data.permalink
                );
            } else {
                let newPath = file.path.replace(/\.[\w]+$/, '');

                if (options.pretty && path.basename(newPath) !== 'index') {
                    newPath = path.join(newPath, 'index');
                }

                file.path = `${newPath}.html`;
            }

            done(null, file);
        }
    });
};
