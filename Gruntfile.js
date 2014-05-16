'use strict';

module.exports = function(grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configuration
  grunt.initConfig({
    bowerrc: grunt.file.readJSON('.bowerrc'),
    dirs: {
      app: 'app',
      dist: 'dist',
      vendor: 'assets/bower_components'
    },
    'bower-install': {
      app: {
        html: '<%= dirs.app %>/index.html',
        ignorePath: '<%= dirs.app %>/'
      }
    },
    browserify: {
      vendor: {
        src: [
          '<%= dirs.vendor %>/jquery/dist/jquery.js',
          '<%= dirs.vendor %>/lodash/dist/lodash.js',
          '<%= dirs.vendor %>/backbone/backbone.js'
        ],
        dest: '.tmp/scripts/vendor.js',
        options: {
          debug: true,
          shim: {
            jquery: {
              path: '<%= dirs.vendor %>/jquery/dist/jquery.js',
              exports: '$'
            },
            lodash: {
              path: '<%= dirs.vendor %>/lodash/dist/lodash.js',
              exports: '_'
            },
            backbone: {
              path: '<%= dirs.vendor %>/backbone/backbone.js',
              exports: 'Backbone',
              depends: {
                jquery: '$',
                lodash: '_'
              }
            }
          },
          alias: [
            '<%= dirs.vendor %>/lodash/dist/lodash.js:underscore',
            '<%= dirs.vendor %>/backbone/backbone.js:backbone'
          ],
          transform: ['debowerify']
        }
      },
      dev: {
        src: ['<%= dirs.app %>/scripts/main.js'],
        dest: '.tmp/scripts/main.js',
        options: {
          debug: true,
          external: ['jquery', 'lodash', 'backbone']
        }
      },
      test: {
        src: ['test/{,*/}*.js'],
        dest: '.tmp/test/test.js',
        options: {
          debug: true,
          external: ['jquery', 'lodash', 'backbone']
          // ignore: ['test/lib/*.js', 'test/spec/*.js']
        }
      }
    },
    express: {
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server.js'
        }
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= dirs.app %>'
          ]
        }
      },
      test: {
        options: {
          base: [
            '.tmp',
            'test',
            '<%= dirs.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: '',
          livereload: false
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= dirs.dist %>/*',
            '!<%= dirs.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: [
        'Gruntfile.js',
        '<%= dirs.app %>/scripts/{,*/}*.js',
        '!<%= dirs.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    sass: {
      dev: {
        options: {
          includePaths: ['<%= dirs.app %>/scss', '<%= dirs.vendor %>/foundation/scss']
        },
        files: {
          '.tmp/styles/app.css': '<%= dirs.app %>/scss/app.scss'
        }
      },
      dist: {
        options: {
          includePaths: ['<%= dirs.app %>/scss', '<%= dirs.vendor %>/foundation/scss']
        },
        files: {
          '<%= dirs.dist %>/styles/app.css': '<%= dirs.app %>/scss/app.scss'
        }
      },
      'dist-min': {
        options: {
          outputStyle: 'compressed',
          includePaths: ['<%= dirs.app %>/scss', '<%= dirs.vendor %>/foundation/scss']
        },
        files: {
          '<%= dirs.dist %>/styles/app.min.css': '<%= dirs.app %>/scss/app.scss'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>'
      },
      dev: {
        src: ['.tmp/scripts/vendor.js', '.tmp/scripts/main.js'],
        dest: '.tmp/scripts/app.js'
      },
      dist: {
        src: ['.tmp/scripts/vendor.js', '.tmp/scripts/main.js'],
        dest: '.tmp/scripts/app.js'
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= dirs.dist %>/scripts/{,*/}*.js',
            '<%= dirs.dist %>/styles/{,*/}*.css',
            '<%= dirs.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}',
            '<%= dirs.dist %>/styles/fonts/{,*/}*.*'
          ]
        }
      }
    },
    useminPrepare: {
      options: {
        dest: '<%= dirs.dist %>'
      },
      html: '<%= dirs.app %>/index.html'
    },
    usemin: {
      options: {
        assetsDirs: ['<%= dirs.dist %>']
      },
      html: ['<%= dirs.dist %>/{,*/}*.html'],
      css: ['<%= dirs.dist %>/styles/{,*/}*.css']
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= dirs.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= dirs.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= dirs.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= dirs.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/dirs/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= dirs.app %>',
          src: '*.html',
          dest: '<%= dirs.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= dirs.app %>',
          dest: '<%= dirs.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.webp',
            'styles/fonts/{,*/}*.*' 
          ]
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= dirs.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    modernizr: {
      devFile: '<%= dirs.vendor %>/modernizr/modernizr.js',
      outputFile: '<%= dirs.dist %>/bower_components/modernizr/modernizr.js',
      files: [
        '<%= dirs.dist %>/scripts/{,*/}*.js',
        '<%= dirs.dist %>/styles/{,*/}*.css',
        '!<%= dirs.dist %>/scripts/vendor/*'
      ],
      uglify: true
    },
    concurrent: {
      server: [
        'sass:dev',
        'browserify:dev',
        'browserify:vendor',
        'copy:styles'
      ],
      test: [
        'copy:styles',
        'jshint',
        'browserify:vendor',
        'browserify:dev',
        'browserify:test'
      ],
      dist: [
        'sass:dist',
        'browserify',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    shell: {
      mongo: {
        command: 'mongod',
        options: {
          async: true
        }
      }
    }
  });

  // grunt serve
  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'concat:dev',
      'autoprefixer',
      'shell',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function() {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  // grunt test
  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'mocha',
    'watch'
  ]);

  // grunt build
  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'modernizr',
    'copy:dist',
    'rev',
    'usemin'
  ]);

  // grunt default - jshint, test, build
  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
