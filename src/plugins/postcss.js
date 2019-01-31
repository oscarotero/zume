const postcss = require('gulp-postcss');
const plugin_import = require('postcss-import');
const plugin_url = require('postcss-url');
const plugin_preset_env = require('postcss-preset-env');
const plugin_extend = require('postcss-extend');
const defaults = {
    env: {
        stage: 0
    }
};

module.exports = function(options = {}) {
    options = Object.assign({}, defaults, options);

    const plugins = [
        plugin_import,
        plugin_url,
        plugin_preset_env(options.env),
        plugin_extend
    ];

    if (!options.zume.dev) {
        plugins.push(
            require('cssnano')({
                preset: 'default'
            })
        );
    }

    return postcss(plugins);
};
