'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-crx');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    manifest: grunt.file.readJSON('app/manifest.json'),

    // specifying JSHint options and globals
    jshint: {
      options: {
        browser: true,
        eqeqeq: true,
        curly: true,
        validthis: true,
        globalstrict: true,
        indent: 2,
        undef: true,
        unused: true,
        trailing: true,
        jquery: true,
        globals: {
          chrome: true,
          webkitRequestAnimationFrame: true,
          App: true,
          Camera: true,
          Twitter: true,
          CanvasImage: true,
          OAuthSimple: true
        }
      },
      files: ['app/js/*.js']
    },

   qunit: {
      all: ['test/**/*.html']
    },

    crx: {
      staging: {
        "src": "app",
        "dest": "dist/staging",
        "filename": "<%= pkg.name %>-<%= manifest.version %>-dev.crx",
        "baseURL": "https://twitter.com/twisitor", // we need a legit URL
        "exclude": [ ".git", "*.pem" ]
      },
      production: {
        "src": "app",
        "dest": "dist/production",
        "baseURL": "https://twitter.com/twisitor", // we need a legit URL
        "exclude": [ ".git", "*.pem" ]
      }
    }

  });

  grunt.registerTask('build',   ['jshint', 'crx']);
  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['test']);

};
