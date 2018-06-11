const { Transform } = require('stream');
const { inlineSource } = require('inline-source');

const defaults = {
    compress: false,
    saveRemote: false
};

module.exports = function(options = {}) {
    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            inlineSource(
                file.contents.toString(),
                Object.assign({}, defaults, options, { htmlpath: file.path })
            )
                .then(html => {
                    file.contents = Buffer.from(html || '');
                    done(null, file);
                })
                .catch(error => {
                    console.error(error);
                    file.data = {};
                    file.error = error;
                });
        }
    });
};
