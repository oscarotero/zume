# ZUME [wip]

A static-site generator built on top of gulp.

Example:

```js
//gulpfile.js

const gulp = require('gulp');
const zume = require('zume');

gulp.task('html', function () {
	gulp.src('site/**/*.md')
		.pipe(zume.frontMatter({foo: 'bar'}))
		.pipe(zume.markdown())
		.pipe(zume.permalink())
		.pipe(zume.handlebars({
			templates: '/tmpl'
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('default', ['html']);
```

* frontMatter: handle the frontmatter of `.md` files
* markdown: Parse the content of the files as markdown
* permalink: Rename the `*.md` files to `*/index.html` to generate prety urls
* handlebars: Build the html files using handlebars
