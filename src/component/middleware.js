/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

import _ from 'lodash';

/**
 * The middleware class
 *
 * Manages middleware for the system for specific system interactions
 *
 * @note Middleware are limited to 1 middleware assigned to a channel->service namespace->middleware
 * @note This means that you have 1 method assignable to a channel per service per middleware
 */
export class Middleware {
    constructor()
    {
        this.data = [];
        this.serviceRegister = [];
        this.dataMap = [];
        this.channels = ['REQUEST', 'RESPONSE'];
        this.channels.forEach(function(value){
            this.data.push([]);
            this.dataMap.push(value);
        }, this);
    }

    /**
     * Adds a middleware to the server based on a middleware channel
     *
     * @param {string} channel The label for the channel
     * @param {string} serviceNamespace The service namespace for the middleware
     * @param {string} middleware The class name of the middleware to be used
     * @param {function} method The method to be called with the object when a channel call is made
     * @returns {boolean}
     */
    addMiddleware(channel, serviceNamespace, middleware, method)
    {
        let pos = this._getChannelId(channel);
        if (pos > -1)
        {
            let middleware = this._getExistingMiddleware(channel[pos], serviceNamespace, middleware, method);
            if (middleware === false)
            {
                this.channels[pos].push({ service: serviceNamespace, middleware: middleware, method: method });
                global.Logger.log('Middleware:addMiddleware', 200, 'A new middleware was added for Service Namespace: ' + serviceNamespace + ' on Channel: ' + channel);
                return true;
            } else {
                global.Logger.log('Middleware:addMiddleware', 300, 'Attempted to add duplicate middleware for Service Namespace: ' + serviceNamespace + ' on Channel: ' + channel + ' for middleware: ' + middleware + ' with method: ' + method);
            }
        }
        global.Logger.log('Middleware:addMiddleware', 400, 'Attempted to add a middleware for non-existent channel: ' + channel + ' - for Service Namespace: ' + serviceNamespace);
    }

    /**
     * Removes a registered middleware from the server
     *
     * @param {string} channel
     * @param {string} serviceNamespace
     * @param {string} middleware
     */
    removeMiddleware(channel, serviceNamespace, middleware)
    {
        let pos = this._getChannelId(channel);
        if (pos > -1)
        {
            /**
             * @todo Add Remove middleware code
             */
        }
    }

    /**
     * Calls a channels assigned middleware with the data and returns the data
     *
     * @param {string} channel The name of the channel
     * @param {*} data The object or data to be passed to the middleware
     * @returns {*|boolean} Returns the data from the middleware call for the data sent
     */
    callChannel(channel, data)
    {
        let pos = this._getChannelId(channel);
        if (pos > -1)
        {
            let middlewareList = this.channels[pos];
            if (middlewareList instanceof Array)
            {
                middlewareList.foreach(function(value){
                    data = value.method(data);
                });
            }
        } else global.Logger.log('Middleware:callChannel', 400, 'Attempted to call a non-existent channel: ' + channel + ' - for Service Namespace: ' + serviceNamespace);
        return data;
    }

    /**
     * Checks for an existing middleware for a given channelObject, serviceNamespace, and middleware
     *
     * @note This method ensures we lock the assigned middleware for a given channel/service namespace/middleware
     * @param {object} channelObject The channel object from the middleware data stack
     * @param {string} serviceNamespace The service namespace for the middleware
     * @param {string} middleware The class name of the middleware to be used
     * @returns {boolean|array} Returns false if channel doesn't exist or the channel datas array if it does
     * @private
     */
    _getExistingMiddleware(channelObject, serviceNamespace, middleware)
    {
        let existing = _.find(channelObject, { 'serviceNamespace': serviceNamespace, 'middleware': middleware });
        if (existing != undefined) return false;
        return existing;
    }

    /**
     * Locates a channel id from the channels name
     *
     * @param {string} name The name of the channel
     * @returns {number} Returns the index of the channel (-1 if channel does not exist)
     * @private
     */
    _getChannelId(name)
    {
        return this.channels.indexOf(name.toUpper);
    }
}

/**
 * Export the middleware class as default
 */
export default Middleware;