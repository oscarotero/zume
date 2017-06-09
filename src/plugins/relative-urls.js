'use strict';

const through = require('through2');
const cheerio = require('cheerio');
const path = require('path');

module.exports = function (options) {
    function run (file, done) {
        const $ = cheerio.load(file.contents.toString(), options.parser);
        resolve($, file, options);
        file.contents = new Buffer($.html());
        done(file);
    }

    return through.obj(function (file, encoding, callback) {
        run(file, (file) => callback(null, file));
    });
}

function resolve($, file, options) {
    const base = path.dirname(path.join('/', file.relative));

    $('audio,embed,iframe,img,input,script,source,track,video')
        .each(function () {
            const element = $(this);
            const src = element.attr('src');

            if (src && isRelative(src)) {
                element.attr('src', url(src));
            }
        });

    $('a,area,link')
        .each(function () {
            const element = $(this);
            const href = element.attr('href');

            if (href && isRelative(href)) {
                element.attr('href', url(href));
            }
        });

    function url (url) {
        let final = path.relative(base, path.join('/', url));

        if (!path.extname(final)) {
            if (options.index) {
                final = path.join(final, 'index.html');
            } else {
                final = path.join(final, '/');
            }
        }

        if (final.startsWith('/')) {
            return '.' + final;
        }

        return final;
    }

    function isRelative(url) {
        return url.indexOf('//') === -1;
    }
}
