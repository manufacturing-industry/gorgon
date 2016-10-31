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
import _ from 'lodash'
import {GorgonConfig} from '../config/config'
import {Middleware} from './middleware'
import {Api} from './api';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import moment from 'moment';
import GorgonStorage from '../storage/storage';
import MemoryStorageDriver from '../storage/mem';
import TimeStorageDriver from '../storage/TimeStorage';
import Logger from '../component/log';

/*
 * Variables
 */

/**
 * The ErrorHandler control class
 *
 * @note Error Handler for the system
 */
export default class ErrorHandler
{
    /**
     * @var {number} The primary key pointer for the data
     */
    primaryKeyPointer = 0;

    /**
     * The log level codes
     * @type {number[]}
     */
    levels = [100, 200, 300, 400, 500, 600];

    /**
     * The log level lifetime stat for the component
     * @type {{100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}}
     */
    totals = {
        100: 0, 200: 0, 250: 0, 300: 0, 400: 0, 500: 0, 550: 0, 600: 0
    };

    /**
     * The log level month stat for the component
     * @type {{100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}}
     */
    month = {
        100: 0, 200: 0, 250: 0, 300: 0, 400: 0, 500: 0, 550: 0, 600: 0
    };

    /**
     * The log level week stat for the component
     * @type {{100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}}
     */
    week = {
        100: 0, 200: 0, 250: 0, 300: 0, 400: 0, 500: 0, 550: 0, 600: 0
    };

    /**
     * The log level day stat for the component
     * @type {{100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}}
     */
    day = {
        100: 0, 200: 0, 250: 0, 300: 0, 400: 0, 500: 0, 550: 0, 600: 0
    };

    /**
     * The log level hour stat for the component
     * @type {{100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}}
     */
    hour = {
        100: 0, 200: 0, 250: 0, 300: 0, 400: 0, 500: 0, 550: 0, 600: 0
    };

    /**
     * The log level hour stat for the component
     * @type {{100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}}
     */
    min = {
        100: 0, 200: 0, 250: 0, 300: 0, 400: 0, 500: 0, 550: 0, 600: 0
    };

    /**
     * The storage for the ErrorHandler and its stats
     * @var {Object}
     */
    storage = {
        name: null,
        totals: new MemoryStorageDriver(),
        month: new TimeStorageDriver('month'),
        week: new TimeStorageDriver('week'),
        day: new TimeStorageDriver('day'),
        hour: new TimeStorageDriver('hour'),
        min: new TimeStorageDriver('min'),
    };

    /**
     * Constructs the error handlers default settings
     * @param {string} service The name of the service (for reference)
     * @param {string} className The class name of the service (for reference)
     */
    constructor(service, className)
    {
        this.startTime = moment();
        this.startTime = this.startTime.format('X');
        this.service = service;
        this.className = className;
        this.storage.name = service + ':' + className;
        //console.log('Error handler mounted')
    }

    add(level, location, message, data)
    {
        this.primaryKeyPointer++;
        let error = new ErrorRecord(this.primaryKeyPointer, this.service, this.className, level, location, message, data);
        this.storage.month.addRecord(error);
        this.storage.week.addRecord(error);
        this.storage.day.addRecord(error);
        this.storage.hour.addRecord(error);
        this.storage.min.addRecord(error);
        this._incrementTotal(level);
        //console.log('added an error');
        //console.log(error);
        //console.log(this.storage);
        return true;
    }

    /**
     * Returns the statistics for the error handler
     *
     * @return {{levels: {100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}, month: {100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}, week: {100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}, day: {100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}, hour: {100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}, min: {100: number, 200: number, 250: number, 300: number, 400: number, 500: number, 550: number, 600: number}}}
     */
    getStats()
    {
        this._pollTotals();

        return {
            levels: this.totals,
            month: this.month,
            week: this.week,
            day: this.day,
            hour: this.hour,
            min: this.min,
        }
    }

    _incrementTotal(level)
    {
        if (this.levels.indexOf(level) > -1)
        {
            this.totals[level] = parseFloat(this.totals[level]) + 1;
            return true;
        }
        return false;
    }

    /**
     * Traverses the storage and updates the stats
     *
     * @private
     */
    _pollTotals()
    {
        var storage = {};

        storage = this.storage.month;
        this.month = this._errorTotals(storage.data);

        storage = this.storage.week;
        this.week = this._errorTotals(storage.data);

        storage = this.storage.day;
        this.day = this._errorTotals(storage.data);

        storage = this.storage.hour;
        this.hour = this._errorTotals(storage.data);

        storage = this.storage.min;
        this.min = this._errorTotals(storage.min);
    }

    /**
     * Process errors in from stack
     *
     * @param {TimeStorageDriver} errors A time storage driver whos data is error storage
     */
    _errorTotals(errors) {
        var totals = {
            100: 0, 200: 0, 250: 0, 300: 0, 400: 0, 500: 0, 550: 0, 600: 0
        };

        errors.forEach(function (value, index) {
            if (totals.hasOwnProperty(value.level)) totals[value.level]++;
        });

        return totals;
    }
}

/**
 * The error record
 */
class ErrorRecord
{
    /**
     * Constructs a new error record
     * @param {number} id The id for the record
     * @param {string} service The name of the service
     * @param {string} className The class name
     * @param {number} level The error level
     * @param {string} location The source of the error (class:method)
     * @param {string} message The message for the error
     * @param {object|array} data The data from the error
     */
    constructor(id, service, className, level, location, message, data)
    {
        this.id = id;
        this.service = service;
        this.className = className;
        this.level = level;
        this.location = location;
        this.message = message;
        this.data = data;
        this.createDate = moment();
        this.updateDate = this.createDate;
    }
}