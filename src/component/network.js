/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

let instance = null;
import Middleware from './middleware'
import http from 'http';
import SocketIO from 'socket.io';
import compression from 'compression';
import express from 'express';

var app = express();
var server = http.Server(app);
var io = new SocketIO(server);

/*
 * Setup compression for the express server
 */
app.use(compression({}));

/**
 * The network controls singleton class
 *
 * @note Creates and maps the network components for services
 */
export class Network {
    /**
     * Constructs the class
     */
    constructor()
    {
        if(!instance)
        {
            this.middleware = new Middleware();
            this.services = [];
            this.serviceMap = [];
            this.components = [];
            this.componentMap = [];
            this.componentTypeMap = {
                rest: [],
                socket: [],
                webSocket: [],
                http: [],
                api: []
            };
            this.portReservations = [];
            this.portReservationNamespace = [];
            this.activeServices = [];
            this.wsExpress = express();
            this.webSocketServer = http.Server(this.wsExpress);
            instance = this;
        } else return instance;
    }

    /**
     * Adds a service to the network layer
     *
     * @param {object} service The service to be added
     * @return {boolean} Returns true on completion and false on failure
     */
    addService(service)
    {
        if (this.activeServices.indexOf(service.namespace) == -1)
        {
            this.services.push(service);
            this.serviceMap.push(service.namespace);
            let serviceId = this.serviceMap.length - 1;

            /*
             * Add networking components
             */
            if (service.networking instanceof Array)
            {
                for(var i=0; i < service.networking.length; i++)
                {
                    /**
                     * @todo RESUME HERE
                     */
                    this.add(serviceId, service.namespace, service.networking[i].name, 'label', service.networking[i].port);
                }

            }
        }
        return false;
    }

    /**
     * Removes the services network components
     *
     * @param {string} serviceNamespace The namespace of the service to be removed
     * @return {boolean} Returns true on completion and false on failure
     */
    removeService(serviceNamespace)
    {

    }

    /**
     * Adds a service network component
     *
     * @param {number} serviceId The serviceId for the service
     * @param {string} serviceNamespace The service namespace for the component
     * @param {string} type The network component type
     * @param {string} label The label for the component
     * @param {string|null} port The optional port for the network component
     * @return {boolean} Returns true on completion and false on failure
     */
    add(serviceId, serviceNamespace, type, label, port)
    {
        let created = false;
        if (this.portReservations.indexOf(port) == -1 || port == null || port == undefined)
        {
            switch(type)
            {
                default:
                    global.Logger.log('Network:add', 400, 'Unable to load component type of: ' + type + ' for Service Namespace: ' + serviceNamespace + ' - ServiceId: ' + serviceId);
                    return false;
                    break;
                case 'rest':
                    created = this._createRestComponent(serviceId, serviceNamespace, port);
                    break;
                case 'http':
                    created = this._createHttpComponent(serviceId, serviceNamespace, port);
                    break;
                case 'socket':
                    break;
                case 'webSocket':
                    break;
                case 'api':
                    break;
            }

            this.componentMap.push(serviceNamespace + '-' + type + '-' + label + '-' + port);
            console.log('loadType');
            console.log(type);
            //this.componentTypeMap[type].push(serviceNamespace + '-' + type + '-' + label + '-' + port);
            global.Logger.log('Network:add', 200, 'Added network component: ' + type + ' for Service Namespace: ' + serviceNamespace + ' - ServiceId: ' + serviceId);
        }
        return false;
    }

    /**
     * Creates a REST network component
     *
     * @note When a port is set for null if the component requires a port to be created the service will assign a random port.  The service will need to retrieve this information as needed.
     *
     * @param {number} serviceId The services id from the service stack
     * @param {string} namespace The namespace for the service
     * @param {null|number} port The port for the service or null.
     * @returns {*} Returns true io the component is created
     * @private
     */
    _createRestComponent(serviceId, namespace, port)
    {
        return this._createHttpComponent(serviceId, namespace, port)
    }

    _createHttpComponent(serviceId, namespace, port)
    {
        let setListener = true;
        var component = this.wsExpress.post('/' + namespace, function (req, res) {
            this.services[serviceId].serviceRequest(req, res);
        });

        if (this.isPortReserved(port))
        {
            setListener = false;
            let pos = this.portReservations.indexOf(port);
            let serviceNamespace = this.portReservationNamespace[pos];
            if (serviceNamespace != namespace)
            {
                global.Logger.log('Network:_createRestComponent', 400, 'Unable to create component - Port Reserved by another service. Attempted to mount: ' + namespace + ' / ServiceId: ' + serviceId + ' - Existing service assigned to port: ' + serviceNamespace);
                return false;
            }
        }

        if (setListener)
        {
            component.listen(port, function () {
                global.Logger.log('Network:_createRestComponent', 200, 'Created new rest component - listening on port: ' + port);
            });
        }


        return true;
    }

    _createSocketComponent()
    {

    }

    _createWebSocketComponent()
    {

    }

    _createApiComponent()
    {

    }

    /**
     * Removes a service network component
     *
     * @param {string} serviceNamespace The service namespace for the component
     * @param {string} type The network component type
     * @param {string} label The label for the component
     * @return {boolean} Returns true on completion and false on failure
     */
    remove(serviceNamespace, type, label)
    {

    }

    /**
     * Checks if the port is reserved
     *
     * @param {number} port The port number
     * @returns {boolean} Returns true if the port is reserved false if it is not
     */
    isPortReserved(port)
    {
        return this.portReservations.indexOf(port) > -1;
    }
}

class NetworkComponent
{
    constructor(type, label, port, service)
    {
        this.type = type;
        this.label = label;
        this.port = port;
        this.service = service;
        this.attr = {};
    }

    addAttribute(name, value)
    {
        this.attr[name] = value;
    }

    removeAttribute(name)
    {
        delete this.attr[name];
    }
}

/*
 * Exports
 */
var NetworkStack = new Network();
export default NetworkStack;