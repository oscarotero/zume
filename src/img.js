const Task = require('./task');
const merge = require('merge-options');
const defaults = {
    base: 'img',
    pattern: '**/*.{jpg,jpeg,png,svg,gif}',
    incremental: true
};

class Img extends Task {
    constructor(zume, options) {
        super(zume, merge(defaults, options));
        this.reload = ['*.jpg', '*.jpeg', '*.png', '*.svg', '*.gif'];
    }
}

module.exports = Img;
