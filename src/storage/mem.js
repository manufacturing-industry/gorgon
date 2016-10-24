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
import GorgonStorage from '../storage/storage';

/**
 * The Memory Storage Driver
 *
 * Note: The memory storage driver storage data in the app vs external services like mongo or mysql
 */
class MemoryStorageDriver extends GorgonStorage
{
    /**
     * Constructs the class
     */
    constructor()
    {
        super();

        /**
         * The name for the storage driver
         *
         * @type {string}
         */
        this.name = 'Memory Storage Driver';

        /**
         * The namespace for the storage driver
         *
         * @type {string}
         */
        this.namespace = 'MEM_STORAGE_DRIVER';

        /**
         * The version for the storage driver
         *
         * @type {string}
         */
        this.version = '0.0.1';
    }
}

export default GorgonStorage;