"use strict";
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                sourceMap: true
            },
            dist: {
                src: ['public/js/**/*.js'],
                dest: 'public/dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                sourceMap: true
            },
            dist: {
                files: {
                    'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'public/js/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                force: true,
                globalstrict: true,
                globals: {
                    "angular": false,
                    "describe": false,
                    "it": false,
                    "expect": false,
                    "beforeEach": false,
                    "afterEach": false,
                    "module": false,
                    "inject": false,
                    "document": false,
                    "window": false,
                    "console": false,
                    "localStorage": false
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};