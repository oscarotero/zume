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
        static: 'static',
    }
};

class Zume {
    static create(config) {
        return new Zume(config);
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

    /*
     * Plugins
     */
    frontMatter(options) {
        return require('./front-matter')(this, this.get('frontMatter', options));
    }

    minify(options) {
        return require('./minify')(this, this.get('minify', options));
    }

    inline(options) {
        return require('./inline')(this, this.get('inline', options));
    }

    markdown(options) {
        return require('./markdown')(this, this.get('markdown', options));
    }

    permalink() {
        return require('./permalink')();
    }

    templates(options) {
        return require('./templates')(this, this.get('templates', options));
    }
}

module.exports = Zume;

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
