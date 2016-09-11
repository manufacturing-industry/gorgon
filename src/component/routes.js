/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * The routes class (attribute)
 *
 * @note This class is generally used as an attribute of a class that it is mounted to
 */
export class Routes {
    /**
     * Constructs the object
     *
     * @param {string} serviceNamespace The service namespace
     */
    constructor(serviceNamespace) {

        /**
         * The service namespace
         * @type {string}
         */
        this.service = serviceNamespace;

        /**
         * The acceptable inbound types
         * @type {string[]}
         */
        this.inboundTypes = ['rest', 'socket', 'http', 'webSocket', 'api'];

        /**
         * The route table for the router
         * @type {Array}
         */
        this.routes = [];

        /**
         * The route table callbacks
         * @type {Array}
         */
        this.routeCallbacks = [];

        /**
         * The inbound type permission map for the routes
         * @type {{rest: Array, socket: Array, webSocket: Array, http: Array, api: Array}}
         */
        this.permissionMap = {
            rest: [],
            socket: [],
            webSocket: [],
            http: [],
            api: []
        };
    }

    /**
     * Imports routes from a class
     *
     * @param {array} routes An array of route objects to be added to the router ({ inboundTypes: string, method: string, callback: function reference })
     * @returns {boolean}
     */
    importRoutes(routes)
    {
        if (routes instanceof Object)
        {
            for (var key in routes) {
                if (routes.hasOwnProperty(key)) this.add(routes[key]['inboundTypes'], routes[key]['method'], routes[key]['callback']);
            }
            return true;
        }
        global.Console.status('notice', 'Failed importing routes - routes must be an array');
        global.Logger.log('Routes:importRoutes', 300, 'Failed importing routes - routes are not an array.');
        return false;
    }

    /**
     * Adds a route to the router
     *
     * @param {array} inboundTypes An array of acceptable inbound types
     * @param {string} method The method name
     * @param {string} callback The method callback
     */
    add(inboundTypes, method, callback)
    {
        this.routes.push(method);
        this.routeCallbacks.push(callback);
        var pos = this.routeCallbacks.length - 1;

        inboundTypes.forEach(function(value){
            if (this.inboundTypes.indexOf(value) > -1) this.permissionMap[value].push(pos);
            else console.log('ERROR - Invalid Permission Encountered in Service: [' + this.namespace + '] Method: [' + method + ']');
        }, this);
    }

    /**
     * Removes a route from the router
     * @param {string} method The method name
     * @returns {boolean} Returns true on completion and false on failure
     */
    remove(method)
    {
        let pos = this.routes.indexOf(method);
        if (pos > -1)
        {
            this.routeCallbacks[pos] = null;
            this.routes[pos] = null;

            this.inboundTypes.forEach(function(value)
            {
                if (this.permissionMap[value] != undefined && this.permissionMap[value] instanceof Array)
                {
                    let keyPos = this.permissionMap[value].indexOf(pos);
                    if (keyPos > -1) this.permissionMap[value].splice(keyPos, 1);
                }
            });
            return true;
        }
        return false;
    }

    /**
     * Routes a call on an object that has mounted the routes class
     *
     * @param {string} inboundType The type of inbound command
     * @param {string} method The method being called
     * @param {*} payload The payload to be sent to the route
     * @returns {*|boolean} Returns the result of the call or false on failure of the call did not exist
     */
    route(inboundType, method, payload)
    {
        let pos = this.routes.indexOf(method);
        if (pos > -1)
        {
            if (this.permissionMap[inboundType] != undefined && this.permissionMap[inboundType].length > 0 && this.permissionMap[inboundType].indexOf(pos) > -1)
            {
                return this.routeCallbacks[pos](method, inboundType, ...payload);
            }
        }

        global.Console.status('error', 'Invalid Route Encountered for Inbound Type: ' + inboundType + ' - Method: ' + method);
        global.Logger.log('Routes:route', 300, 'Invalid Route Encountered for Inbound Type: ' + inboundType + ' - Method: ' + method);
        return false;
    }
}