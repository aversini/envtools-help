/* eslint no-console:0*/
module.exports = function (grunt) {
  var
    path = require('path');

  // load plugins
  require('load-grunt-tasks')(grunt);

  // load envtools tasks
  grunt.loadTasks('envtools-grunt/tasks');

  // project configuration
  grunt.initConfig({
    // 'pkg': grunt.file.readJSON('tmp/repo/envtools/package.json'),

    'clean': ['./tmp/*', 'docs/index.html'],

    'gitclone': {
      envtools: {
        options: {
          repository: 'https://github.com/aversini/envtools.git',
          branch: 'master',
          directory: 'tmp/repo/envtools',
          depth: 1
        }
      }
    },

    'import': {
      options: {},
      help: {
        src: 'tmp/help.html',
        dest: 'tmp/index.html'
      }
    },

    'inline': {
      dist: {
        src: 'tmp/index.html',
        dest: 'index-inlined.html'
      }
    },

    'htmlmin': {
      help: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'docs/index.html': 'index-inlined.html'
        }
      }
    },

    'copy': {
      help: {
        files: [{
          src: ['data/templates/help/envtools-help.html'],
          dest: 'tmp/help.html'
        }]
      },
      images: {
        files: [{
          src: ['data/assets/images/**/*'],
          dest: 'docs/'
        }]
      },
      svg: {
        files: [{
          src: ['data/templates/help/envtools-svg-symbols.html'],
          dest: 'tmp/envtools-svg-symbols.html'
        }]
      },
      faq: {
        files: [{
          src: ['data/templates/help/envtools-faq.html'],
          dest: 'tmp/envtools-faq.html'
        }]
      },
      sinopia: {
        files: [{
          src: ['data/templates/help/envtools-sinopia.html'],
          dest: 'tmp/envtools-sinopia.html'
        }]
      },
      custom: {
        files: [{
          src: ['data/templates/help/envtools-custom.html'],
          dest: 'tmp/envtools-custom.html'
        }]
      },
      commands: {
        files: [{
          src: ['data/templates/help/envtools-commands.html'],
          dest: 'tmp/envtools-commands.html'
        }]
      },
      intro: {
        files: [{
          src: ['data/templates/help/envtools-intro.html'],
          dest: 'tmp/envtools-intro.html'
        }]
      },
      footer: {
        files: [{
          src: ['data/templates/help/envtools-footer.html'],
          dest: 'tmp/envtools-footer.html'
        }]
      },
      aliases: {
        files: [{
          src: ['data/templates/help/envtools-aliases.html'],
          dest: 'tmp/envtools-aliases.html'
        }]
      }
    },

    'markdown': {
      rawHistory: {
        files: [{
          expand: false,
          src: 'tmp/repo/envtools/HISTORY.md',
          dest: 'tmp/history-raw.html'
        }],
        options: {
          gfm: true,
          template: path.join('data', 'templates', 'help', 'envtools-history-raw.jst')
        }
      }
    },

    'concat': {
      options: {
        separator: ';\n'
      },
      css: {
        src: [
          'tmp/envtools-min.css',
          'data/assets/css/bootstrap.min.css',
          'tmp/highlight-min.css'
        ],
        dest: 'tmp/bundle.css'
      },
      js: {
        src: [
          'data/assets/js/jquery-3.1.1.slim.min.js',
          'data/assets/js/jquery.highlight.js',
          'data/assets/js/highlight.pack.js',
          'data/assets/js/bootstrap.min.js',
          'data/assets/js/lunr.min.js',
          'data/assets/js/envtools.js'
        ],
        dest: 'tmp/bundle.js'
      }
    },

    'autoprefixer': {
      options: {
        browsers: ['last 2 versions']
      },
      all: {
        src: 'data/assets/css/envtools.css',
        dest: 'tmp/envtools-with-prefixes.css'
      }
    },

    'cssmin': {
      target: {
        files: {
          'tmp/envtools-min.css': ['tmp/envtools-with-prefixes.css'],
          'tmp/highlight-min.css': ['data/assets/css/highlight/default.css']
        }
      }
    }
  });

  // register multi-tasks aliases
  grunt.registerTask('default', ['clean', 'gitclone', 'help-generate']);

  grunt.registerTask('help-generate', [
    'copy',
    'lunrjs-index',
    'help-json-data',
    'markdown:rawHistory',
    'autoprefixer',
    'cssmin',
    'concat:js',
    'concat:css',
    'import',
    'inline',
    'htmlmin'
  ]);
};
