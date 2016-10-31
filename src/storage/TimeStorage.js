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
 * The Time Storage Driver
 *
 * @note The time storage driver can expire data based on a interval and a mode of expiring
 * @note Modes: Month, Week, Day, Hour, Min
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

        /**
         * The time the storage engine was initiated
         *
         * @var {moment} A moment representing a point in time
         */
        let createTime = moment();

        /**
         * The create time since the unix epoch (seconds)
         *
         *@var {number} A number representing time since the unix epoch
         */
        this.created = createTime.format('X');

        /**
         * The interval used for multiplying the check interval to expire the storage
         *
         * @note If the default value - null - then it will use the default check interval for expiring the data
         * @note Defaults: Month: 1 Check per hour, Week: 1 Check per hour, Day: 1 Check per 15 minutes, Hour: 1 Check per minute, Min: 4 check per minute
         * @type {number}
         */
        this.checkInterval = 1;

        /**
         * Executes the timed trigger for the system
         *
         * @note This starts the interval that will check and expire stored data
         */
        this._timedTrigger();


        this.addRecord({ val: 'test'}); //Add an example record
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
        //console.log('record was added to storage item');
    }

    /**
     * Sets the check interval for the system
     *
     * @param {number} interval
     */
    setCheckInterval(interval)
    {
        if (number != undefined && number > 0) {
            this.checkInterval = interval;
            return true;
        }
        return false;
    }

    /**
     * The timed trigger for clearing old records
     *
     * @todo RESUME HERE AND ADD THE REMOVAL AND TOTALING OF STATS FOR A SERVICE
     * @private
     */
    _timedTrigger()
    {
        //console.log('setting bound trigger');
        var self = this;
        setInterval(function()
        {
            self._clearExpired()
        }.bind(null, self), this._getOperationInterval());


        //console.log('operational interval');
        //console.log(this._getOperationInterval());
    }

    /**
     * Clears expired records based on the configured expiration
     * @private
     *
     * @return {boolean} Returns true on completion and false on error
     */
    _clearExpired()
    {

        var currentTime = moment();
        currentTime = currentTime.format('X');

        var cutTime = currentTime - this._getExpireMax();

        var timeType = this.timeType;
        //console.log('Data map check - current time: ' + currentTime + ' - Cut Time: ' + cutTime);

        var removeList = [];
        this.dataMap.forEach(function(value, index)
        {
            //console.log('Data map check: ' + index + ' - Time Type: ' + timeType + ' - Value: ' + value);
            //console.log('Item Time: ' + value);
            if (value <= cutTime)
            {
                removeList.push(index);
                console.log('[' + timeType + '] - we delete index: ' + index + ' cut time: ' + value + ' it was less than the cut time of: ' + cutTime);
            }
        });

        if (removeList.length > 0)
        {
            for(let i=0; i < removeList.length; i++)
            {
                this.dataMap.slice(removeList[i]);
                this.data.slice(removeList[i]);
            }
        }

        return true;
    }

    /**
     * Returns the max time for a record to exist, records past this expiration are cleared
     * @return {*}
     * @private
     */
    _getExpireMax()
    {
        switch(this.timeType)
        {
            default:
                    //console.log('Error: Invalid time type');
                break;
            case 'month':
                //console.log('Expire time - month');
                return (30 * 24 * (60 * 60)) * parseFloat(this.interval);
                break;
            case 'week':
                //console.log('Expire time - week');
                return (7 * 24 * (60 * 60)) * parseFloat(this.interval);
                break;
            case 'day':
                //console.log('Expire time - day');
                return (24 * (60 * 60)) * parseFloat(this.interval);
                break;
            case 'hour':
                //console.log('Expire time - hour');
                return (60 * 60) * parseFloat(this.interval);
                break;
            case 'min':
                //console.log('Expire time - min');
                return (60) * parseFloat(this.interval);
                break;
        }

        return null;
    }

    _getOperationInterval()
    {
        var interval = 60 * 60;
        switch(this.timeType)
        {
            default:
                break;
            case 'month':
                interval = (60 * 60) * parseFloat(this.checkInterval);
                break;
            case 'week':
                interval = (60 * 60) * parseFloat(this.checkInterval);
                break;
            case 'day':
                interval = (15 * 60) * parseFloat(this.checkInterval);
                break;
            case 'hour':
                interval = (60) * parseFloat(this.checkInterval);
                break;
            case 'min':
                interval = (15) * parseFloat(this.checkInterval);
                break;
        }

        //console.log('interval set for: ' + interval + 'sec / ' + (interval * 1000) + 'ms');
        return interval * 1000;

    }
}

export default TimeStorageDriver;