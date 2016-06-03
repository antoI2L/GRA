module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd/mm/yyyy") %> */\nvar GRA = {};\n'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        qunit: {
            all: ['test/**/*.html']
        },
        jshint: {
            files: ['src/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    window: true,
                    document: true
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['src/**/*.js', 'README.md'],
                options: {
                    destination: 'docs',
                    template: 'node_modules/ink-docstrap/template',
                    configure: "jsdoc.conf.json"
                }
            }
        },
        exec: {
            install_jquery: {
                command: 'bower install jquery'
            },
            install_bootstrap: {
                command: 'bower install bootstrap'
            },
            install_font_awesome: {
                command: 'bower install font-awesome'
            },
            install_toastr: {
                command: 'bower install toastr'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('install', ['exec']);
    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('minify', ['jshint', 'concat', 'uglify', 'jsdoc']);
    grunt.registerTask('dev', ['jshint', 'concat', 'qunit', 'jsdoc']);
    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify', 'jsdoc']);
};