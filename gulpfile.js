/**
 * Created by ben on 28/10/14.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
    gulp.src('./less/whirlwind.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./app/whirlwind.css'));
});
gulp.task('default', ['less']);
