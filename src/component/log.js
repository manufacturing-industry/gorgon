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
import * as fs from 'fs';
import moment from 'moment';
import * as os from 'os';
import {GorgonConfig} from '../config/config'
import sanitize from 'sanitize-filename';

/**
 * The server logging class
 */
export class Logger {
    /**
     * Constructs the class
     */
    constructor() {
        /**
         * Sets the file system property
         * @var {fs}
         */
        this.fs = fs;

        /**
         * The gorgon config
         * @type {GorgonConfig}
         */
        this.GorgonConfig = new GorgonConfig();

        /**
         * Filename sanitizer
         * @var {sanitize-filename}
         */
        this.sanitize = sanitize;

        /**
         * The topic map
         * @type {Array}
         */
        this.topicMap = [];

        /**
         * The topic subscribers
         * @type {Array}
         */
        this.subscribers = [];

        /**
         * The topic subscriber map
         * @type {Array}
         */
        this.subscriberMap = [];

        /**
         * The log level labels
         * @type {string[]}
         */
        this.level = ['Debug', 'Info', 'Warn', 'Error', 'Critical', 'Fatal'];

        /**
         * The log level codes
         * @type {number[]}
         */
        this.levelKey = [100, 200, 300, 400, 500, 600];
    }

    /**
     * Creates a new log and writes it to the corresponding file
     *
     * @param {string} location The location the log originated from
     * @param {number} level The level of the log (from levelKey)
     * @param {string} message The message for the log
     * @param {*} values The values to include with the log
     * @param {string} type The type for the log
     * @return {boolean} Returns true on completion and false on failure
     */
    log(location, level, message, values, type) {
        var logItem = new Log(location, level, message, values, type);
        var logValues = logItem.values == null || logItem.values == undefined ? null : JSON.stringify(logItem.values);
        var filename = logItem.created.format('YYYYMMDD') + '.log';

        switch (logItem.type) {
            default:
                filename = this.sanitize(logItem.type) + '-' + filename;
                break;
            case undefined:
            case true:
            case 'sys':
                filename = 'sys-' + filename;
                break;
            case 'error':
                filename = 'error-' + filename;
                break;
        }

        /*
         * Creates the log entry
         */
        var logEntry = logItem.created.format() + ' ' + logItem.level + ' ' + logItem.location + ' [message=' + logItem.message + ']' + ' [values=' + logValues + ']' + os.EOL;

        /*
         * Check if the log directory exists - if it does not create it
         */
        if (!this.fs.existsSync(this.GorgonConfig.storage.logs)) fs.mkdirSync(this.GorgonConfig.storage.logs);

        /*
         * Append the log entry to the file
         */
        this.fs.appendFile(this.GorgonConfig.storage.logs + filename, logEntry, 'utf8', function(err) {
            if (err) {
                global.Console.status('error', 'Logger unable to write to log file - Error: ' + err);
                return false;
            }
        });

        return true;
    }
}

/**
 * The server log class
 */
class Log {
    /**
     * Constructs the class
     *
     * @param {string} location The location the log originated from
     * @param {number} level The level of the log (from levelKey)
     * @param {string} message The message for the log
     * @param {*} values The values to include with the log
     * @param {string} type The type for the log
     */
    constructor(location, level, message, values, type) {
        /**
         * The location the log originated from
         * @type {string}
         */
        this.location = location;

        /**
         * The level of the log (from levelKey)
         * @type {number}
         */
        this.level = level == null || level == undefined ? 100 : level;

        /**
         * The message for the log
         * @type {string}
         */
        this.message = message;

        /**
         * The type for the log
         * @type {string}
         */
        this.type = type == null || type == undefined ? 'sys' : type;

        /**
         * The values to include with the log
         * @type {*}
         */
        this.values = values == null || values == undefined ? null : values;

        /*
         * Sets the api created date
         */
        this.created = moment();
    }
}