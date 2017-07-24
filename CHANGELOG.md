# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## 0.8.1 - 2017-07-24

### Fixed

* Fixed `.pipe()` that didn't update the internal stream reference.

## 0.8.0 - 2017-07-21

### Changed

* Simplified the API. The gulp stream is included into the task, so instead `.pipe(html.permalink())`, now is simply `.permalink()`.
* The `.dest()` function includes automatically `.on('end', cb)` and `.pipe(zume.refresh())`.
* On create a new task, the `.src()` is executed automatically

## [0.7.0] - 2017-07-18

### Added

* `html.permalink()` can be configured in the frontmatter using the variable `permalink`. Example: `permalink: feed.xml`.
* New method `zume.fullUrl()` to return the url with the host.
* New task `html.cheerio()` to manipulate the html content

### Changed

* Renamed `html.relativeUrls()` to `html.urls()`.
* Added the option `relative` to `html.urls()` to make all urls relative each other or not.

### Fixed

* Fixed xml manipulation

## [0.6.1] - 2017-07-13

### Changed

* Ignored the pages with no template defined by the task `ejs()`.

## [0.6.0] - 2017-06-14

### Added

* Markdown task insert the functions `markdown` and `markdownInline` in all file data, to be used in the templates.
* Added the method `refresh()` to each task.

## [0.5.2] - 2017-06-13

### Fixed

* Fixed relative-urls

## [0.5.1] - 2017-06-13

### Fixed

* Fixed url configuration
* Require a previous stable version of cheerio

## [0.5.0] - 2017-06-09

### Added

* Added the method `html.relativeUrls()` to convert urls to relatives, allowing to open the page using the `file:` protocol.

### Fixed

* In some cases, the markdown-it object passed to `html.markdown()` was not property recognized as `MarkdownIt` instance.
* Moved gulp to a dependency (instead a devDependency).

## [0.4.0] - 2017-06-08

### Added

* Added the method `zume.each()` to execute a function for each file in gulp.

## [0.3.0] - 2017-05-24

### Added

* Added a second argument in `zume.html()`, `zume.css()`, `zume.js()` and `zume.files()` to customize the task directory.

## [0.2.0] - 2017-05-11

### Added

* New task `files` to copy files from src to dist
* Improved the task function `src(pattern, watchPattern)` adding a second argument to customize the pattern used by the watcher

### Fixed

* Improved the code style including php_codesniffer in development

## 0.1.0 - 2017-05-10

First version

[0.7.0]: https://github.com/oscarotero/zume/compare/v0.6.1...v0.7.0
[0.6.1]: https://github.com/oscarotero/zume/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/oscarotero/zume/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/oscarotero/zume/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/oscarotero/zume/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/oscarotero/zume/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/oscarotero/zume/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/oscarotero/zume/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/oscarotero/zume/compare/v0.1.0...v0.2.0