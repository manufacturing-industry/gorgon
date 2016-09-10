/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

let instance = null;
import _ from 'lodash';
import moment from 'moment';
import Middleware from './middleware';

/**
 * The api class
 *
 * @note This powers the extensible internal API
 */
export class Api
{
    /**
     * Constructs the class
     */
    constructor()
    {
        if(!instance)
        {
            this.middleware = new Middleware();
            this.api = [];
            this.apiMap = [];
            this.serviceIdMap = [];
            instance = this;
        } else return instance;
    }

    addApiNode(serviceId, namespace, node)
    {
        if (this._getNodePos(namespace) === false)
        {
            this.api.push(node);
            this.apiMap.push(namespace);
            this.serviceIdMap.push(serviceId);
            global.Logger.log('Api:addApiNode', 200, 'Added a new API node for Service Namespace: ' + namespace);
            return true;
        }
        global.Logger.log('Api:addApiNode', 400, 'Unable to create new api node. A node by for this service namespace already exists - Service Namespace: ' + namespace);
        return false;
    }

    getApiNode(namespace)
    {
        let pos = this._getNodePos(namespace);
        if (pos > -1) return this.api[pos];
        return false;
    }

    _getNodePos(namespace)
    {
        let pos = this.apiMap.indexOf(namespace);
        if (pos == -1) return false;
        return this.apiMap[pos];
    }

    callApiNode(namespace, method, data)
    {
        node = this.getApiNode(namespace);
        if (node !== false)
        {
            let apiCall = new ApiCall(method, data);
            this.middleware.callChannel('PRE_API_CALL', apiCall);
            data = apiCall.callApi(node, mehod);
            this.middleware.callChannel('POST_API_CALL', data);
            data.returned = moment();
            return data;
        }
        this.Logger.log('Api:callApiNode', 400, 'Failed to call node service with namespace: ' + namespace + ' - no api node exists for this namespace.');
        return false;
    }

}

/**
 * This API call class
 *
 * @note This is the packaged call and its related data
 *
 */
class ApiCall
{
    /**
     * Constructs the class
     */
    constructor(method, data)
    {
        this.method = method;
        this.error = false;
        this.errors = [];
        this.data = data;
        this.created = moment();
        this.updated = null;
        this.returned = null;
    }

    /**
     * Calls the api for the call
     *
     * @param node
     * @returns {*}
     */
    callApi(node)
    {
        node(this);
        this.updated = moment();
        return this;
    }
}