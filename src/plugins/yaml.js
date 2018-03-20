const { Transform } = require('stream');
const yaml = require('js-yaml');

module.exports = function (options = {}) {
    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            try {
                const data = yaml.load(file.contents.toString());

                file.data = Object.assign({}, options, data);
            } catch (error) {
                console.error(error);
                file.data = {};
                file.error = error;
            }

            file.contents = new Buffer('');
            done(null, file);
        }
    });
}
