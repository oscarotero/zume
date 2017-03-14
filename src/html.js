'use strict';

const gulp = require('gulp');
const Task = require('./task');

class Html extends Task {
    src() {
        const path = this.zume.src('data/**/*.md');
        this.watchPaths.push(path);
        return path;
    }

    dest() {
        return gulp.dest(this.zume.dest());
    }

    frontMatter(options) {
        return require('./plugins/front-matter')(options);
    }

    minify(options) {
        return require('./plugins/minify')(options);
    }

    inline(options) {
        options = options || {};
        options.rootpath = this.zume.src();

        return require('./plugins/inline')(options);
    }

    markdown(options) {
        return require('./plugins/markdown')(options);
    }

    permalink(options) {
        return require('./plugins/permalink')(options);
    }

    templates(options) {
        options = options || {};
        options.root = this.zume.src('templates');
        options.locals = options.locals || {};
        options.locals.zume = this.zume;

        this.watchPaths.push(this.zume.src('templates/**/*.ejs'));

        return require('./plugins/templates')(options);
    }
}

module.exports = Html;
