# ZUME

An opinionated static-site generator with gulp.

Directory structure:

```
root/
    |_ gulpfile.js
    |_ package.json
    |_ src/
        |_ css
        |_ js
        |_ img
        |_ data
        |_ templates
    |_ build/
```

Example of the `gulpfile.js`:

```js
const zume = require('zume').create();
const gulp = zume.gulp();

gulp.task('clear', () => zume.clear());

gulp.task('html', () => 
    zume.html()
        .frontMatter()
        .markdown()
        .permalink()
        .navigation()
        .ejs()
        .urls()
            .fork(f => f.path.contains('example'))
            .pipe(action1)
            .pipe(action2)
            .merge()
        .dest()
);

gulp.task('js', () => zume.js().webpack().dest());
gulp.task('css', () => zume.css().postcss().dest());
gulp.task('img', () => zume.img().dest(done));

gulp.task('default', gulp.series('clear', 'html', 'js', 'css', 'img'));
gulp.task('server', gulp.series('default', () => zume.serve()));
```

## API

First, you have to create a `zume` instance passing the config data. Use the static function `create()` for this purpose:

```js
const zume = require('zume').create()
```

The full list of available settings:

Name | Default | Description
-----|---------|------------
`dev` | `true` | If it's in dev environment or not
`url` | `"http://localhost"` | The full url of the site
`cwd` | `process.cwd()` | The working directory
`src` | `"src"` | The directory with the source files
`dest` | `"build"` | The directory in which generate the static site
`server` | `[object]` | The browser-sync server options

The `zume` instance provides the following functions:

