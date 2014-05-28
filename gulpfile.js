/* globals require, console */

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
//var watchify = require('watchify');

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


/*
Testing!
*/

gulp.task('unit-test', function() {
  console.log('Running tests in ' + DIRS.TEST);
  return gulp.src(DIRS.TEST + 'unit/**/*.test.js')
    .pipe(mocha({reporter: 'list'}));
});

gulp.task('js-test', function () {
	return browserify(DIRS.TEST + 'browser/requirements.js')
			//.transform(hbsfy)
			.bundle()
			.pipe(source('test.js'))
			.pipe(buffer())
			.pipe(gulp.dest(DIRS.TEST + 'browser/'));
});

gulp.task('test-watch', function () {
	gulp
		.watch([DIRS.TEST + 'browser/*.js', '!' + DIRS.TEST + 'browser/test.js'], ['js-test'])
			.on('change', function(event) {
				console.log('Oh, a change!');
			});
});


/*
Styling!
*/

// styles - turn scss into css, move to BUILD
gulp.task('styles', function () {
	var src = DIRS.SRC + DIRS.STYLES + '*.less';
	console.log('Processing less from ' + src);
	return gulp.src(src)
			.pipe(less({compress: true}))
			.pipe(concat('main.css'))
			.pipe(gulp.dest(DIRS.DIST + DIRS.STYLES));
});

gulp.task('styles-watch', function () {
	gulp
			.watch(DIRS.SRC + DIRS.STYLES + '*.less', ['styles'])
			.on('change', function (event) {
				console.log('LESS converting to CSS ...');
			});
});

/*
JavaScript!
*/

// js - browserify SRC js and reqs into single client.js file
gulp.task('js', ['clean'], function() {
  var start = DIRS.SRC + 'js/router.js';
  console.log('Bundling reqs starting at ' + start);
  return browserify(start)
    .transform(hbsfy)
    .bundle()
    .pipe(source('js/client.js'))
    .pipe(buffer())
    .pipe(gulp.dest(DIRS.DIST));
});

// js - browserify SRC js and reqs into single client.js file
gulp.task('uglify', function () {
	return gulp.src(DIRS.DIST + 'js/client.js')
			.pipe(uglify())
			.pipe(gulp.dest(DIRS.DIST));
});


/*
Other stuff!
*/

// clean - empty out the /dist folder
gulp.task('clean', function () {
	console.log('Cleaning ' + DIRS.DIST);
	gulp
			.src([DIRS.DIST + '**/*', DIRS.DIST + '*.*'], {read: false})
			.pipe(clean());
});

// html - copy html from SRC to BUILD
gulp.task('html', function() {
  gulp.src(DIRS.SRC + '**/*.html', {base: DIRS.SRC})
    .pipe(gulp.dest(DIRS.DIST));
});

// images - copy images from SRC to BUILD
gulp.task('img', function() {
  gulp.src(DIRS.SRC + 'images/*.*', {base: DIRS.SRC})
    .pipe(gulp.dest(DIRS.DIST));
});

// lint - run jshint on our code
gulp.task('lint', function() {
  return gulp.src(['*.js', DIRS.SRC + '**/*.js', DIRS.TEST + '**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// serve - run express server. see on change
gulp.task('serve', ['build'], function() {
  nodemon({
		script: 'server.js',
		ext: 'html js less hbs',
		ignore: [
			'node_modules/**/*',
			DIRS.DIST + '**/*'
		]
  })
    .on('change', ['build'])
    .on('restart', function() {
      console.log('Server restarted');
    });
});


/*
Task groups!
*/

// build - runs the standard suite of development building
gulp.task('build', ['clean', 'html', 'styles', 'js', 'img']);

// ship - ready to deploy
gulp.task('ship', ['clean', 'html', 'styles', 'lint', 'js', 'uglify', 'img']);

// test - pared down process for testing
gulp.task('test', ['js-test', 'unit-test', 'test-watch']);

// test - pared down process for testing
gulp.task('styling', ['styles', 'styles-watch']);