const through = require('through2');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

module.exports = function (options) {
    options = options || {};

    const cache = {};
    const hb = options.handlebars || Handlebars.create();
    const tmplPath = path.join(process.cwd(), options.templates || '');

    return through.obj(function (file, encoding, callback) {
        callback(null, run(file, hb, tmplPath));
    });

    function run (file) {
        const locals = file.data;

        if (typeof locals !== 'object' || !locals.template) {
            return file;
        }

        locals.content = String(file.contents);

        const template = path.join(tmplPath, locals.template);

        if (!cache[template]) {
            cache[template] = hb.compile(fs.readFileSync(template, 'utf8'));
        }

        try {
            file.contents = new Buffer(cache[template](locals));
        } catch (err) {
            console.error(err);
        }

        return file;
    }
}
