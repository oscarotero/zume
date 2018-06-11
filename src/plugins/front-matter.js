const { Transform } = require('stream');
const matter = require('front-matter');

module.exports = function(options = {}) {
    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            try {
                const data = matter(file.contents.toString());

                file.contents = Buffer.from(data.body);
                file.data = Object.assign({}, options, data.attributes);
            } catch (error) {
                console.error(error);
                file.data = {};
                file.error = error;
            }

            done(null, file);
        }
    });
};
