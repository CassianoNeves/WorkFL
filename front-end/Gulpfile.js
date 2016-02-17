var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var open = require('gulp-open');
var os = require('os');
var bower = require('gulp-bower');
var bowerFiles = require('main-bower-files');

var DEFAULT = 'default',
    SASS = 'sass',
    SCRIPTS = 'scripts',
    TEMPLATES = 'templates',
    WATCH = 'watch',
    INDEX = 'index',
    CONNECT = 'connect',
    RELOAD = 'reload',
    OPEN = 'open',
    BOWER = 'bower',
    VENDOR = 'vendor'

var paths = {
  app : {
    index : './app/index.jade',
    sass : './app/style/**/*.scss',
    scripts : './app/scripts/**/*.js',
    templates : './app/templates/**/*.jade',
    bowerComponents : './bower_components'
  },
  dist : {
    index : './dist',
    sass : './dist/css',
    scripts : './dist/scripts',
    templates : './dist/templates',
    vendor : './dist/vendor'
  }
};

var HOST = 'http://localhost:3000',
    BROWSER = os.platform() === 'linux' ? 'google-chrome' : (os.platform() === 'win32' ? 'chrome' : 'firefox');

gulp.task(SASS, function () {
  gulp.src(paths.app.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.dist.sass));
});

gulp.task(SCRIPTS, function() {
  gulp.src(paths.app.scripts)
    .pipe(minify())
    .pipe(gulp.dest(paths.dist.scripts))
});

gulp.task(TEMPLATES, function() {
  gulp.src(paths.app.templates)
    .pipe(jade())
    .pipe(gulp.dest(paths.dist.templates))
});

gulp.task(INDEX, function() {
  gulp.src(paths.app.index)
    .pipe(jade())
    .pipe(gulp.dest(paths.dist.index))
});

gulp.task(CONNECT, function() {
  connect.server({
    root: paths.dist.index,
    livereload: true,
    port: 3000
  });
});

gulp.task(RELOAD, function() {
  gulp.src(paths.app.index)
    .pipe(connect.reload())
});

gulp.task(OPEN, function(){
  var options = {
    uri: HOST,
    app:BROWSER
  };

  gulp.src(__filename)
  .pipe(open(options));
});

gulp.task(WATCH, function() {
  gulp.watch([paths.app.index], [INDEX, RELOAD]);
  gulp.watch([paths.app.sass], [SASS, RELOAD]);
  gulp.watch([paths.app.scripts], [SCRIPTS, RELOAD]);
  gulp.watch([paths.app.templates], [TEMPLATES, RELOAD]);
});

gulp.task(BOWER, function() {
  return bower()
    .pipe(gulp.dest(paths.app.bowerComponents))
});

gulp.task(VENDOR, function() {
  return gulp.src(bowerFiles())
    .pipe(gulp.dest(paths.dist.vendor));
});

gulp.task(DEFAULT, [INDEX, SASS, SCRIPTS, TEMPLATES, CONNECT, WATCH, OPEN, BOWER, VENDOR]);
