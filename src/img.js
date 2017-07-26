'use strict';

const Task = require('./task');

class Img extends Task {
    constructor(zume, dir) {
        super(zume, dir || 'img');
        this.reload = ['*.jpg', '*.jpeg', '*.png', '*.svg', '*.gif'];
    }

    src(pattern, watchPattern) {
        pattern = pattern || '**/*.{jpg,jpeg,png,svg,gif}';

        this.watchSrc(watchPattern || pattern);

        return super.src(pattern);
    }
}

module.exports = Img;
