/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */
import {Routes} from '../component/routes'

export class GorgonServiceRouter extends Routes {
    construct(service, command) {
        this.containers = [];
        this.name = "Gorgon Service Router";
        this.type = "Router";
    }
}

export class GorgonServiceContainer {
    construct() {
        this.name = '';
        this.type = '';
    }
}