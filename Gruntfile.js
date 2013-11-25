/*
 * grunt-glue-hcm
 * https://github.com/potatolondon/grunt-glue-hcm
 *
 * Copyright (c) 2013 Potato
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run
    glue: {
      dev: {
        files : [{
          src : 'test/img/sprite/',
          img : 'test/img/',
          css : 'test/css/'
        }],
        options: {
          retina: true,
          optipng: true,
          recursive: true,
          "high-contrast-mode": true,
          "sprite-namespace": "sprite"
        }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // By default, lint all the files.
  grunt.registerTask('default', ['jshint']);
};