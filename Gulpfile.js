var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
  gulp.src('react/**/*.jsx')
      .pipe(react())
      .pipe(gulp.dest('build'))
      .pipe(concat('packed.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
});
