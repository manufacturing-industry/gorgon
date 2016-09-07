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
import {Logger} from 'component/log'

global.Logger = new Logger();

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
         * The gorgon server logger
         * @type {Logger}
         */
        this.Logger = global.Logger;
        this.Logger.log('Gorgon:initServer', 200, 'The Gorgon has been summoned - GORGON SERVER STARTING...');

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


        /**
         * The first style of CLI separator
         * @type {string}
         */
        this.separator1 = '================================================';

        /**
         * The second style of CLI separator
         * @type {string}
         */
        this.separator2 = '------------------------------------------------';
    }

    /**
     * Initializes the server and loads the configured services from the environment
     */
    initServer()
    {
        this._bootstrap();
        console.log('Loading Services');
        console.log(this.separator2);
        this.Logger.log('Gorgon:initServer', 200, 'The server was started successfully');

        this.GorgonEnv.service.forEach(function(value){
            this.GorgonContainerService.add(value.service);
            console.log(value.namespace + ' - [ Ok ]');
            this.Logger.log('Gorgon:initServer', 200, 'Loaded service namespace: ' + value.namespace);
        }, this);

        this.Logger.log('Gorgon:initServer', 200, 'Service Loading Completed');
    }

    /**
     * The CLI server bootstrap
     *
     * @private
     */
    _bootstrap()
    {
        console.log('Gorgon Server - v' + this.GorgonConfig.data.version);
        console.log('Author: Ryan Rentfro <rrentfro at gmail dot com>');
        console.log('Project: https://github.com/manufacturing-industry/gorgon');
        this._motd();
    }

    /**
     * The server message of the day display
     *
     * @private
     */
    _motd()
    {
        console.log(this.separator1);
        console.log(this.GorgonConfig.data.motd);
        console.log(this.separator1);
    }
}

/*
 * Run the Gorgon Server
 */
var GorgonServer = new Gorgon();
GorgonServer.initServer();