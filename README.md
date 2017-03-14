# ZUME [wip]

A static-site generator with gulp.

Example of the `gulpfile.js`:

```js
const gulp = require('gulp');
const zume = require('zume').create();

const html = zume.html();
const css = zume.css();
const js = zume.js();

gulp.task('html', function () {
    gulp.src(html.src())
        .pipe(html.frontMatter())
        .pipe(html.markdown())
        .pipe(html.permalink())
        .pipe(html.templates())
        .pipe(html.inline())
        .pipe(html.minify())
        .pipe(html.dest())
        .pipe(zume.refresh());
});

gulp.task('js', function () {
    gulp.src(js.src())
        .pipe(js.webpack())
        .pipe(js.dest())
        .pipe(zume.refresh());
});

gulp.task('css', function () {
    gulp.src(css.src())
        .pipe(css.stylecow())
        .pipe(css.dest())
        .pipe(zume.refresh());
});

gulp.task('server', function () {
    html.watch('html');
    js.watch('js');
    css.watch('css');
    zume.serve();
});

gulp.task('default', ['html', 'js', 'css']);
```

## API

First, you have to create a `zume` instance passing the config data. Use the method `create` for this purpose:

```js
const zume = require('zume').create()
```

The full list of available settings:

Name | Default | Description
-----|---------|------------
`dev` | `true` | If it's in dev environment or not
`paths.url` | `"http://localhost"` | The full url of the site
`paths.cwd` | `process.cwd()` | The working directory
`paths.src` | `"src"` | The directory with the source files
`paths.dest` | `"build"` | The directory in which generate the static site

The `zume` instance provide the following functions:

Name | Description
-----|------------
`zume.path()` | Returns any path of the project. For example: `zume.path('foo')` returns `"/path/to/project/foo"`.
`zume.src()` | Returns any path of the src folder. For example: `zume.src('templates')` returns `"/path/to/project/src/templates"`.
`zume.dest()` | Returns any path of the dist folder. For example: `zume.src('img')` returns `"/path/to/project/build/img"`.
`zume.url()` | Returns a public url path. For example: `zume.url('about')` returns `"/about"`.
`zume.set()` | Save config data or any other value that you want to retrieve later.
`zume.get()` | Get the data saved with `set`.
`zume.serve()` | Init a new http server using [browsersync](http://browsersync.io/).
`zume.refresh()` | Used to reload [browsersync](http://browsersync.io/) with the latest changes.
`zume.watch()` | Start watching file changes.

## HTML Generation

### frontMatter

Handle the front matter of `.md` files using [front-matter](https://github.com/jxson/front-matter). In addition to the front matter, you can pass an object with common data to all files. Example:

```js
.pipe(html.frontMatter({
    siteName: 'My awesome site'
}))
```

### inline

Inline the img, css, js, etc using [inline-source](https://github.com/popeindustries/inline-source). You can [configure the options](https://github.com/popeindustries/inline-source#usage) like the following example:

```js
.pipe(html.inline({
    attribute: 'inline',
    compress: false
}))
```

### markdown

Parse the content of the files as markdown using [markdown-it](https://github.com/markdown-it/markdown-it). You can pass an object with options or a new instace of MarkdownIt:

```js
//Using an object of options
.pipe(html.markdown({
    html: true,
    linkify: true,
    typographer: true
}))

//Or an instance of markdownit
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

.pipe(html.markdown(md))
```

### minify

Minifies the output html using [html-minifier](https://github.com/kangax/html-minifier). You can [configure the options](https://github.com/kangax/html-minifier#options-quick-reference) in the first argument. Example with the default options:

```js
.pipe(html.minify({
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
.pipe(html.templates({
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

## Assets generation

### js (webpack)

Runs [webpack](https://webpack.js.org/) to generate the javascript files. Example with the default configuration:

```js
.pipe(js.webpack({
    output: {
        filename: '[name].js'
    }
})
```

### css (stylecow)

Runs [stylecow](http://stylecow.github.io/) to generate the css files. Example with the default configuration:

```js
.pipe(css.stylecow({
        "support": {
        "explorer": 10,
        "edge": false,
        "firefox": 39,
        "chrome": 43,
        "safari": 8,
        "opera": false,
        "android": 4.1,
        "ios": 8.1
    },
    "plugins": [
        "base64",
        "bower-loader",
        "calc",
        "color",
        "custom-media",
        "custom-selector",
        "extend",
        "fixes",
        "flex",
        "import",
        "matches",
        "msfilter-background-alpha",
        "msfilter-linear-gradient",
        "msfilter-transform",
        "nested-rules",
        "npm-loader",
        "prefixes",
        "rem",
        "variables",
        "webkit-gradient"
    ],
    "code": "normal",
    "map": "auto"
})
```
