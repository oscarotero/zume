const Task = require('./task');

class Js extends Task {
    constructor(zume, options) {
        options = Object.assign(
            {
                base: 'js',
                watchPattern: '**/*.js',
                pattern: '*.js'
            },
            options
        );

        super(zume, options);
        this.reload = '*.js';
    }

    webpack(options) {
        return this.pipe(
            require('./plugins/webpack')({
                zume: this.zume,
                options: options,
                dir: this.options.base
            })
        );
    }
}

module.exports = Js;
