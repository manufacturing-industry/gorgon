/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * The Memory Storage Driver
 *
 * Note: The memory storage driver storage data in the app vs external services like mongo or mysql
 */
export class MemoryStorageDriver
{
    constructor()
    {
        this.name = 'Memory Storage Driver';
        this.version = '0.0.1';
    }
}