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
    const base = path.dirname(path.join(options.url, file.relative)) + '/';

    $('audio,embed,iframe,img,input,script,source,track,video')
        .each(function () {
            const element = $(this);
            const src = element.attr('src');

            if (src) {
                element.attr('src', url(src));
            }
        });

    $('a,area,link')
        .each(function () {
            const element = $(this);
            const href = element.attr('href');

            if (href) {
                element.attr('href', url(href));
            }
        });

    function url (url) {
        if (url.startsWith('#') || url.startsWith('.') || url.indexOf('//') !== -1) {
            return url;
        }

        if (!url.startsWith(options.url)) {
            url = path.join(options.url, url);
        }

        if (!path.extname(url) && options.index) {
            url = path.join(url, 'index.html');
        }

        let final = path.relative(base, url);

        if (!final || final.startsWith('/')) {
            return '.' + final;
        }

        if (!path.extname(final) && !final.endsWith('/')) {
            return final + '/';
        }

        return final;
    }
}
