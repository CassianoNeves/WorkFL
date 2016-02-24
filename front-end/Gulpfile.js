var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var open = require('gulp-open');
var os = require('os');
var bower = require('gulp-bower');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var watch = require('gulp-watch');

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
  return gulp.src(paths.app.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.dist.sass));
});

gulp.task(SCRIPTS, function() {
  return gulp.src(paths.app.scripts)
    .pipe(gulp.dest(paths.dist.scripts))
});

gulp.task(TEMPLATES, function() {
  return gulp.src(paths.app.templates)
    .pipe(jade())
    .pipe(gulp.dest(paths.dist.templates))
});

gulp.task(BOWER, function() {
  return bower()
    .pipe(gulp.dest(paths.app.bowerComponents))
});

gulp.task(VENDOR, function() {
  return gulp.src(bowerFiles())
    .pipe(gulp.dest(paths.dist.vendor));
});

gulp.task(INDEX, [SASS, SCRIPTS, TEMPLATES], function() {
  var sources = gulp.src([
      paths.dist.sass + '/**/*.css',
      paths.dist.scripts + '/**/*.js',
      paths.dist.vendor + '/**/*'
    ], {addRootSlash: false, ignorePath: '/dist'});


  return gulp.src(paths.app.index)
    .pipe(inject(sources))
    .pipe(jade())
    .pipe(gulp.dest(paths.dist.index))
});

// No Linux para funcionar o reload, é preciso instalar a extensão no browser do 'LiveReload'
gulp.task(CONNECT, function() {
  connect.server({
    root: paths.dist.index,
    livereload: true,
    port: 3000
  });
});

gulp.task(RELOAD, [INDEX], function() {
  gulp.src(paths.app.index)
    .pipe(connect.reload());
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
  watch([
      paths.app.index,
      paths.app.sass,
      paths.app.scripts,
      paths.app.templates
    ],
    function() {
      gulp.start(RELOAD);
    });
});

gulp.task(DEFAULT, [BOWER, VENDOR, CONNECT, OPEN, INDEX, WATCH]);
