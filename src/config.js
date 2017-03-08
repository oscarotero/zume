const path = require('path');
const url = require('url');

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
    }
};

class Config {
    static create(config) {
        return new Config(config);
    }

    constructor (config) {
        config = config || {};
        config.paths = Object.assign({}, defaults.paths, config.paths || {});

        this.config = config;
        this.paths = {
            cwd: config.paths.cwd,
            src: path.join(config.paths.cwd, config.paths.src),
            dest: path.join(config.paths.cwd, config.paths.dest),
            url: url.parse(config.url || '/').pathname
        }
    }

    path () {
        if (!arguments.length) {
            return this.paths.cwd;
        }

        let dirs = Array.prototype.slice.call(arguments);
        dirs.unshift(this.paths.cwd);

        return path.join.apply(dirs);
    }

    src (dir) {
        return getPath(
            this.paths.src,
            Array.prototype.slice.call(arguments, 1),
            this.config.paths,
            dir
        );
    }

    dest (dir) {
        return getPath(
            this.paths.dest,
            Array.prototype.slice.call(arguments, 1),
            this.config.paths,
            dir
        );
    }

    url () {
        return getPath(
            this.paths.url,
            Array.prototype.slice.call(arguments)
        ).replace(/\\/g, '/');
    }

    load(name, file) {
        this.config[name] = require(path.join(this.config.paths.cwd, file));
    }

    set(name, value) {
        this.config[name] = value;
    }

    get(name, assign) {
        if (assign) {
            return Object.assign({}, assign, this.config[name] || {});
        }

        return this.config[name];
    }
}

module.exports = Config;

function getPath(absolute, args, paths, dir) {
    if (!args.length) {
        return absolute;
    }

    if (dir) {
        if (!paths[dir]) {
            throw new Error(`The path ${dir} is not configured`);
        }

        args.unshift(paths[dir]);
    }

    args.unshift(absolute);

    return path.join.apply(null, args);
}
