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
import path from 'path';
import {GorgonConfig} from "./config/config";
import {GorgonEnv} from "./config/env";
import {GorgonContainerService} from './service/index';
import {Logger} from './component/log'
import _repeat from 'lodash/repeat'
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
 * The global start time for the daemon process
 * @type {Date}
 */
global.StartTime = new Date();

/**
 * The global console class
 *
 * @type {object} The colog instance
 */
global.Console = colog;

/**
 * The daemon version
 *
 * @type {string}
 */
global.Version = '0.0.0';

/**
 * The app root path
 * @type {string}
 */
global.appRoot = path.resolve(__dirname);

/**
 * The total connected nodes
 *
 * @type {number}
 */
global.ConnectedNodes = 1;

/**
 * The total connected clients
 *
 * @type {number}
 */
global.ConnectedClients = 0;

/**
 *
 * @type {number}
 */
global.ServiceTotal = 0;

/**
 *
 * @type {number}
 */
global.ServiceFail = 0;

/**
 *
 * @type {number}
 */
global.ServiceError = 0;

/**
 *
 * @type {number}
 */
global.ServiceWarning = 0;

/**
 *
 * @type {{component: number, http: number, rest: number, api: number, tcp: number}}
 */
global.connectStat = {
    component: 0,
    http: 0,
    rest: 0,
    api: 0,
    tcp: 0,
};

/**
 *
 * @type {{total: number, active: number, failedAccess: number, errors: number, warnings: number}}
 */
global.sessionStat = {
    total: 1,
    active: 1,
    failedAccess: 0,
    errors: 0,
    warnings: 0,
};

/**
 *
 * @type {{memory: number, mongo: number, mysql: number, file: number, fileStored: number, memoryUsed: number, diskUsed: number}}
 */
global.storageStat = {
    memory: 0,
    mongo: 0,
    mysql: 0,
    file: 0,
    fileStored: 0,
    memoryUsed: 0,
    diskUsed: 0,
};

/**
 * Creates the status shorthand for displaying a status message in the console window
 * @param {string} type The type for the message
 * @param {string} message The message to be displayed
 * @return {boolean} Returns true on completion
 */
global.Console.status = (type, message) => {
    switch (type) {
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
    return true;
};

/**
 * Returns the up time of the current daemon
 *
 * @returns {{days: number, hours: number, minutes: number, seconds: number}}
 */
global.getUpTime = () => {
    const cDate = new Date();
    let seconds = Math.floor((cDate - (global.StartTime)) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    return {
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    }
};

/**
 * The Gorgon class
 */
class Gorgon {
    /**
     * Constructs the class
     */
    constructor() {
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
    initServer() {
        this._bootstrap();
        global.Console.log(this.separator2);
        global.Console.question('Loading Services');
        global.Console.log(this.separator2);
        this.Logger.log('Gorgon:initServer', 200, 'The server was started successfully');

        this.GorgonEnv.service.forEach(function(value) {
            let consoleWidth = 48;
            let loaded = this.GorgonContainerService.add(value.service);
            if (loaded) {
                let logExtLen = 6;
                let spaceLength = consoleWidth - logExtLen - value.namespace.length - 2;
                let spaceChar = _repeat('.', spaceLength);
                this.Logger.log('Gorgon:initServer', 200, 'Loaded service namespace: ' + value.namespace);
                global.Console.log(value.namespace + ' ' + spaceChar + ' [ ' + global.Console.color('OK', 'green') + ' ]');
            } else {
                let logExtLen = 10;
                let spaceLength = consoleWidth - logExtLen - value.namespace.length - 2;
                let spaceChar = _repeat('.', spaceLength);
                this.Logger.log('Gorgon:initServer', 400, 'Failed to load service with namespace: ' + value.namespace);
                global.Console.log(value.namespace + ' ' + spaceChar + ' [ ' + global.Console.color('FAILED', 'red') + ' ]');
            }
        }, this);

        this.Logger.log('Gorgon:initServer', 200, 'Service Loading Completed');
        global.Console.log(this.separator2);
        global.Console.question('Loading Complete - Server Online');
        global.Console.log(this.separator1);
    }

    /**
     * The CLI server bootstrap
     *
     * @private
     */
    _bootstrap() {
        global.Console.log(global.Console.color('Gorgon Server' + ' v' + this.GorgonConfig.data.version, 'green'));
        global.Console.log('Author: Ryan Rentfro <rrentfro at gmail dot com>');
        global.Console.log('Project: https://github.com/manufacturing-industry/gorgon');
        this._motd();
        global.Console.log('Press ' + global.Console.color('cntrl+c', 'yellow') + ' to exit the server');
        global.Version = this.GorgonConfig.data.version;
    }

    /**
     * The server message of the day display
     *
     * @private
     */
    _motd() {
        global.Console.log(this.separator1);
        global.Console.log(global.Console.color(this.GorgonConfig.data.motd, 'yellow'));
        global.Console.log(this.separator1);
    }
}

/*
 * Run the Gorgon Server
 */
const GorgonServer = new Gorgon();
GorgonServer.initServer();