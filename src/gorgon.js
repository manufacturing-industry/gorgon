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
import {GorgonConfig} from "config/config";
import {GorgonEnv} from "config/env";
import {GorgonContainerService} from 'service/index';

/**
 * The Gorgon main class
 */
class Gorgon {
    constructor()
    {
        this.GorgonConfig = new GorgonConfig();
        this.GorgonEnv = new GorgonEnv();
        this.GorgonContainerService = new GorgonContainerService();
    }

    initServer()
    {
        this.GorgonEnv.service.forEach(function(value){
            console.log('Load Service');
            console.log(value.namespace);
            this.GorgonContainerService.add(value.service);
            console.log(value.namespace + ' was added as a service');
        }, this);
    }
}

/*
 * Run Gorgon Server
 */
var GorgonServer = new Gorgon();
GorgonServer.initServer();