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
    constructor()
    {
        this.data = {
            name: 'Gorgon Server',
            serverVersion: '0.0.1'
        };

        this.load = {
            server: true,
            cli: true,
            services: true
        };

        this.debug = {
            enable: true
        };
    }
}