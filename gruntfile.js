
module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            options: {
                livereload: true,
            },
            clientjs: {
                files: ['demo/*.js'],
                // tasks: ['uglify'],
            },
            sass: {
                options: {
                    livereload: false
                },
                files: ['demo/*.scss'],
                tasks: ['sass'],
            },
            css: {
                files: ['demo/*.css'],
            },
            html: {
                files: ['demo/*.html'],
            }
        },


        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'demo/example.css': 'demo/example.scss',
                }
            }
        },

        concurrent: {
            tasks: ['watch', 'sass'],
            options: {
                logConcurrentOutput: true
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-concurrent');

    // do not abort when error
    grunt.option('force', true);
    grunt.registerTask('default', ['concurrent']);
}