/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * Build Script: BuildUpdate
 *
 * @note Updates the system build settings
 * @param grunt
 */
module.exports = function(grunt) {
    grunt.file.setBase('../../');
    var pkg = grunt.file.readJSON('package.json');

    /*
     * THE BUILD CONFIGURATION
     */
    grunt.initConfig({
        gitinfo: {
            commands: {
                'commitTotal': ['rev-list', '--count', 'master']
            }
        },
        json_generator: {
            your_target: {
                dest: pkg.buildConfig.buildDataFile,
                options: {
                    name: pkg.productName,
                    minorVersion: parseFloat(pkg.minorVersion) + parseFloat(1),
                    buildName: pkg.buildConfig.buildName,
                    buildNumber: "<%= gitinfo.commitTotal %>",
                    buildType: pkg.buildConfig.buildType,
                    publicVersion: pkg.publicVersion
                }
            }
        },
        update_json: {
            options: {
                src: pkg.buildConfig.buildDataFile,
                indent: '\t'
            },
            package: {
                dest: 'package.json',
                fields: {
                    'minorVersion': null,
                    'buildNumber': null
                }
            }
        }
    });

    /*
     * LOAD THE PLUGINS FOR TASKS
     */
    grunt.loadNpmTasks('grunt-update-json');
    grunt.loadNpmTasks('grunt-json-generator');
    grunt.loadNpmTasks('grunt-gitinfo');

    /*
     * THE DEFAULT GRUNT TASK
     */
    grunt.registerTask('default', function(target)
    {
        //Run the tasks
        grunt.task.run('gitinfo', 'json_generator', 'update_json');
    });

};