'use strict';

const Task = require('./task');

class Html extends Task {
    constructor(zume, options) {
        options = Object.assign({
            pattern: 'data/**/*.md'
        }, options);

        options.watchPattern = options.watchPattern || options.pattern;

        super(zume, options);
    }

    yaml(options) {
        return this.pipe(require('./plugins/yaml')(options));
    }

    frontMatter(options) {
        return this.pipe(require('./plugins/front-matter')(options));
    }

    markdown(options) {
        return this.pipe(require('./plugins/markdown')(options));
    }

    permalink(options) {
        return this.pipe(require('./plugins/permalink')(options));
    }

    ejs(options) {
        options = options || {};
        options.root = this.zume.src('templates');
        options.locals = options.locals || {};
        options.locals.zume = this.zume;

        this.watch.push(this.zume.src('templates/**/*.ejs'));

        return this.pipe(require('./plugins/ejs')(options));
    }

    urls(options) {
        options = options || {};
        options.zume = this.zume;

        return this.pipe(require('./plugins/urls')(options));
    }

    navigation(options) {
        return this.pipe(require('./plugins/navigation')(options));
    }

    cheerio(options) {
        return this.pipe(require('./plugins/cheerio')(options));
    }
}

module.exports = Html;