Name | Description
-----|------------
`zume.gulp()` | Returns the gulp instance used by zume.
`zume.path()` | Returns any path of the project. For example: `zume.path('foo')` returns `"/path/to/project/foo"`.
`zume.src()` | Returns any path of the src folder. For example: `zume.src('foo')` returns `"/path/to/project/src/foo"`.
`zume.dest()` | Returns any path of the build folder. For example: `zume.src('img')` returns `"/path/to/project/build/img"`.
`zume.url()` | Returns a public url path. For example: `zume.url('foo')` returns `"/foo"`.
`zume.fullUrl()` | Returns a public full url path. For example: `zume.fullUrl('foo')` returns `"http://example.com/foo"`.
`zume.serve()` | Init a new http server using [browsersync](http://browsersync.io/).
`zume.clear()` | Removes de build folder.

## Task

Zume contains the tasks `html`, `css`, `js`, `img` and `files`. To create a task, just need to do the following:

```js
const html = zume.html(options);
```

Available options:

Name | Description
-----|-------------
`task` | The gulp task name used to relaunch by the watcher. The default value in html is `html`, css is `css`, and so on.
`src` | Absolute directory where are the src files (by default is `zume.src()`)
`base` | Relative directory to `src` and `dest` used to search for files and output the result.
`pattern` | The pattern used to search files. The default value in html is `data/**/*.md`, in css is `*.css`, etc.
`watchPattern` | Additional patterns added to the watcher.

There are some functions available in all tasks:

* `.pipe(plugin)` Allow to pipe more gulp plugins to the stream 
* `.each(callback)` To execute a callback for each file
* `.filter(callback)` To filter some files
* `.fork(callback)` To filter some files and create a different fork with them
* `.add(options)` To create a new stream task ready to merge it in the main stream.
* `.dest()` To save the files in the build folder and return a promise.

Example:

```js
zume.html()         // Get the markdown files
    .frontMatter()  // Extract the frontmatter
    .markdown()     // Render the markdown
        .add({      // Add new yaml files
            pattern: 'data/*.yaml'
        })
        .yaml()     // Parse the yaml
        .merge()    // Merge yaml and markdown files
    .permalink()    // Change the file names
        .fork(      // Fork the stream again filtering the files containing "about"
            f => f.path.contains('about')
        )
        .each(fn)   // Execute a function with these files
        .merge()    // Merge these files again with the main stream
    .ejs()          // Apply the templates
    .dest()         // Save to build folder
```

## HTML Generation

To generate html pages, you need to create a html task and use some of its functions:

```js
zume.html()
    .frontMatter()
    .markdown()
    .permalink()
    .ejs()
    .inline()
    .dest()
```

### frontMatter

Handle the front matter of `.md` files using [front-matter](https://github.com/jxson/front-matter). In addition to the front matter, you can pass an object with common data to all files. Example:

```js
html.frontMatter({
    siteName: 'My awesome site'
})
```

### yaml

Handle the content of `.yaml` files. Useful if you don't need md files, just yaml content. You can pass an object with common data to all files. Example:

```js
html.yaml({
    siteName: 'My awesome site'
})
```

### markdown

Parse the content of the files as markdown using [markdown-it](https://github.com/markdown-it/markdown-it). You can pass a function to configure the MarkdownIt instance:

```js
html.markdown(md => md.set({ breaks: false }))
```

In addition to that, it also creates two variables: `markdown` and `markdownInline` that can be used in the templates to render markdown.

### permalink

Renames the `*.md` files to `*/index.html` in order to generate pretty urls. For example: the file `about.md` is renamed to `about/index.html`.

```js
html.urls({
    pretty: false, //to rename "/about.md" to "/about.html" instead "/about/index.html"
})
```

### navigation

Creates a tree structure with all files to build a navigation menu. Example:

```js
html.navigation()
```

```html
<html>
<body>
    <ul>
        <? nav.forEach(section => { ?>
        <li>
            <a href="<?= section.id ?>"><?= section.title ?></a>
        </li>
        <? }) ?>
    </ul>
</body>
</html>
```

Use the variable `position` to change the order of the elements.

You can override the default values of the sections:

```js
html.navigation({
    override: {
        section1: {
            title: 'First section',
            position: 1
        }
        'section1/subsection3': {
            title: 'Subsection 3',
            position: 3
        }
    }
});
```

### ejs

Build the html files using [ejs](https://github.com/mde/ejs). In addition to the front matter values, the templates have two more variables: `content` to return the file content and `zume` containing the instance of zume, that you can use to generate, for example, new urls. You can [configure the options](https://github.com/mde/ejs#options) in the first argument. Example with the default options:

```js
html.ejs({
    delimiter: '?'
})
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
html.urls({
    pretty: false, //add "/index.html" to all links
    relative: true //makes the urls relatives to the current page
})
```

### inline

To inline the tags containing the `inline="true"` attribute. Supports `<script>`, `<link>` and `<img>`

```js
html.inline({
    dest: true, //To get the sources from dest folder, instead src.
})
```

### cheerio

Run [cheerio](https://github.com/cheeriojs/cheerio) in all html pages. Useful to make changes in the html using the jQuery sintax.

```js
html.cheerio($ => $('h1').addClass('text-title'));

//object with options
html.cheerio({
    parser: {
        normalizeWhitespace: true,
    },
    fn: function ($) {
        $('h1').addClass('text-title');
    }
})
```

## JS

Task used to generate js content.

```js
zume.js()
    .webpack(options)
    .dest();
```

### webpack

Runs [webpack](https://webpack.js.org/) to generate the javascript files. Example with the default configuration:

```js
js.webpack({
    output: {
        filename: '[name].js'
    }
})
```

## CSS

Task used to generate css content.

```js
zume.css()
    .postcss()
    .dest();
```

### postcss

Runs [postcss](http://postcss.org/) to generate the css files, with the following plugins:


* [postcss-import](https://github.com/postcss/postcss-import)
* [postcss-url](https://github.com/postcss/postcss-url)
* [cssnext](http://cssnext.io/)
* [cssnano](http://cssnano.co/) (enabled only in production mode)

## Img

Simple task used to handle img files:

```js
zume.img().dest();
```

## Files

Simple task used just to copy files:

```js
zume.files({src: 'dir/to/files'}).dest();
```
