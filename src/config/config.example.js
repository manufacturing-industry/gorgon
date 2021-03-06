/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/*
 * Imports
 */
import * as fs from 'fs';
const json = fs.readFileSync('build/build.json');
const buildData = json.length > 0 ? JSON.parse(json) : {};

/**
 * The Gorgon config class
 */
export class GorgonConfig
{
    /**
     * Constructs the class
     */
    constructor()
    {
        process.env.NODE_ENV = 'production';

        /**
         * The servers default config data
         * @type {{name: string, version: string}}
         */
        this.data = {
            name: 'Gorgon Server',
            version: buildData.publicVersion + '.' + buildData.minorVersion + ' ' + buildData.buildType +  ' - Build: ' + buildData.buildNumber + ' - ' + buildData.buildName,
            motd: 'This is the message of the day.'
        };

        /**
         * The servers default storage config
         *
         * @note Contains the path pointers for base storage components
         *
         * @type {{logs: string}}
         */
        this.storage = {
            logs: 'logs/'
        };

        /**
         * The servers default layers controls
         * @type {{server: boolean, cli: boolean, services: boolean}}
         */
        this.load = {
            server: true,
            cli: true,
            services: true
        };

        /**
         * Controls debugging
         * @type {{enable: boolean}}
         */
        this.debug = {
            enable: true
        };
    }
}