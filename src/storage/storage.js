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

        /**
         * Contains data stored in the storage class
         *
         * @type {Array}
         */
        this.data = [];

        /**
         * Contains the data map a storage label back to its data position in the stack
         * @type {Array}
         */
        this.dataMap = [];
    }

    getStorage(label)
    {
        let pos = this.dataMap.indexOf(label);
        if (pos > -1) return this.data[pos];
        return false;
    }

    setStorage(label, data)
    {
        let pos = this.dataMap.indexOf(label);
        if (pos > -1) {
            this.data[pos] = data;
            return true;
        } else {
            this.data.push(data);
            this.dataMap.push(label);
        }
        return false;
    }
}