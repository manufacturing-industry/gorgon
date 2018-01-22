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
 * The Mongo Storage Driver
 */
export class MongoStorageDriver extends GorgonStorage
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
        this.name = 'Mongo Storage Driver';

        /**
         * The namespace for the storage driver
         *
         * @type {string}
         */
        this.namespace = 'MONGO_STORAGE_DRIVER';

        /**
         * The version for the storage driver
         *
         * @type {string}
         */
        this.version = '0.0.0';
    }
}