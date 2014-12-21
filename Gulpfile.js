var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');

gulp.task('default', function () {
  gulp.src('react/**/*.jsx')
      .pipe(react())
      .pipe(gulp.dest('build'))
      .pipe(concat('pack.js'))
      .pipe(gulp.dest('dist'))
});
