/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

let instance = null;
import moment from 'moment';
import Middleware from './middleware';

/**
 * The api class
 *
 * @note This powers the extensible internal API
 */
export class Api {
    /**
     * Constructs the class
     */
    constructor() {
        if (!instance) {
            /**
             * The middleware for the class
             * @type {Middleware}
             */
            this.middleware = new Middleware();

            /**
             * Contains the api node references
             * @type {Array}
             */
            this.api = [];

            /**
             * Contains the api node map
             * @note The api map is also used for reserving api endpoints
             * @type {Array}
             */
            this.apiMap = [];

            /**
             * Maps the service id's to the api
             * @type {Array}
             */
            this.serviceIdMap = [];

            /**
             * Reserved words that can not be registered as api endpoints
             * @type {string[]}
             */
            this.reserved = [
                'instance', 'middleware', 'api', 'apiMap', 'serviceIdMap', 'reserved',
                'addApiNode', 'getApiNode', '_getNodePos', 'callApiNode', 'ApiCall'
            ];

            instance = this;
        } else return instance;
    }

    /**
     * Adds an API node to the api stack and binds it to the api
     *
     * @param {number} serviceId The service id
     * @param {namespace} namespace The service namespace mounted to the api
     * @param {function} node The function reference for the node
     * @returns {boolean} Returns true on completion and false on failure
     */
    addApiNode(serviceId, namespace, node) {
        if (this._getNodePos(namespace) === false && this._isReservedNamespace(namespace) === false) {
            this.api.push(node);
            this.apiMap.push(namespace);
            this.serviceIdMap.push(serviceId);
            let pos = this.api.length - 1;
            this[namespace] = this.api[pos];
            global.Logger.log('Api:addApiNode', 200, 'Added a new API node for Service Namespace: ' + namespace);
            return true;
        }

        if (this._getNodePos(namespace) !== false) global.Logger.log('Api:addApiNode', 400, 'Unable to create new api node. A node by for this service namespace already exists - Service Namespace: ' + namespace);
        else global.Logger.log('Api:addApiNode', 400, 'Unable to create new api node. This namespace is reserved - Service Namespace: ' + namespace);
        return false;
    }

    /**
     * Returns an api node from the stack
     *
     * @param {string} namespace The service namespace to locate
     * @returns {*} Returns the api node when found or false when no node was found
     */
    getApiNode(namespace) {
        let pos = this._getNodePos(namespace);
        if (pos > -1) return this.api[pos];
        return false;
    }

    /**
     * Creates an ApiCall instance and executes it - then returns the ApiCall instance if the call completed
     *
     * @param {string} namespace The service namespace to be called
     * @param {string} method The method to be called
     * @param {*} data The data to be sent to the call
     * @returns {*} Returns the result of the call or false if the node did not exist
     */
    callApiNode(namespace, method, data) {
        const node = this.getApiNode(namespace);
        if (node !== false) {
            let apiCall = new ApiCall(method, data);
            this.middleware.callChannel('PRE_API_CALL', apiCall);
            data = apiCall.callApi(node, method);
            this.middleware.callChannel('POST_API_CALL', data);
            data.returned = moment();
            return data;
        }
        this.Logger.log('Api:callApiNode', 400, 'Failed to call node service with namespace: ' + namespace + ' - no api node exists for this namespace.');
        return false;
    }

    /**
     * Returns the position of the node by its namespace
     *
     * @param {string} namespace The service namespace to be retrieved
     * @returns {boolean|number} Returns false if not found or the position of the service namespace in the stack
     * @private
     */
    _getNodePos(namespace) {
        let pos = this.apiMap.indexOf(namespace);
        if (pos == -1) return false;
        return this.apiMap[pos];
    }

    /**
     * Check if the namespace is reserved by the object
     *
     * @param {string} namespace The service namespace to be checked
     * @returns {boolean} Returns true if the namespace exists false if it doesn't
     * @private
     */
    _isReservedNamespace(namespace) {
        return this.reserved.indexOf(namespace) > -1;
    }
}

/**
 * This API call class
 *
 * @note This is the packaged call and its related data
 */
class ApiCall {
    /**
     * Constructs the class
     */
    constructor(method, data) {
        /**
         * The method to be called
         * @var {function}
         */
        this.method = method;

        /**
         * A flag that controls if the call resulted in an error
         * @type {boolean}
         */
        this.error = false;

        /**
         * The errors that occurred during the call
         * @type {Array}
         */
        this.errors = [];

        /**
         * The data for the call
         * @type {*}
         */
        this.data = data;

        /**
         * The time the API call was created
         * @type {moment}
         */
        this.created = moment();

        /**
         * The time the API call was updated
         * @type {moment}
         */
        this.updated = null;

        /**
         * The time the API call was returned
         * @type {moment}
         */
        this.returned = null;
    }

    /**
     * Calls the api for the call
     *
     * @param {function} node The node to tbe called
     * @returns {*} Returns the ApiCall object
     */
    callApi(node) {
        node(this);
        this.updated = moment();
        return this;
    }
}