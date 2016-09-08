/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

let instance = null;
import http from 'http';
import SocketIO from 'socket.io';
import compression from 'compression';
import express from 'express';

var app = express();
var server = http.Server(app);
var io = new SocketIO(server);

app.use(compression({}));
//app.use(express['static'](__dirname + '/../client'));

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

            //Configures compression for the http stack
            //this.baseComponent.express.use(compression({}));

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
        if (this.portReservations.indexOf(port) == -1 || port == null || port == undefined)
        {
            switch(type)
            {
                default:
                    global.Logger.log('Network:add', 400, 'Unable to load component type of: ' + type + ' for Service Namespace: ' + serviceNamespace + ' - ServiceId: ' + serviceId);
                    return false;
                    break;
                case 'rest':

                    break;
                case 'http':
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

    _createRestComponent(serviceId, namespace, port)
    {
        if (this.isPortReserved(port))
        {
            let component = this.wsExpress.post('/' + namespace, function (req, res) {
                this.services[serviceId].serviceRequest(req, res);
            });

            let pos = this.portReservations.indexOf(port);
            let serviceNamespace = this.portReservationNamespace[pos];
            if (serviceNamespace != namespace)
            {
                global.Logger.log('Network:add', 400, 'Unable to create component - Port Reserved by another service. Attempted to mount: ' + namespace + ' / ServiceId: ' + serviceId + ' - Existing service assigned to port: ' + serviceNamespace);
                return false;
            }
        }

        console.log('component port mount');
        component.listen(port, function () {
            console.log('Example app listening on port 3000!');
        });
        return true;
    }

    _createHttpComponent()
    {

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