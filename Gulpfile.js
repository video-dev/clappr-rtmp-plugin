var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var es6ify = require('es6ify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var exec = require('child_process').exec;
var args = require('yargs').argv;
var express = require('express');
var util = require('gulp-util');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify')
var streamify = require('gulp-streamify')

var files = {
  css:  'public/*.css',
  scss: 'public/*.scss',
  html: 'public/*.html'
};

gulp.task('pre-build', ['sass', 'copy-html', 'copy-css'], function(done) {
  return exec('node bin/hook.js', done);
});

gulp.task('build', ['pre-build'], function(b) {
  return browserify()
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .add(es6ify.runtime)
    .add('./index.js', {entry: true})
    .external('ui_plugin')
    .external('ui_object')
    .external('base_object')
    .external('browser')
    .external('zepto')
    .external('underscore')
    .external('media_control')
    .external('playback')
    .external('core_plugin')
    .external('ui_core_plugin')
    .external('container_plugin')
    .external('ui_container_plugin')
    .external('flash')
    .external('mediator')
    .bundle()
    .pipe(source('main.js'))
    .pipe(rename( 'rtmp.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('release', ['pre-build'], function() {
  return browserify()
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .add(es6ify.runtime)
    .add('./index.js', {entry: true})
    .external('ui_plugin')
    .external('ui_object')
    .external('base_object')
    .external('browser')
    .external('zepto')
    .external('underscore')
    .external('media_control')
    .external('playback')
    .external('core_plugin')
    .external('ui_core_plugin')
    .external('container_plugin')
    .external('ui_container_plugin')
    .external('mediator')
    .external('flash')
    .bundle()
    .pipe(source('main.js'))
    .pipe(rename( 'rtmp.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
    return gulp.src(files.scss)
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(gulp.dest("build"));
});

gulp.task("copy-css", function() {
  return gulp.src(files.css)
    .pipe(minifyCSS())
    .pipe(gulp.dest('build'));
});

gulp.task("copy-html", function() {
  return gulp.src(files.html)
    .pipe(gulp.dest('build'));
});

gulp.task('serve', ['build', 'watch'], function() {
  express()
    .use(express.static('.'))
    .use(express.static('./dist'))
    .listen(3000);
  util.log(util.colors.bgGreen('Listening on port 3000'));
});


gulp.task('watch', function() {
  var reloadServer = livereload();

  var js = gulp.watch('./*.js');
  js.on('change', function(event) {
    gulp.start('build', function() {
      reloadServer.changed(event.path);
    });
  });

  var assets = gulp.watch('./public/*.{html,scss,css}');
  assets.on('change', function(event) {
    gulp.start(['build'], function() {
      reloadServer.changed(event.path);
    });
  });
  util.log(util.colors.bgGreen('Watching for changes...'));
});


