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
        .inline({dest: true})
        .dest()
);

gulp.task('js', () => zume.js().webpack().dest());
gulp.task('css', () => zume.css().postcss().dest());
gulp.task('img', () => zume.img().dest());
gulp.task('files', () => zume.files({src: 'files'}).dest());

gulp.task('default', gulp.series('clear', 'js', 'css', 'img', 'files', 'html'));
gulp.task('server', gulp.series('default', () => zume.serve()));
