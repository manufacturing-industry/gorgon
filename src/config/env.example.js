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
import StatusService from '../service/status/index'

/**
 * The Gorgon env class
 */
export class GorgonEnv
{
    /**
     * Constructs the class
     */
    constructor()
    {
        let statusService = new StatusService();
        this.service = [
            {
                sid: 0,
                name: 'Status',
                namespace: 'StatusService',
                enable: true,
                service: statusService
            }
        ];
    }
}