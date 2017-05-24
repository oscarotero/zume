# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

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

[0.2.0]: https://github.com/oscarotero/zume/compare/v0.1.0...v0.2.0