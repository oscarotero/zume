# ZUME

An opinionated static-site generator with gulp.

Example of the `gulpfile.js`:

```js
const gulp = require('gulp');
const zume = require('zume').create();

gulp.task('clear', function () {
    zume.clear();
});

gulp.task('html', function (done) {
    const html = zume.html();

    gulp.src(html.src())
        .on('end', () => done())
        .pipe(html.frontMatter())
        .pipe(html.markdown())
        .pipe(html.permalink())
        .pipe(html.ejs())
        .pipe(html.urls())
        .pipe(html.dest())
        .pipe(html.refresh());
});

gulp.task('js', function (done) {
    const js = zume.js();
    
    gulp.src(js.src())
        .on('end', () => done())
        .pipe(js.webpack())
        .pipe(js.dest())
        .pipe(js.refresh());
});

gulp.task('css', function (done) {
    const css = zume.css();

    gulp.src(css.src())
        .on('end', () => done())
        .pipe(css.stylecow())
        .pipe(css.dest())
        .pipe(css.refresh());
});

gulp.task('server', ['default'], function () {
    zume.serve();
});

gulp.task('default', ['clear', 'html', 'js', 'css']);
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
`zume.src()` | Returns any path of the src folder. For example: `zume.src('foo')` returns `"/path/to/project/src/foo"`.
`zume.dest()` | Returns any path of the dist folder. For example: `zume.src('img')` returns `"/path/to/project/build/img"`.
`zume.url()` | Returns a public url path. For example: `zume.url('foo')` returns `"/foo"`.
`zume.fullUrl()` | Returns a public full url path. For example: `zume.fullUrl('foo')` returns `"http://example.com/foo"`.
`zume.serve()` | Init a new http server using [browsersync](http://browsersync.io/).
`zume.refresh()` | Used to refresh the server with the file changes.
`zume.each()` | Used to execute a function for each file.
`zume.clear()` | Removes de dist folder and all its content.

## HTML Generation

To generate html pages, you need to create a html task and use some of its functions:

```js
//Create a html task
const html = zume.html();

//Use the methods in the gulp task
gulp.src(html.src())
    .pipe(html.frontMatter())
    .pipe(html.markdown())
    .pipe(html.permalink())
    .pipe(html.ejs())
    .pipe(html.dest())
    .pipe(html.refresh());
```

### frontMatter

Handle the front matter of `.md` files using [front-matter](https://github.com/jxson/front-matter). In addition to the front matter, you can pass an object with common data to all files. Example:

```js
.pipe(html.frontMatter({
    siteName: 'My awesome site'
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

In addition to that, it also creates two variables: `markdown` and `markdownInline` that can be used in the templates to render markdown.

### permalink

Renames the `*.md` files to `*/index.html` in order to generate pretty urls. For example: the file `about.md` is renamed to `about/index.html`.

### ejs

Build the html files using [ejs](https://github.com/mde/ejs). In addition to the front matter values, the templates have two more variables: `content` to return the file content and `zume` containing the instance of zume, that you can use to generate, for example, new urls. You can [configure the options](https://github.com/mde/ejs#options) in the first argument. Example with the default options:

```js
.pipe(html.ejs({
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

### urls

Search and fix all relative urls in the html (`a`, `img`, `link`, `script`, `source`, etc...), to use the site url as base. Optionally, can makes all urls relative each other, allowing to execute the web directly from the file system (`file:` protocol). The configuration value `index` insert automatically a `index.html` at the end of the urls.

```js
.pipe(html.urls({
    index: true, //add "/index.html" to all links
    relative: true //makes the urls relatives to the current page
}))

### cheerio

Run [cheerio](https://github.com/cheeriojs/cheerio) in all html pages. Useful to make changes in the html using the jQuery sintax.

```js
.pipe(html.cheerio(function ($) {
    $('h1').addClass('text-title');
}));

//object with options
.pipe(html.cheerio({
    parser: {
        normalizeWhitespace: true,
    },
    fn: function ($) {
        $('h1').addClass('text-title');
    }
}))
```

## JS generation

Task used to generate js content.

```js
const js = zume.js();
gulp.src(js.src())
    .pipe(js.webpack(options))
    .pipe(js.dest())
    .pipe(js.refresh());
```

### webpack

Runs [webpack](https://webpack.js.org/) to generate the javascript files. Example with the default configuration:

```js
.pipe(js.webpack({
    output: {
        filename: '[name].js'
    }
})
```

## CSS generation

Task used to generate css content.

```js
const css = zume.css();
gulp.src(css.src())
    .pipe(css.stylecow(options))
    .pipe(css.dest())
    .pipe(css.refresh());
```

### stylecow

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

## Files

Simple task used just to copy files:

```js
const files = zume.files('dir/to/files');
gulp.src(files.src())
    .pipe(files.dest())
    .pipe(files.refresh());
```