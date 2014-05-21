var gulp = require('gulp');
var browserify = require('browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var hbsfy = require('hbsfy');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
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
  var src = DIRS.SRC + DIRS._STYLES + '/*.less';
  console.log('Processing less from ' + src);
  return gulp.src(src)
    .pipe(less({compress: true}))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(DIRS.BUILD + DIRS._STYLES));
});

// js - browserify SRC js and reqs into single client.js file
gulp.task('js', function() {
  var start = './' + DIRS.SRC + '/js/app.js';
  console.log('Bundling reqs starting at ' + start);
  return browserify(start)
    .transform(hbsfy)
    .bundle()
    .pipe(source('js/client.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(DIRS.BUILD + '/'));
});

// html - copy html from SRC to BUILD
gulp.task('html', function() {
  gulp.src(DIRS.SRC + '/**/*.html', {base: DIRS.SRC + '/'})
    .pipe(gulp.dest(DIRS.BUILD));
});

// images - copy images from SRC to BUILD
gulp.task('img', function() {
  gulp.src(DIRS.SRC + '/images/*.*', {base: DIRS.SRC + '/'})
    .pipe(gulp.dest(DIRS.BUILD));
});

// lint - run jshint on our code
gulp.task('lint', function() {
  return gulp.src(['*.js', DIRS.SRC + '/**/*.js', DIRS.TEST + '/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
    //.pipe(jshint.reporter('fail')); // make task fail if there are errors
});

// build - runs a series of tasks. see 2nd param
gulp.task('build', ['clean', 'lint', 'html', 'styles', 'js', 'img'], function() {
  console.log('Build complete.');
});

// serve - run express server. see on change
gulp.task('serve', ['build'], function() {
  nodemon({script: 'server.js', ext: 'html js less', ignore: ['node_modules/', DIRS.BUILD + '/']})
    .on('change', ['build'])
    .on('restart', function() {
      console.log('Server restarted');
    });
});
