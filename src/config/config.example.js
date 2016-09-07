/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

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
        /**
         * The servers default config data
         * @type {{name: string, version: string, motd: string}}
         */
        this.data = {
            name: 'Gorgon Server',
            version: '0.0.1 Pre-Alpha',
            motd: 'This is the message of the day for the Gorgon Server'
        };

        /**
         * The servers default storage config
         *
         * Contains the path pointers for base storage components.
         *
         * @note Paths must contain trailing slash
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