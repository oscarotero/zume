module.exports = {
    frontMatter: function (options) {
        return require('./front-matter')(options);
    },
    handlebars: function (options) {
        return require('./handlebars')(options);
    },
    markdown: function (options) {
        return require('./markdown')(options);
    },
    permalink: function (options) {
        return require('./permalink')(options);
    }
}