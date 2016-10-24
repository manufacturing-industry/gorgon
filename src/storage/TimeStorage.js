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
import MemoryStorageDriver from '../storage/mem';
import moment from 'moment';

/**
 * The Memory Storage Driver
 *
 * Note: The memory storage driver storage data in the app vs external services like mongo or mysql
 */
class TimeStorageDriver extends MemoryStorageDriver
{
    /**
     * Constructs the class
     */
    constructor(timeType, interval)
    {
        super();

        /**
         * The name for the storage driver
         *
         * @type {string}
         */
        this.name = 'Timed Storage Driver';

        /**
         * The namespace for the storage driver
         *
         * @type {string}
         */
        this.namespace = 'TIME_STORAGE_DRIVER';

        /**
         * The version for the storage driver
         *
         * @type {string}
         */
        this.version = '0.0.1';

        /**
         * The time type used for expiring the storage
         *
         * @var {string} The time type
         */
        this.timeType = timeType || null;

        /**
         * The interval used for the time type to expire the storage
         *
         * @var {number} The time type
         */
        this.interval = interval || 1;


        let createTime = moment();
        createTime = createTime.format('X');
        this.created = createTime;

        this._timedTrigger();


    }

    /**
     * Adds a record to storage
     *
     * @param record
     */
    addRecord(record)
    {

        let createTime = moment();
        createTime = createTime.format('X');
        this.data.push(record);
        this.dataMap.push(createTime);
    }

    /**
     * The timed trigger for clearing old records
     *
     * @todo RESUME HERE AND ADD THE REMOVAL AND TOTALING OF STATS FOR A SERVICE
     * @private
     */
    _timedTrigger()
    {
        console.log('setting bound trigger');
        var self = this;
        setInterval(function()
        {
            self._clearExpired()
        }.bind(null, self), 3000);
    }

    _clearExpired()
    {
        let currentTime = moment();
        currentTime = currentTime.format('X');
        let cutTime = currentTime - parseFloat(this._getExpireMax());
        console.log(this.name + ' clearing records - time: ' + currentTime + ' Expire Time: ' +  this._getExpireMax() + ' Cut Time: '+ cutTime );
    }

    _getExpireMax()
    {
        switch(this.timeType)
        {
            default:
                    console.log('Error: Invalid time type');
                break;
            case 'month':
                console.log('Expire time - month');
                return (30 * 24 * 60 * 60) * parseFloat(this.interval);
                break;
            case 'week':
                console.log('Expire time - month');
                return (7 * 24 * 60 * 60) * parseFloat(this.interval);
                break;
            case 'day':
                console.log('Expire time - month');
                return (24 * 60 * 60) * parseFloat(this.interval);
                break;
            case 'hour':
                console.log('Expire time - month');
                return (60 * 60) * parseFloat(this.interval);
                break;
            case 'min':
                console.log('Expire time - month');
                return (60) * parseFloat(this.interval);
                break;
        }

        return null;
    }
}

export default TimeStorageDriver;