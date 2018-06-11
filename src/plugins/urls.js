const { Transform } = require('stream');
const cheerio = require('cheerio');
const path = require('path');
const merge = require('merge-options');
const defaults = {
    pretty: true,
    relative: false
};

module.exports = function(options = {}) {
    options = merge(defaults, options, { url: options.zume.url() });

    return new Transform({
        objectMode: true,
        transform(file, encoding, done) {
            if (path.extname(file.path) === '.html') {
                const $ = cheerio.load(
                    file.contents.toString(),
                    options.parser
                );
                resolve($, file, options);

                file.contents = Buffer.from($.html());
            }

            done(null, file);
        }
    });
};

function resolve($, file, options) {
    const base = path.dirname(path.join(options.url, file.relative)) + '/';

    $('audio,embed,iframe,img,input,script,source,track,video').each(
        function() {
            const element = $(this);
            const src = element.attr('src');

            if (src) {
                element.attr('src', url(src));
            }
        }
    );

    $('a,area,link').each(function() {
        const element = $(this);
        const href = element.attr('href');

        if (href) {
            element.attr('href', url(href));
        }
    });

    function url(url) {
        if (notHandle(url)) {
            return url;
        }

        if (!url.startsWith(options.url)) {
            url = path.join(options.url, url);
        }

        if (!path.extname(url) && !options.pretty) {
            url = path.join(url, 'index.html');
        }

        if (!options.relative) {
            return url;
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

function notHandle(url) {
    return (
        url.startsWith('#') ||
        url.startsWith('.') ||
        url.indexOf('//') !== -1 ||
        url.match(/[a-z]\:/)
    );
}
