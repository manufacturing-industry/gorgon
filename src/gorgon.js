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
import _ from 'lodash'
import colog from 'colog'

/*
 * Configure globals
 */

/**
 * The global logger class
 *
 * @type {Logger}
 */
global.Logger = new Logger();

/**
 * The global console class
 *
 * @type {object} The colog instance
 */
global.Console = colog;

global.Console.status = (type, message)=>
{
    switch(type)
    {
        default:
        case 'info':
            global.Console.log('[' + global.Console.color('I', 'yellow') + '] ' + message);
            break;
        case 'notice':
            global.Console.log('[' + global.Console.color('N', 'cyan') + '] ' + message);
            break;
        case 'error':
            global.Console.log('[' + global.Console.color('E', 'red') + '] ' + message);
            break;
    }
};

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
        global.Console.log(this.separator2);
        global.Console.question('Loading Services');
        global.Console.log(this.separator2);
        this.Logger.log('Gorgon:initServer', 200, 'The server was started successfully');

        this.GorgonEnv.service.forEach(function(value){
            let consoleWidth = 48;
            let loaded = this.GorgonContainerService.add(value.service);
            if (loaded)
            {
                let logExtLen = 6;
                let spaceLength = consoleWidth - logExtLen - value.namespace.length - 2;
                let spaceChar = _.repeat('.', spaceLength);
                this.Logger.log('Gorgon:initServer', 200, 'Loaded service namespace: ' + value.namespace);
                global.Console.log(value.namespace +' ' + spaceChar + ' [ ' + global.Console.color('OK', 'green') + ' ]');
            } else {
                let logExtLen = 10;
                let spaceLength = consoleWidth - logExtLen - value.namespace.length - 2;
                let spaceChar = _.repeat('.', spaceLength);
                this.Logger.log('Gorgon:initServer', 400, 'Failed to load service with namespace: ' + value.namespace);
                global.Console.log(value.namespace +' ' + spaceChar + ' [ ' + global.Console.color('FAILED', 'red') + ' ]');
            }
        }, this);

        this.Logger.log('Gorgon:initServer', 200, 'Service Loading Completed');
        global.Console.log(this.separator2);
        global.Console.log('Server is now online...');
        global.Console.log(this.separator1);
    }

    /**
     * The CLI server bootstrap
     *
     * @private
     */
    _bootstrap()
    {
        global.Console.log(global.Console.color('Gorgon Server - v' + this.GorgonConfig.data.version, 'green'));
        global.Console.log('Author: Ryan Rentfro <rrentfro at gmail dot com>');
        global.Console.log('Project: https://github.com/manufacturing-industry/gorgon');
        this._motd();
        global.Console.log('Press ' + global.Console.color('cntrl+c', 'yellow') + ' to exit the server');
    }

    /**
     * The server message of the day display
     *
     * @private
     */
    _motd()
    {
        global.Console.log(this.separator1);
        global.Console.log(global.Console.color(this.GorgonConfig.data.motd, 'yellow'));
        global.Console.log(this.separator1);
    }
}

/*
 * Run the Gorgon Server
 */
var GorgonServer = new Gorgon();
GorgonServer.initServer();