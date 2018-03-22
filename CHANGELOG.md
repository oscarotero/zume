# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0-beta.5] - 2018-03-22

### Added

- New `task.add()` to add a new stream to the pipeline.

### Fixed

- The constructor of `TaskFork` must return nothing

## [1.0.0-beta.4] - 2018-03-20

### Added

- New `task.fork()` function to fork the stream and merge again. This allows to execute plugins only to some files.

### Changed

- Removed through dependency and use the standard `Transform` class

### Fixed

- The task functions `watchSrc()` and `logError()` returns `this`;

## [1.0.0-beta.3] - 2018-03-19

### Fixed

- Gulp error events are not handled.

## [1.0.0-beta.2] - 2018-03-19

### Added

- New `zume.gulp()` function that returns the current gulp instance
- `zume.dest()` allows an argument to define a different output directory

### Changed

- Allow absolute paths as `src` option in the tasks
- Moved the zume options `cwd`, `url`, `src` and `dest` to the root of the options object.
- Merged configuration recursively

### Removed

- Dropped the ability to add a `MarkdownIt` instance to the markdown plugin.

### Fixed

- Webpack plugin uses now `fs-memory`. This fixes some troubles.

## [1.0.0-beta.1] - 2018-03-05

### Added

- Some task (html, files, img) builds incrementally, for a better performance.
- New `postcss()` plugin

### Changed

- Updated dependencies:
  - Gulp 4
  - Webpack 4
  - Babel 7
  - Cheerio 1
- Support for node >= 6

### Removed

- Removed `stylecow()` (replaced with `postcss` with plugins to get the same result)

## [0.15.1] - 2018-02-27

### Fixed

- The option `override` in `html.navigation()` should not only override but also insert missing sections.

## [0.15.0] - 2018-02-21

### Added

- New `src` option to customize the source directory in each task.

## [0.14.6] - 2017-10-06

### Fixed

- Fixed bug with `html.url()` on handle urls containing schemes, like `mailto:email@example.com`.

## [0.14.5] - 2017-10-05

### Fixed

- Improved error handling and displaying
- Added try/catch in yaml/front-matter plugins to keep running the server on errors
- Added ejs-lint to catch some errors and display more useful info

## [0.14.4] - 2017-10-03

### Fixed

- Improved stylecow plugin on catch errors

## [0.14.3] - 2017-09-28

### Fixed

- Fixed bug on execute markdown with non string values
- Fixed webpack error if there's no javascript files to proccess

## [0.14.2] - 2017-09-14

### Fixed

- Fixed watcher pattern used in `html`

## [0.14.1] - 2017-09-14

### Added

- New option `pretty` to `html.permalink()` to disable pretty urls.

### Changed

- Renamed option `index` to `pretty` in `html.urls()` plugin

## [0.14.0] - 2017-09-12

### Added

- Included `markdown-it-container` plugin by default
- Included `markdown-it-attrs` plugin by default
- New `html.yaml()` plugin to handle yaml files instead md

### Changed

- `html.permalink()` process all extensions, not only `.md`.

## [0.13.0] - 2017-08-10

### Changed

- `html.markdown()` insert `<br>` in line break by default.
- `js.webpack()` accepts a function to change the default config

## [0.12.0] - 2017-08-09

### Added

- Included `highlight.js` to format code in markdown

### Changed

- `html.markdown()` now accepts a function to customize the markdownIt instance, adding more plugins, etc.

## [0.11.0] - 2017-08-02

### Added

- New `.filter()` method added to all tasks.

### Fixed

- `zume.clear()` removes the entire build directory, even if the dest directory is a subdirectory inside build.

## [0.10.0] - 2017-07-31

### Added

- New `html.navigation()` plugin

## [0.9.2] - 2017-07-28

### Fixed

- Webpack publicPath configuration must end with `/`

## [0.9.1] - 2017-07-26

### Fixed

- In dev mode, add source maps to javascript
- Fixed plugins loading in stylecow

## [0.9.0] - 2017-07-26

### Added

- New `zume.img()` task
- Added `babel` and `babel-preset-env` by default as webpack loader

### Removed

- `zume.refresh()` was removed because it's executed automatically

### Fixed

- Fixed browsersync reload that was executed before the gulp task finished

## [0.8.1] - 2017-07-24

### Fixed

- Fixed `.pipe()` that didn't update the internal stream reference.

## [0.8.0] - 2017-07-21

