const Task = require('./task');

class Css extends Task {
    constructor(zume, options) {
        options = Object.assign(
            {
                base: 'css',
                watchPattern: '**/*.css',
                pattern: '*.css'
            },
            options
        );

        super(zume, options);
        this.reload = '*.css';
    }

    postcss(options) {
        options = options || {};
        options.zume = this.zume;

        return this.pipe(require('./plugins/postcss')(options));
    }
}

module.exports = Css;
