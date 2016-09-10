/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

let instance = null;
import _ from 'lodash'
import Middleware from './middleware'
import Api from './api';
import net from 'net';
import http from 'http';
import SocketIO from 'socket.io';
import compression from 'compression';
import express from 'express';

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
            service.setServiceId(service);

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
                global.Logger.log('Network:addService', 200, 'Added services components: ' + service.name + ' for Service Namespace: ' + service.namespace + ' - ServiceId: ' + serviceId);
                return true;
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
     * @param {function} middleware The middleware to call for this service
     * @return {boolean} Returns true on completion and false on failure
     */
    add(serviceId, serviceNamespace, type, label, port, middleware)
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
                    created = this._createRestComponent(serviceId, serviceNamespace, port, middleware);
                    break;
                case 'http':
                    created = this._createHttpComponent(serviceId, serviceNamespace, port, middleware);
                    break;
                case 'socket':
                    created = this._createSocketComponent(serviceId, serviceNamespace, port);
                    break;
                case 'webSocket':
                    created = this._createWebSocketComponent(serviceId, serviceNamespace, port, middleware);
                    break;
                case 'api':
                    break;
            }

            this.componentMap.push(serviceNamespace + '-' + type + '-' + label + '-' + port);
            //this.componentTypeMap[type].push(serviceNamespace + '-' + type + '-' + label + '-' + port);
            global.Logger.log('Network:add', 200, 'Added network component: ' + type + ' for Service Namespace: ' + serviceNamespace + ' - ServiceId: ' + serviceId);
        }
        return false;
    }

    /**
     * Creates a REST network component
     *
     * @note A REST network component uses the http 1.1 stack
     *
     * @param {number} serviceId The services id from the service stack
     * @param {string} namespace The namespace for the service
     * @param {null|number} port The port for the service or null.
     * @param {function} middleware The middleware to call for this service
     * @returns {*} Returns true io the component is created
     * @private
     */
    _createRestComponent(serviceId, namespace, port, middleware)
    {
        return this._createHttpComponent(serviceId, namespace, port, middleware, true)
    }

    /**
     * Creates a http network component
     *
     * @note When a port is set for null if the component requires a port to be created the service will assign a random port.  The service will need to retrieve this information as needed.
     * @note A http network component uses the http stack
     *
     * @param {number} serviceId The services id from the service stack
     * @param {string} namespace The namespace for the service
     * @param {null|number} port The port for the service or null.
     * @param {function} middleware The middleware to call for this service
     * @param {boolean|undefined} isRest Controls the rest interface flag when creating the http instance
     * @returns {*} Returns true io the component is created
     * @private
     */
    _createHttpComponent(serviceId, namespace, port, middleware, isRest)
    {
        let setListener = true;
        if (isRest == undefined) isRest = false;


        var server = express();
        server.use(compression({}));

        var component = server.all('/', function (req, res) {
            this.middleware.callChannel('PRE_REQUEST', req);
            this.middleware.callChannel('PRE_RESPONSE', res);
            this.services[serviceId].serviceRequest(req, res, isRest === false ? 'http' : 'rest');
        });

        if (this.isPortReserved(port))
        {
            setListener = false;
            let pos = this.portReservations.indexOf(port);
            let serviceNamespace = this.portReservationNamespace[pos];
            if (serviceNamespace != namespace)
            {
                global.Logger.log('Network:_createHttpComponent', 400, 'Unable to create new http component - Port Reserved by another service. Attempted to mount: ' + namespace + ' / ServiceId: ' + serviceId + ' - Existing service assigned to port: ' + serviceNamespace,
                    { type: isRest === false ? 'http' : 'rest' });
                return false;
            }
        }

        if (_.isFunction(middleware)) component.use(middleware);

        if (setListener)
        {
            component.listen(port, function () {
                global.Logger.log('Network:_createHttpComponent', 200, 'Created new http component - Mounted: ' + namespace + ' / ServiceId: ' + serviceId + ' - listening on port: ' + port,
                    { type: isRest === false ? 'http' : 'rest' });
            });
        }

        return true;
    }

    _createWebSocketComponent(serviceId, namespace, port, middleware)
    {
        let setListener = true;
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

        //create webSocket component
        var server = express();
        server.use(compression({}));

        var httpServer = http.Server(server);
        var webSocket = new SocketIO(httpServer);

        let users = [];
        let sockets = {};

        webSocket.use(compression({}));
        //app.use(express['static'](__dirname + '/../../client'));

        webSocket.on('connection', (socket) => {
            let userId = socket.handshake.query.userId;
            let currentUser = {
                id: socket.id,
                userId: userId
            };

            if (findIndex(users, currentUser.id) > -1) {
                console.log('[INFO] User ID is already connected, kicking.');
                socket.disconnect();
            }  /*else if (!validNick(currentUser.nick)) {
                socket.disconnect();
            }*/ else {
                console.log('[INFO] User ID: ' + currentUser.userId + ' connected!');
                sockets[currentUser.id] = socket;
                users.push(currentUser);
                webSocket.emit('User Join', { userId: currentUser.userId });
                console.log('[INFO] Total users: ' + users.length);
            }

            socket.on('ding', () => {
                socket.emit('dong');
            });

            socket.on('disconnect', () => {
                if (findIndex(users, currentUser.id) > -1) users.splice(findIndex(users, currentUser.id), 1);
                console.log('[INFO] User ' + currentUser.userId + ' disconnected!');
                socket.broadcast.emit('userDisconnect', { userId: currentUser.userId });
            });

            //Bind the events contained within the service to this socket
            this.services[serviceId].setWebSocketEvents(socket);

            /*
            socket.on('action', (data) => {
                let _nick = sanitizeString(data.nick);
                let _message = sanitizeString(data.message);
                let date = new Date();
                let time = ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2);

                console.log('[CHAT] [' + time + '] ' + _nick + ': ' + _message);
                socket.broadcast.emit('serverSendUserChat', {nick: _nick, message: _message});
            });*/
        });

        httpServer.listen(port, () => {
            console.log('[INFO] ' + namespace + ' Listening on *:' + port);
        });



        return true;
    }

    _createSocketComponent(serviceId, namespace, port)
    {
        let setListener = true;
        if (this.isPortReserved(port))
        {
            setListener = false;
            let pos = this.portReservations.indexOf(port);
            let serviceNamespace = this.portReservationNamespace[pos];
            if (serviceNamespace != namespace)
            {
                global.Logger.log('Network:_createSocketComponent', 400, 'Unable to create new socket component - Port Reserved by another service. Attempted to mount: ' + namespace + ' / ServiceId: ' + serviceId + ' - Existing service assigned to port: ' + serviceNamespace,
                    { type: isRest === false ? 'http' : 'rest' });
                return false;
            }
        }

        var server = net.createServer((socket) => {
            // 'connection' listener
            console.log('client connected');
            socket.on('end', () => {
                console.log('client disconnected');
            });
            socket.write('hello\r\n');
            socket.pipe(socket);
        });

        server.on('error', (err) => {
            //throw err;
            console.log('A socket error has occurred');
            global.Logger.log('Network:_createSocketComponent', 400, 'A socket error has occurred in Service Namespace: ' + namepsace + ' - Service Id: ' + serviceId);
        });

        if (setListener)
        {
            server.listen(port, () => {
                console.log('server bound');
            });
        }
        return true;
    }

    _createApiComponent(serviceId, namespace)
    {
        return Api.addApiNode(serviceId, namespace, this.services[serviceId].apiRequest);
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