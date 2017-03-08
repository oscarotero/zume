# ZUME [wip]

A static-site generator built on top of gulp.

Example of the `gulpfile.js`:

```js
const gulp        = require('gulp');
const frontMatter = require('zume/front-matter');
const minify      = require('zume/html-minify');
const markdown    = require('zume/markdown');
const permalink   = require('zume/permalink');
const templates   = require('zume/templates');
const inline      = require('zume/inline-source');
const config      = require('zume/config').create();

gulp.task('html', function () {
    gulp.src(config.src('data', '/**/*.md'))
        .pipe(frontMatter(config))
        .pipe(markdown(config))
        .pipe(permalink(config))
        .pipe(templates(config))
        .pipe(inline(config))
        .pipe(minify(config))
        .pipe(gulp.dest(config.dest()));
});

gulp.task('default', ['html']);
```

* front-matter: handle the frontmatter of `.md` files using [front-matter](https://github.com/jxson/front-matter)
* html-minify: Minifies the output html using [html-minifier](https://github.com/kangax/html-minifier)
* markdown: Parse the content of the files as markdown using [markdown-it](https://github.com/markdown-it/markdown-it)
* permalink: Rename the `*.md` files to `*/index.html` to generate prety urls
* templates: Build the html files using [ejs](https://github.com/mde/ejs)
* inline-source: Inline the img, css, js, etc using [inline-source](https://github.com/popeindustries/inline-source)
* config: Store the configuration of all tasks and resolve paths and urls
