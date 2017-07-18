'use strict';

const gulp = require('gulp');
const Task = require('./task');

class Html extends Task {
    src(pattern, watchPattern) {
        this.watchSrc(watchPattern || 'data/**/*.md');

        return super.src(pattern || 'data/**/*.md');
    }

    frontMatter(options) {
        return require('./plugins/front-matter')(options);
    }

    markdown(options) {
        return require('./plugins/markdown')(options);
    }

    permalink(options) {
        return require('./plugins/permalink')(options);
    }

    ejs(options) {
        options = options || {};
        options.root = this.zume.src('templates');
        options.locals = options.locals || {};
        options.locals.zume = this.zume;

        this.watch.push(this.zume.src('templates/**/*.ejs'));

        return require('./plugins/ejs')(options);
    }

    urls(options) {
        options = options || {};
        options.zume = this.zume;

        return require('./plugins/urls')(options);
    }

    cheerio(options) {
        return require('./plugins/cheerio')(options);
    }
}

module.exports = Html;