### Changed

- Simplified the API. The gulp stream is included into the task, so instead `.pipe(html.permalink())`, now is simply `.permalink()`.
- The `.dest()` function includes automatically `.on('end', cb)` and `.pipe(zume.refresh())`.
- On create a new task, the `.src()` is executed automatically

## [0.7.0] - 2017-07-18

### Added

- `html.permalink()` can be configured in the frontmatter using the variable `permalink`. Example: `permalink: feed.xml`.
- New method `zume.fullUrl()` to return the url with the host.
- New task `html.cheerio()` to manipulate the html content

### Changed

- Renamed `html.relativeUrls()` to `html.urls()`.
- Added the option `relative` to `html.urls()` to make all urls relative each other or not.

### Fixed

- Fixed xml manipulation

## [0.6.1] - 2017-07-13

### Changed

- Ignored the pages with no template defined by the task `ejs()`.

## [0.6.0] - 2017-06-14

### Added

- Markdown task insert the functions `markdown` and `markdownInline` in all file data, to be used in the templates.
- Added the method `refresh()` to each task.

## [0.5.2] - 2017-06-13

### Fixed

- Fixed relative-urls

## [0.5.1] - 2017-06-13

### Fixed

- Fixed url configuration
- Require a previous stable version of cheerio

## [0.5.0] - 2017-06-09

### Added

- Added the method `html.relativeUrls()` to convert urls to relatives, allowing to open the page using the `file:` protocol.

### Fixed

- In some cases, the markdown-it object passed to `html.markdown()` was not property recognized as `MarkdownIt` instance.
- Moved gulp to a dependency (instead a devDependency).

## [0.4.0] - 2017-06-08

### Added

- Added the method `zume.each()` to execute a function for each file in gulp.

## [0.3.0] - 2017-05-24

### Added

- Added a second argument in `zume.html()`, `zume.css()`, `zume.js()` and `zume.files()` to customize the task directory.

## [0.2.0] - 2017-05-11

### Added

- New task `files` to copy files from src to dist
- Improved the task function `src(pattern, watchPattern)` adding a second argument to customize the pattern used by the watcher

### Fixed

- Improved the code style including php_codesniffer in development

## 0.1.0 - 2017-05-10

First version

[1.0.0-beta.4]: https://github.com/oscarotero/zume/compare/v1.0.0-beta.3...v1.0.0-beta.4
[1.0.0-beta.3]: https://github.com/oscarotero/zume/compare/v1.0.0-beta.2...v1.0.0-beta.3
[1.0.0-beta.2]: https://github.com/oscarotero/zume/compare/v1.0.0-beta.1...v1.0.0-beta.2
[1.0.0-beta.1]: https://github.com/oscarotero/zume/compare/v0.15.1...v1.0.0-beta.1
[0.15.1]: https://github.com/oscarotero/zume/compare/v0.15.0...v0.15.1
[0.15.0]: https://github.com/oscarotero/zume/compare/v0.14.6...v0.15.0
[0.14.6]: https://github.com/oscarotero/zume/compare/v0.14.5...v0.14.6
[0.14.5]: https://github.com/oscarotero/zume/compare/v0.14.4...v0.14.5
[0.14.4]: https://github.com/oscarotero/zume/compare/v0.14.3...v0.14.4
[0.14.3]: https://github.com/oscarotero/zume/compare/v0.14.2...v0.14.3
[0.14.2]: https://github.com/oscarotero/zume/compare/v0.14.1...v0.14.2
[0.14.1]: https://github.com/oscarotero/zume/compare/v0.14.0...v0.14.1
[0.14.0]: https://github.com/oscarotero/zume/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/oscarotero/zume/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/oscarotero/zume/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/oscarotero/zume/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/oscarotero/zume/compare/v0.9.2...v0.10.0
[0.9.2]: https://github.com/oscarotero/zume/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/oscarotero/zume/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/oscarotero/zume/compare/v0.8.1...v0.9.0
[0.8.1]: https://github.com/oscarotero/zume/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/oscarotero/zume/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/oscarotero/zume/compare/v0.6.1...v0.7.0
[0.6.1]: https://github.com/oscarotero/zume/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/oscarotero/zume/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/oscarotero/zume/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/oscarotero/zume/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/oscarotero/zume/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/oscarotero/zume/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/oscarotero/zume/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/oscarotero/zume/compare/v0.1.0...v0.2.0
