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
 * The Gorgon class
 */
class Gorgon {
    /**
     * Constructs the class
     */
    constructor()
    {
        /**
         * The gorgon config for the server
         * @type {GorgonConfig}
         */
        this.GorgonConfig = new GorgonConfig();

        /**
         * The gorgon environment for the server
         * @type {GorgonEnv}
         */
        this.GorgonEnv = new GorgonEnv();

        /**
         * The container service
         * @type {GorgonContainerService}
         */
        this.GorgonContainerService = new GorgonContainerService();
    }

    /**
     * Initializes the server and loads the configured services from the environment
     */
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
 * Run the Gorgon Server
 */
var GorgonServer = new Gorgon();
GorgonServer.initServer();