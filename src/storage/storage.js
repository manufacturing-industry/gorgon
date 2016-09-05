/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * The Gorgon Storage Driver Base Class
 */
export class GorgonStorage {
    /**
     * Constructs the class
     */
    constructor()
    {
        /**
         * The name for the storage driver
         *
         * @type {string}
         */
        this.name = null;

        /**
         * The namespace for the storage driver
         *
         * @type {string}
         */
        this.namespace = null;

        /**
         * The component type
         *
         * @type {string}
         */
        this.type = 'storage-driver';

        /**
         * The version for the storage driver
         *
         * @type {string}
         */
        this.version = null;
    }
}