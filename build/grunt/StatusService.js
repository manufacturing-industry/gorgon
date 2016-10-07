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
    var basePath = 'public/apps/admin/js/contacts/';
    var modulePath = basePath + pkg.buildConfig.modulePath;
    var compiledFileName = basePath + pkg.buildConfig.distPath + 'contactManager' + pkg.buildConfig.fileNameMinified;

    /*
     * THE BUILD CONFIGURATION
     */
    grunt.initConfig({
        /*
         This will compile the contact manager app
         */
        watch: {
            scripts: {
                files: 'public/apps/admin/js/contacts/modules/*.js',
                tasks: ['concat', 'file_append'],
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
                    '<%= modulePath %>' + 'ContactManagerControl.js',
                    '<%= modulePath %>' + 'AppControl.js',
                    '<%= modulePath %>' + 'PageControl.js',
                    '<%= modulePath %>' + '*.js'
                ],
                dest: compiledFileName
            }
        },
        file_append: {
            default_options: {
                files: [
                    {
                        prepend: "$(document).ready(function() {",
                        append: "\n});",
                        input: compiledFileName
                    }
                ]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= appName %> - Compiled: <%= grunt.template.today("yyyy-mm-dd") %> - Copyright: <%= copyright %> <%=grunt.template.today("yyyy")%> - <%= website %> */\n',
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
        grunt.task.run('concat', 'file_append', 'uglify');
    });

    grunt.setGruntConfigs = function(target)
    {
        //Configure settings
        grunt.config.set('basePath', basePath);
        grunt.config.set('modulePath', modulePath);
        grunt.config.set('target', compiledFileName);
        grunt.config.set('appName', 'ContactManager');
        grunt.config.set('copyright', pkg.author);
        grunt.config.set('website', pkg.website);
        return true;
    }
};