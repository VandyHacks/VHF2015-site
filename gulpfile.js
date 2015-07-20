'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var watchLess = require('gulp-watch-less');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var del = require('del');
var htmlreplace = require('gulp-html-replace');

var buildJS = function (dev) {
  // add custom browserify options here
  var customOpts = {
    entries: ['public/js/app.js'],
    debug: true
  };
  var opts = assign({}, watchify.args, customOpts);

  var b;
  if (dev) {
    b = watchify(browserify(opts))
          .transform(reactify, {es6: true});
  } else {
    b = browserify(opts)
          .plugin('minifyify', {
            output: 'public/js/bundle.js.map',
            compress: { // Options passed to Uglify
              drop_debugger: true,
              drop_console: true
            }
          })
          .transform(reactify, {es6: true});
  }

  function bundle() {
    return b.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('public/js/'));
  }

  if (dev) {
    b.on('update', bundle); // on any dep update, runs the bundler
  }

  b.on('log', gutil.log); // output build logs to terminal

  return bundle();
};

/***** DEV TASKS *****/
gulp.task('watch-js', function() {
  buildJS(true);
});

gulp.task('watch-less', function() {
  gulp.src('public/css/style.less')
      .pipe(watchLess('public/css/style.less'))
      .pipe(less())
      .pipe(gulp.dest('public/css'));
});

gulp.task('dev', ['watch-js', 'watch-less']);

/***** PROD TASKS *****/
gulp.task('html', function() {
  gulp.src('public/index.html')
    .pipe(htmlreplace({
      'css': 'css/styles.min.css',
    }))
    .pipe(gulp.dest('public/'));
});

gulp.task('js', function() {
  del([
    'public/js/bundle.js',
  ], function() {
    buildJS(false);
  });
});

gulp.task('less', function() {
  del([
    'public/css/style.css',
  ], function() {
    var compiledCSS = gulp.src('public/css/style.less')
      .pipe(less())
      .pipe(minifyCss());

    var libCSS = gulp.src(['public/css/*.css']);

    merge(compiledCSS, libCSS)
      .pipe(minifyCss())
      .pipe(concat("styles.min.css"))
      .pipe(gulp.dest('public/css'));
  });
});

gulp.task('prod', ['html', 'js', 'less']);
