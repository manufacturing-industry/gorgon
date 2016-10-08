/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * Build Script: StatusService
 * @param grunt
 */
module.exports = function(grunt) {
    grunt.file.setBase('../../');
    var pkg = grunt.file.readJSON('package.json');
    var basePath = 'src/service/status/';
    var modulePath = basePath + 'src/' + pkg.buildConfig.modulePath;
    var compiledFileName = basePath + pkg.buildConfig.distPath + 'service' + pkg.buildConfig.fileNameMinified;

    /*
     * THE BUILD CONFIGURATION
     */
    grunt.initConfig({
        /*
         This will compile the contact manager app
         */
        watch: {
            scripts: {
                files: 'src/service/status/src/modules/*.js',
                tasks: ['concat', 'babel'],
                options: {
                    spawn: false,
                    debounceDelay: 250
                }
            }
        },
        concat: {
            options: {
                separator: ";\n"
            },
            dist: {
                src: [
                    '<%= modulePath %>' + 'init.js',
                    '<%= modulePath %>' + '*.js'
                ],
                dest: '<%= target %>'
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['babel-preset-es2015']
            },
            dist: {
                files: {
                    '<%= target %>': '<%= modulePath %>' + 'init.js',
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= appName %> - Compiled: <%= grunt.template.today("yyyy-mm-dd") %> - Author: <%= author %> <%=grunt.template.today("yyyy")%> - <%= website %> */\n',
                compress:true,
                mangle: {
                    except: ['jQuery']
                },
                sourceMap: true,
                sourceMapName: compiledFileName + '.map',
                sourceMapIncludeSources: true
            },
            my_target: {
                files: {
                    '<%= target %>': ['<%= target %>']
                }
            }
        }
    });

    /*
     * LOAD THE PLUGINS FOR TASKS
     */
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-babel');

    /*
     * THE DEFAULT GRUNT TASK
     */
    grunt.registerTask('default', function(target)
    {
        //Set configs
        grunt.setGruntConfigs(target);

        //Run the tasks
        grunt.task.run('watch');
    });

    /*
     * THE BUILD GRUNT TASK
     */
    grunt.registerTask('build', function(target)
    {
        //Set configs
        grunt.setGruntConfigs(target);

        //Run the tasks
        grunt.task.run('concat', 'babel', 'uglify');
    });

    grunt.setGruntConfigs = function(target)
    {
        //Configure settings
        grunt.config.set('basePath', basePath);
        grunt.config.set('modulePath', modulePath);
        grunt.config.set('target', compiledFileName);
        grunt.config.set('appName', 'StatusService');
        grunt.config.set('author', pkg.author);
        grunt.config.set('website', pkg.website);
        return true;
    }
};