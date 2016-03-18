'use strict';

module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['app/index.html'],
                ignorePath: /\.\.\//
            }
        },

        // Reads usemin blocks in HTML file and creates minified, 
        //concatenated and revision file. 
        useminPrepare: {
            html: ['app/index.html'],
            options: {
                dest: 'build'
            }
        },

        // Performs rewrites based on the useminPrepare configuration
        usemin: {
            html: ['build/index.html']
        },

        /*copy: {
            html: {
                src: ['app/index.html'],
                dest: 'app/build/'
            }
        },*/

        //Validate files with 
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
                ignores: ['app/scripts/vendors/**'],
            },
            all: [
                'Gruntfile.js',
                'app/scripts/**',
            ]
        },

        //CSS file is created with compliling less. 
        //This is just incase if user wants to write own CSS files.
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: 'styles/css/**'
            }
        },

        watch: {
            clientJS: {
                files: 'app/scripts/**',
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            clientCSS: {
                files: 'public/app/styles/**',
                tasks: ['csslint'],
                options: {
                    livereload: true
                }
            },
            lessFiles: {
                files: 'public/app/styles/less/**',
                tasks: ['less'],
                options: {
                    livereload: true
                }
            }
        },
        // Compile Less code to CSS
        less: {
            styles: {
                files: {
                    //'public/app/styles/css/bootstrap-overrides.css': 'public/app/styles/less/bootstrap-overrides.less',
                    'app/styles/css/main.css': 'app/styles/less/main.less'
                }
            }
        }
    });

    // Load NPM tasks
    require('load-grunt-tasks')(grunt);

    // Default task(s).
    // Default Task will not create build files. 
    grunt.registerTask('default', ['wiredep', 'jshint', 'less', 'csslint' ]);

    grunt.registerTask('build', [
        'wiredep',
        'copy',
        'jshint',
        'less',
        'csslint',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin'
    ]);
};