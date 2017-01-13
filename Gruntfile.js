module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        'asi': true,
        "esnext":true,
        'eqeqeq': true,
        'forin': true,
        'freeze': true,
        'latedef': false,
        'maxparams': 10,
        'noarg': true,
        'nocomma': false,
        'nonew': true,
        'predef': ['module', 'require'],
        'undef': true,
        'unused': false,
        'browser': true,
        'devel': true,
      },
      uses_defaults: ['routes/**/*.js', 'models/**/*.js', 'libs/**/*.js', '*.js']
    },

  });

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );

  grunt.registerTask( 'default', [ 'jshint' ] );

};