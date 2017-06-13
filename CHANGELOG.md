# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

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

[0.5.2]: https://github.com/oscarotero/zume/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/oscarotero/zume/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/oscarotero/zume/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/oscarotero/zume/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/oscarotero/zume/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/oscarotero/zume/compare/v0.1.0...v0.2.0