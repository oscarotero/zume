const postcss = require('gulp-postcss');
const defaults = {
    plugins: [
        require('postcss-import'),
        require('postcss-url'),
        require('postcss-cssnext'),
    ]
};

module.exports = function (options = {}) {
    options = Object.assign({}, defaults, options);

    if (!options.zume.dev) {
        options.plugins.push(require('cssnano')({
            preset: 'default'
        }));
    }

    return postcss(options.plugins);
};
