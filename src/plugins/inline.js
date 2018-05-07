const { Transform } = require('stream');
const inlineSource = require('inline-source');

module.exports = function(options = {}) {
    const rootpath = options.dest ? options.zume.dest() : options.zume.src();

    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            try {
                inlineSource(
                    file.contents.toString(),
                    {
                        rootpath: rootpath,
                        htmlpath: file.path
                    },
                    function(error, html) {
                        if (error) {
                            console.error(error);
                            file.data = {};
                            file.error = error;
                        } else {
                            file.contents = new Buffer(html || '');
                        }

                        done(null, file);
                    }
                );
            } catch (error) {
                console.error(error);
                file.data = {};
                file.error = error;
                done(null, file);
            }
        }
    });
};
