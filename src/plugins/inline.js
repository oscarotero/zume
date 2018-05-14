const { Transform } = require('stream');
const { inlineSource } = require('inline-source');

module.exports = function(options = {}) {
    const rootpath = options.dest ? options.zume.dest() : options.zume.src();

    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            inlineSource(file.contents.toString(), {
                rootpath: rootpath,
                htmlpath: file.path
            })
                .then(html => {
                    file.contents = new Buffer(html || '');
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
