const through = require('through2');
const matter = require('front-matter');

module.exports = function (commonData) {
    commonData = commonData || {};

    return through.obj(function (file, encoding, callback) {
        callback(null, run(file, commonData));
    });
}

function run (file, commonData) {
    const data = matter(String(file.contents));

    Object.keys(commonData).forEach((key) => data.attributes[key] = data.attributes[key] || commonData[key]);

    file.contents = new Buffer(data.body);
    file.data = data.attributes;

    return file;
}
