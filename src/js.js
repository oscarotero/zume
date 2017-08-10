'use strict';

const Task = require('./task');

class Js extends Task {
    constructor(zume, dir) {
        super(zume, dir || 'js');
        this.reload = '*.js';
    }

    src(pattern, watchPattern) {
        this.watchSrc(watchPattern || '**/*.js');

        return super.src(pattern || '*.js');
    }

    webpack(options) {
        return this.pipe(
            require('./plugins/webpack')({
                zume: this.zume,
                options: options,
                dir: this.dir
            })
        );
    }
}

module.exports = Js;
