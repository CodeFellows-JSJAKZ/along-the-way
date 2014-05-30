var gulp = require('gulp');
var browserify = require('browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var hbsfy = require('hbsfy');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var shell = require('gulp-shell');

// define paths once
var DIRS = {
  SRC: './app/',
  DIST: './dist/',
  TEST: './test/',
	STYLES: 'styles/'
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

/* bundle-tests - browserify tests */
gulp.task('js-test', function () {
	return browserify(DIRS.TEST + 'browser/requirements.js')
			.transform(hbsfy)
			.bundle()
			.pipe(source('test.js'))
			.pipe(buffer())
			.pipe(gulp.dest(DIRS.TEST + 'browser/'));
});

/* test-watch - watch for changes and re-bundle tests as needed */
gulp.task('test-watch', function () {
	gulp.watch([DIRS.TEST + 'browser/*.js', '!' + DIRS.TEST + 'browser/test.js'], ['js-test'])
    .on('change', function() {
      console.log('Oh, a change!');
    });
});

// styles - turn scss into css, move to BUILD
gulp.task('styles', ['clean'], function () {
	var src = DIRS.SRC + DIRS.STYLES + '*.less';
	return gulp.src(src)
			.pipe(less({compress: true}))
			.pipe(concat('main.css'))
			.pipe(gulp.dest(DIRS.DIST + DIRS.STYLES));
});

// js - browserify SRC js and reqs into single client.js file
gulp.task('js', ['clean'], function() {
  var start = DIRS.SRC + 'js/router.js';
  return browserify(start)
    .transform(hbsfy)
    .bundle()
    .pipe(source('js/client.js'))
    .pipe(buffer())
    .pipe(gulp.dest(DIRS.DIST));
});

// uglify - compress js for prod
gulp.task('uglify', ['js'], function () {
	return gulp.src(DIRS.DIST + 'js/client.js')
			.pipe(uglify())
			.pipe(gulp.dest(DIRS.DIST + 'js/'));
});

// clean - empty out the /dist folder
gulp.task('clean', function () {
	return gulp.src([DIRS.DIST + '**/*', DIRS.DIST + '*.*'], {read: false})
    .pipe(clean());
});

// html - copy from SRC to BUILD
gulp.task('html', function() {
  gulp.src(DIRS.SRC + '**/*.html', {base: DIRS.SRC})
    .pipe(gulp.dest(DIRS.DIST));
});

// images - copy from SRC to BUILD
gulp.task('img', ['clean'], function() {
  gulp.src(DIRS.SRC + 'images/*.*', {base: DIRS.SRC})
    .pipe(gulp.dest(DIRS.DIST));
});

// lint - run jshint on our code
gulp.task('lint', function() {
  return gulp.src(['*.js', DIRS.SRC + '**/*.js', DIRS.TEST + '**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('serve', ['build'], function() {
  gulp.src('').pipe(shell(['node server.js']));
  return gulp.watch([DIRS.SRC + '**/*.*'], ['build']);
});

// build - runs the standard suite of development building
gulp.task('build', ['clean', 'html', 'styles', 'js', 'img']);

// ship - prepare code for deployment
gulp.task('ship', ['clean', 'html', 'styles', 'lint', 'js', 'uglify', 'img']);

// test - bundle tests and watch for changes
gulp.task('test', ['js-test', 'test-watch']);

