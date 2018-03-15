const BrowserSync = require('browser-sync');
const path = require('path');
const url = require('url');
const gulp = require('gulp');
const del = require('del');
const merge = require('merge-options');
const Html = require('./html');
const Css = require('./css');
const Img = require('./img');
const Js = require('./js');
const Files = require('./files');
const defaults = {
    cwd: process.cwd(),
    url: 'http://localhost',
    src: 'src',
    dest: 'build',
    server: {
        open: false,
        reloadOnRestart: true,
        reloadThrottle: 1000,
        notify: false,
        watchOptions: {
            ignoreInitial: true,
            ignored: '.DS_Store'
        }
    }
};

class Zume {
    static create(config) {
        return new Zume(config);
    }

    constructor(config = {}) {
        this.tasks = {};
        this.dev = true;
        this.config = merge(defaults, config);

        const parsedUrl = url.parse(this.config.url);

        this.paths = {
            cwd: this.config.cwd,
            baseUrl: parsedUrl.protocol + '//' + parsedUrl.host,
            path: parsedUrl.pathname || '/',
            src: path.join(this.config.cwd, this.config.src),
            dest: path.join(this.config.cwd, this.config.dest)
        };

        this.config.server.watchOptions.cwd = this.paths.cwd;
        this.config.server.server = this.paths.dest;
        this.paths.dest = path.join(this.paths.dest, this.paths.path);
        this.sync = BrowserSync.create();
    }

    gulp() {
        return gulp;
    }

    path() {
        return getPath(this.paths.cwd, Array.prototype.slice.call(arguments));
    }

    src() {
        return getPath(this.paths.src, Array.prototype.slice.call(arguments));
    }

    dest(dir) {
        return getPath(this.paths.dest, Array.prototype.slice.call(arguments));
    }

    url() {
        return getPath(
            this.paths.path,
            Array.prototype.slice.call(arguments)
        ).replace(/\\/g, '/');
    }

    fullUrl() {
        return this.paths.baseUrl + this.url.apply(this, arguments);
    }

    serve() {
        this.sync.init(this.config.server);

        Object.keys(this.tasks).forEach(name =>
            this.watch(this.tasks[name].watch, name)
        );
    }

    watch(paths, ...task) {
        gulp.watch(
            paths,
            this.config.server.watchOptions,
            gulp.parallel(...task)
        );
    }

    clear() {
        return del(path.join(this.config.cwd, this.config.dest));
    }

    /**
     * Tasks
     */
    html(options = {}) {
        return initTask(this, Html, {task: 'html'}, options);
    }

    js(options = {}) {
        return initTask(this, Js, {task: 'js'}, options);
    }

    css(options = {}) {
        return initTask(this, Css, {task: 'css'}, options);
    }

    img(options = {}) {
        return initTask(this, Img, {task: 'img'}, options);
    }

    files(options = {}) {
        return initTask(this, Files, {task: 'files'}, options);
    }
}

module.exports = Zume;

function initTask(zume, Task, defaults, options = {}) {
    const task = new Task(zume, merge(defaults, options));

    zume.tasks[options.task] = task;

    return task.src();
}

function getPath(absolute, args) {
    if (!args.length) {
        return absolute;
    }

    args.unshift(absolute);

    return path.join.apply(null, args);
}
