# ZUME [wip]

A static-site generator with gulp.

Example of the `gulpfile.js`:

```js
const gulp = require('gulp');
const zume = require('zume').create();

gulp.task('html', function () {
    gulp.src(zume.src('data', '/**/*.md'))
        .pipe(zume.frontMatter())
        .pipe(zume.markdown())
        .pipe(zume.permalink())
        .pipe(zume.templates())
        .pipe(zume.inline())
        .pipe(zume.minify())
        .pipe(gulp.dest(zume.dest()));
});

gulp.task('js', function () {
    zume.webpack();
});

gulp.task('default', ['html', 'js']);
```

## API

First, you have to create a `zume` instance passing the config data. Use the method `create` for this purpose:

```js
const zume = require('zume').create({
    paths: {
        src: 'in',
        dest: 'out'
    }
})
```

The full list of available settings:

Name | Default | Description
-----|---------|------------
`dev` | `true` | If it's in dev environment or not
`paths.url` | `"http://localhost"` | The full url of the site
`paths.cwd` | `process.cwd()` | The working directory
`paths.src` | `"src"` | The directory with the source files
`paths.dest` | `"build"` | The directory in which generate the static site
`paths.data` | `"data"` | The subdirectory in the src directory in which are the markdown files
`paths.templates` | `"templates"` | The subdirectory in the src directory in which are the templates files
`paths.css` | `"css"` | The subdirectory in the src directory in which are the css files
`paths.js` | `"js"` | The subdirectory in the src directory in which are the js files
`paths.img` | `"img"` | The subdirectory in the src directory in which are the img files
`paths.static` | `"static"` | The subdirectory in the src directory in which are static files

The `zume` instance provide the following functions:

Name | Description
-----|------------
`zume.path()` | Returns any path of the project. For example: `zume.path('foo')` returns `"/path/to/project/foo"`.
`zume.src()` | Returns any path of the src folder. For example: `zume.src('templates')` returns `"/path/to/project/src/templates"`.
`zume.dest()` | Returns any path of the dist folder. For example: `zume.src('img')` returns `"/path/to/project/build/img"`.
`zume.url()` | Returns a public url path. For example: `zume.url('about')` returns `"/about"`.
`zume.set()` | Save config data or any other value that you want to retrieve later.
`zume.get()` | Get the data saved with `set`.

## Plugins

### frontMatter

Handle the front matter of `.md` files using [front-matter](https://github.com/jxson/front-matter). In addition to the front matter, you can pass an object with common data to all files. Example:

```js
.pipe(zume.frontMatter({
    siteName: 'My awesome site'
}))
```

### inline

Inline the img, css, js, etc using [inline-source](https://github.com/popeindustries/inline-source). You can [configure the options](https://github.com/popeindustries/inline-source#usage) like the following example:

```js
.pipe(zume.inline({
    attribute: 'inline',
    compress: false
}))
```

### markdown

Parse the content of the files as markdown using [markdown-it](https://github.com/markdown-it/markdown-it). You can pass an object with options or a new instace of MarkdownIt:

```js
//Using an object of options
.pipe(zume.markdown({
    html: true,
    linkify: true,
    typographer: true
}))

//Or an instance of markdownit
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

.pipe(zume.markdown(md))
```

### minify

Minifies the output html using [html-minifier](https://github.com/kangax/html-minifier). You can [configure the options](https://github.com/kangax/html-minifier#options-quick-reference) in the first argument. Example with the default options:

```js
.pipe(zume.minify({
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
}))
```

### permalink

Renames the `*.md` files to `*/index.html` in order to generate pretty urls. For example: the file `about.md` is renamed to `about/index.html`.

### templates

Build the html files using [ejs](https://github.com/mde/ejs). In addition to the front matter values, the templates have two more variables: `content` to return the file content and `zume` containing the instance of zume, that you can use to generate, for example, new urs. You can [configure the options](https://github.com/mde/ejs#options) in the first argument. Example with the default options:

```js
.pipe(zume.templates({
    delimiter: '?'
}))
```

```html
<!DOCTYPE html>
<html>
<head>
    <title><?= title ?></title>
</head>
<body>
    <?- content ?>
    <a href="<?= zume.url('about') ?>">About us</a>
</body>
</html>
```

### webpack

Runs [webpack](https://webpack.js.org/) generate the javascript files. This is not a gulp plugin, so can be executed directly in a task. Example with the default configuration:

```js
zume.webpack({
    entry: {
        main: './main.js'
    },
    output: {
        filename: '[name].js'
    }
})
```
