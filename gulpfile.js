'use strict';

var gulp = require('gulp'),
  request = require('request'),
  fs = require('fs'),
  del = require('del'),
  path = require('path'),
  globule = require('globule'),
  merge = require('merge-stream'),
  mkdirp = require('mkdirp'),

  replace = require('gulp-replace'),
  changed = require('gulp-changed'),
  unzip = require('gulp-unzip');

var URL = 'https://github.com/espruino/EspruinoDocs/archive/master.zip',
  modulesDir = __dirname,
  buildDir = path.join(__dirname, 'build'),
  filename = path.join(buildDir, 'EspruinoDocs.zip'),
  extractTo = path.join(buildDir, 'EspruinoDocs-master'),

  getModules = function getModules() {
    return globule.find(path.join(extractTo, 'modules', '*.js'),
      path.join(extractTo, 'devices', '*.js'));
  };

gulp.task('make-build-dir', function (cb) {
  mkdirp(buildDir, cb);
});

gulp.task('clean-modules', function () {
  getModules.forEach(function (module) {
    del.sync(path.join(modulesDir, path.basename(module)));
  });
});

gulp.task('clean-build-dir', function (cb) {
  del(buildDir, cb);
});

gulp.task('fetch', ['make-build-dir'], function () {
  var fileStream;
  if (fs.existsSync(filename)) {
    return;
  }
  fileStream = fs.createWriteStream(filename);
  return request.get(URL)
    .pipe(fileStream);
});

gulp.task('unzip', ['fetch'], function () {
  if (fs.existsSync(extractTo)) {
    return;
  }
  return gulp.src(filename)
    .pipe(unzip())
    .pipe(gulp.dest(buildDir));
});

gulp.task('copy', ['unzip'], function () {

  var streams = getModules()
    .map(function (filepath) {
      return gulp.src(filepath)
        .pipe(changed(modulesDir))
        .pipe(gulp.dest(modulesDir));
    });

  return merge.apply(null, streams);
});

gulp.task('fix', ['copy'], function () {
  return gulp.src(path.join(modulesDir, '*.js'))
    .pipe(replace(/0b([01]+)/g, 'parseInt("$1", 2)'))
    .pipe(gulp.dest(modulesDir));
});

gulp.task('clean', ['clean-modules', 'clean-build-dir']);
gulp.task('install', ['fix']);
gulp.task('default', ['install']);
