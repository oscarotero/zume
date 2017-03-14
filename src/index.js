'use strict';

const BrowserSync = require('browser-sync');
const path = require('path');
const url = require('url');
const gulp = require('gulp');
const Html = require('./html');
const Css = require('./css');
const Js = require('./js');
const defaults = {
    paths: {
        url: 'http://localhost',
        cwd: process.cwd(),
        src: 'src',
        dest: 'build',
        data: 'data',
        templates: 'templates',
        css: 'css',
        js: 'js',
        img: 'img',
        static: 'static',
    },
    server: {
        open: false,
        reloadOnRestart: true,
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

    constructor (config) {
        this.dev = true;
        
        config = config || {};

        this.config = Object.assign({}, defaults);
        this.config.paths = Object.assign({}, defaults.paths, config.paths || {});
        this.config.server = Object.assign({}, defaults.server, config.server || {});

        this.paths = {
            cwd: this.config.paths.cwd,
            src: path.join(this.config.paths.cwd, this.config.paths.src),
            dest: path.join(this.config.paths.cwd, this.config.paths.dest),
            url: url.parse(this.config.url || '/').pathname
        }

        this.config.server.watchOptions.cwd = this.paths.cwd;
        this.config.server.server = this.paths.dest;

        this.sync = BrowserSync.create();
    }

    path () {
        return getPath(this.paths.cwd, Array.prototype.slice.call(arguments));
    }

    src () {
        return getPath(this.paths.src, Array.prototype.slice.call(arguments));
    }

    dest (dir) {
        return getPath(this.paths.dest, Array.prototype.slice.call(arguments));
    }

    url () {
        return getPath(
            this.paths.url,
            Array.prototype.slice.call(arguments)
        ).replace(/\\/g, '/');
    }

    set(name, value) {
        if (typeof name === 'object') {
            Object.assign(this.config, name);
        } else {
            this.config[name] = value;
        }
    }

    get(name, assign) {
        if (assign) {
            return Object.assign({}, assign, this.config[name] || {});
        }

        return this.config[name];
    }

    serve() {
        this.sync.init(this.config.server);
    }

    refresh() {
        return this.sync.stream();
    }

    watch(paths, task) {
        this.sync.watch(paths, this.config.server.watchOptions, (event, file) => {
            gulp.start(task);
        });
    }

    /**
     * Tasks
     */
    html() {
        return new Html(this);
    }

    js() {
        return new Js(this);
    }

    css() {
        return new Css(this);
    }
}

module.exports = Zume;

function getPath(absolute, args) {
    if (!args.length) {
        return absolute;
    }

    args.unshift(absolute);

    return path.join.apply(null, args);
}
