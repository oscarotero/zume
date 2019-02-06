#!/usr/bin/env node

const zume = require('./src/index').create();
const gulp = zume.gulp();

gulp.task('clear', () => zume.clear());

gulp.task('html', () => 
    zume.html()
        .frontMatter()
        .markdown()
        .permalink()
        .ejs()
        .urls()
        .inline({dest: true})
        .dest()
);

gulp.task('js', () => zume.js().webpack().dest());
gulp.task('css', () => zume.css().postcss().dest());
gulp.task('img', () => zume.img().dest());
gulp.task('files', () => zume.files({src: 'files'}).dest());

gulp.task('default', gulp.series('clear', 'js', 'css', 'img', 'files', 'html'));
gulp.task('server', gulp.series('default', () => zume.serve()));
gulp.task('init', () => 
    gulp.src('**/*', {
        cwd: __dirname + '/init'
    })
    .pipe(gulp.dest('src'))
);

const argv = require('yargs-parser')(process.argv.slice(2));
const task = argv._[0] || 'default';

switch (task) {
    case 'init':
    case 'clear':
    case 'default':
    case 'server':
        gulp.series(task)(err => {
            if (err) {
                warn(err);
            }
        });
        break;
    default:
        warn(`Unknow command: ${task}`);
        break;
}

function warn(message) {
    console.error('\u001b[' + 31 + 'm' + message + '\u001b[' + 39 + 'm');
}