/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

import {Router} from '../../component/routes'
import {GorgonService} from '../index';

export class StatusService extends GorgonService {
    construct() {
        super('Status');
        console.log('Testing status service');
        console.log(JSON.stringify(this));
    }
}