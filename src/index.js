'use strict';

const BrowserSync = require('browser-sync');
const through = require('through2');
const path = require('path');
const url = require('url');
const gulp = require('gulp');
const del = require('del');
const Html = require('./html');
const Css = require('./css');
const Js = require('./js');
const Files = require('./files');
const defaults = {
    paths: {
        cwd: process.cwd(),
        url: 'http://localhost',
        src: 'src',
        dest: 'build',
    },
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

    constructor (config) {
        this.tasks = {};
        this.dev = true;
        
        config = config || {};

        this.config = Object.assign({}, defaults);
        this.config.paths = Object.assign({}, defaults.paths, config.paths || {});
        this.config.server = Object.assign({}, defaults.server, config.server || {});

        const parsedUrl = url.parse(this.config.paths.url);

        this.paths = {
            cwd: this.config.paths.cwd,
            baseUrl: parsedUrl.protocol + '//' + parsedUrl.host,
            path: parsedUrl.pathname || '/',
            src: path.join(this.config.paths.cwd, this.config.paths.src),
            dest: path.join(this.config.paths.cwd, this.config.paths.dest)
        };

        this.config.server.watchOptions.cwd = this.paths.cwd;
        this.config.server.server = this.paths.dest;
        this.paths.dest = path.join(this.paths.dest, this.paths.path);
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
            this.paths.path,
            Array.prototype.slice.call(arguments)
        ).replace(/\\/g, '/');
    }

    fullUrl () {
        return this.paths.baseUrl + this.url.apply(this, arguments);
    }

    serve() {
        this.sync.init(this.config.server);

        Object.keys(this.tasks).forEach((name) => {
            this.watch(this.tasks[name].watch, name);
        });

    }

    refresh() {
        return this.sync.stream();
    }

    each(fn, data) {
        data = data || {};
        const files = [];

        return through.obj(function (file, encoding, callback) {
            fn(file, data);
            files.push(file);
            callback();
        }, function (done) {
            files.forEach(file => this.push(file));
            done();
        });
    }

    watch(paths, task) {
        this.sync.watch(paths, this.config.server.watchOptions, (event, file) => {
            gulp.start(task);
        });
    }

    clear() {
        del.sync(this.dest());
    }

    /**
     * Tasks
     */
    html(name, dir) {
        name = name || 'html';
        this.tasks[name] = new Html(this, dir);
        return this.tasks[name];
    }

    js(name, dir) {
        name = name || 'js';
        this.tasks[name] = new Js(this, dir);
        return this.tasks[name];
    }

    css(name, dir) {
        name = name || 'css';
        this.tasks[name] = new Css(this, dir);
        return this.tasks[name];
    }

    files(name, dir) {
        name = name || 'files';
        this.tasks[name] = new Files(this, dir);
        return this.tasks[name];
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
