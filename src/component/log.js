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
import sanitize from 'sanitize-filename';

/**
 * The server logging class
 */
export class Logger {
    /**
     * Constructs the class
     */
    constructor()
    {
        this.fs = fs;
        this.sanitize = sanitize;
        this.topicMap = [];
        this.subscribers = [];
        this.subscriberMap = [];
        this.level = ['Debug', 'Info', 'Warn', 'Error', 'Critical', 'Fatal'];
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
    log(location, level, message, values, type)
    {
        var logItem = new Log(location, level, message, values, type);
        var logValues = logItem.values == null || logItem.values == undefined ? null : JSON.stringify(logItem.values);
        var filename = logItem.created.format('YYYYMMDD') + '.log';

        switch(logItem.type)
        {
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

        var logEntry = logItem.created.format() + ' ' + logItem.level + ' ' + logItem.location + ' [message=' + logItem.message + ']' + ' [values=' + logValues + ']' + os.EOL;

        this.fs.appendFile('logs/' + filename, logEntry, 'utf8',  function (err)
        {
            if (err) {
                console.error(err);
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
    constructor(location, level, message, values, type)
    {
        this.location = location;
        this.level = level == null || level == undefined ? 100 : level;
        this.message = message;
        this.type = type == null || type == undefined ? 'sys' : type;
        this.values = values == null || values == undefined ? null : values;
        this.created = moment();
    }
}