const Task = require('./task');

class Img extends Task {
    constructor(zume, options) {
        options = Object.assign(
            {
                base: 'img',
                pattern: '**/*.{jpg,jpeg,png,svg,gif}',
                incremental: true
            },
            options
        );

        options.watchPattern = options.watchPattern || options.pattern;

        super(zume, options);
        this.reload = ['*.jpg', '*.jpeg', '*.png', '*.svg', '*.gif'];
    }
}

module.exports = Img;
