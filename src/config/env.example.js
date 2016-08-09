/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * The Gorgon env class
 */
export class GorgonEnv
{
    constructor()
    {
        this.service = [
            { sid: 0, name: 'Status', namespace: 'status', enable: true }
        ];
    }
}