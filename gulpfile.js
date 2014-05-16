var gulp = require('gulp');
var browserify = require('browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

// define paths once
var DIRS = {
  SRC: 'app',
  BUILD: 'dist',
  _STYLES: '/styles',
  TEST: 'test'
};

// default - display available tasks if just 'gulp' is entered
gulp.task('default', function() {
  console.log('Gulp tasks:');
  var tasks = gulp.tasks;
  for (var name in tasks) {
    if (tasks[name].dep.length > 0) {
      console.log('  ' + name + ' (' + tasks[name].dep.join(', ') + ')');
    } else {
      console.log('  ' + name + '');
    }
  }
});

// test - run mocha on js files in TEST
gulp.task('test', function() {
  console.log('Running tests in ' + DIRS.TEST);
  return gulp.src(DIRS.TEST + '/**/*.js')
    .pipe(mocha({reporter: 'list'}));
});

// clean - empty out the BUILD folder
gulp.task('clean', function() {
  console.log('Cleaning ' + DIRS.BUILD);
  return gulp.src([DIRS.BUILD + '/**/*', DIRS.BUILD + '/.*'], {read: false})
    .pipe(clean());
});

// styles - turn scss into css, move to BUILD
gulp.task('styles', function() {
  var src = DIRS.SRC + DIRS._STYLES + '/*.scss';
  console.log('Processing scss from ' + src);
  return gulp.src(src)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(DIRS.BUILD + DIRS._STYLES));
});

// js - browserify SRC js and reqs into single client.js file
gulp.task('js', function() {
  var start = './' + DIRS.SRC + '/js/router.js';
  console.log('Bundling reqs starting at ' + start);
  return browserify(start).bundle()
    .pipe(source('client.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(DIRS.BUILD + '/'));
});

// html - copy html from SRC to BUILD
gulp.task('html', function() {

});

// lint - run jshint on our code
gulp.task('lint', function() {
  return gulp.src(['*.js', DIRS.SRC + '/**/*.js', DIRS.TEST + '/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
    //.pipe(jshint.reporter('fail')); // make task fail if there are errors
});

// build - runs a series of tasks. see 2nd param
gulp.task('build', ['clean', 'lint', 'styles', 'js'], function() {
  console.log('Build complete.');
}); 

// serve - run express server. see on change
gulp.task('serve', function() {
  nodemon({script: 'server.js', ext: 'html js'})
    .on('change', ['build'])
    .on('restart', function() {
      console.log('Server restarted');
    });
});
