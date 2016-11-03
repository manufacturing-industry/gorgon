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
import net from 'net';
import http from 'http';
import SocketIO from 'socket.io';
import compression from 'compression';
import express from 'express';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import moment from 'moment';
import session from 'express-session';
import twig from 'twig';

/*
 * Variables
 */

/**
 * Contains the singleton instance for the network
 * @type {null|Network}
 */
let instance = null;

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
            /**
             * The gorgon server config
             * @type {GorgonConfig}
             */
            this.GorgonConfig = new GorgonConfig();

            /**
             * The middleware for the class
             * @type {Middleware}
             */
            this.middleware = new Middleware();

            /**
             * The services stack
             * @type {Array}
             */
            this.services = [];

            /**
             * The service stack map
             * @type {Array}
             */
            this.serviceMap = [];

            /**
             * The component collection
             * @type {Array}
             */
            this.components = [];

            /**
             * The component collection map
             * @type {Array}
             */
            this.componentMap = [];

            /**
             * The component collection type map
             * @type {{rest: Array, socket: Array, webSocket: Array, http: Array, api: Array}}
             */
            this.componentTypeMap = {
                rest: [],
                socket: [],
                webSocket: [],
                http: [],
                api: []
            };

            /**
             * The network API control
             * @type {Api}
             */
            this.api = new Api();

            /**
             * The port reservation list
             * @type {Array}
             */
            this.portReservations = [];

            /**
             * The port reservation namespace list
             * @type {Array}
             */
            this.portReservationNamespace = [];

            /**
             * The active service in the network stack
             * @type {Array}
             */
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
                for(var i=0; i < service.networking.length; i++) this.add(serviceId, service.namespace, service.networking[i].name, 'label', service.networking[i].port);
                global.Logger.log('Network:addService', 200, 'Added services components: ' + service.name + ' for Service: ' + service.namespace + ' - ServiceId: ' + serviceId);
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
            if (port == undefined || port == null) port = 0;
            switch(type)
            {
                default:
                    global.Logger.log('Network:add', 400, 'Unable to load component type of: ' + type + ' for Service: ' + serviceNamespace + ' - ServiceId: ' + serviceId);
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
                    created = this._createApiComponent(serviceId, serviceNamespace);
                    break;
            }

            if (created === false) return false;
            this.components.push(created);
            this.componentMap.push(serviceNamespace + '-' + type + '-' + label + '-' + port);
            this.componentTypeMap[type].push(serviceNamespace + '-' + type + '-' + port);
            global.Logger.log('Network:add', 200, 'Added network component: ' + type + ' for Service: ' + serviceNamespace + ' - ServiceId: ' + serviceId);
            return true;
        }
        return false;
    }

    /**
     * Creates a REST network component
     *
     * @note A REST network component uses the http 1.1 stack (express)
     * @note When the port is set to 0 a random available port will be assigned
     *
     * @param {number} serviceId The services id from the service stack
     * @param {string} namespace The namespace for the service
     * @param {null|number} port The port for the service or null.
     * @param {function} middleware The middleware to call for this service
     * @returns {*} Returns component if created or false on failure
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
     * @note A http network component uses the http 1.1 stack (express)
     * @note When the port is set to 0 a random available port will be assigned
     *
     * @param {number} serviceId The services id from the service stack
     * @param {string} namespace The namespace for the service
     * @param {null|number} port The port for the service or null.
     * @param {function} middleware The middleware to call for this service
     * @param {boolean|undefined} isRest Controls the rest interface flag when creating the http instance
     * @returns {*} Returns component if created or false on failure
     * @private
     */
    _createHttpComponent(serviceId, namespace, port, middleware, isRest)
    {
        let setListener = true;
        if (isRest == undefined) isRest = false;

        let service = this.services[serviceId];
        let date = moment();
        let accessLogStream = fs.createWriteStream(path.join(this.GorgonConfig.storage.logs, 'access-' + service.namespace + '-' + date.format('YYYYMMDD') + '.log'), {flags: 'a'});

        /*
         * Configure Server
         */
        var server = express();
        //server.use(compression({}));
        server.use(favicon(service.filePath + '/public/img/medusa.png'));
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(cookieParser());
        server.use(express.static(path.join(service.filePath, '/public')));
        server.use(morgan('combined', {stream: accessLogStream}));
        if (isRest) server.use(session({
            cookie: { path: '/', httpOnly: true, secure: false, maxAge: null },
            secret:'2099GORGON-X',
            resave: true,
            saveUninitialized: true
        }));
        server.set('views', path.join(service.filePath, 'views'));
        server.set('view engine', 'twig');
        server.disable('etag');

        var component = server.all('*', function (req, res) {
            //Middleware.callChannel('PRE_REQUEST', req);
            //Middleware.callChannel('PRE_RESPONSE', res);
            NetworkStack.services[serviceId].serviceRequest(req, res, isRest === false ? 'http' : 'rest');
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
            var listener = component.listen(port, function () {
                NetworkStack.addPortReservation(namespace, listener.address().port);
                global.Console.status('info', 'Http Bound Type: ' + (isRest === false ? 'http' : 'rest') + ' - Service: ' + namespace + ' - ' + (port == 0 ? 'Random ' : '') + 'Port: ' + listener.address().port);
                global.Logger.log('Network:_createHttpComponent', 200, 'Created new http component - Mounted: ' + namespace + ' / ServiceId: ' + serviceId + ' - listening on ' + (port == 0 ? 'Random ' : '') + 'Port: ' + listener.address().port,
                    { type: isRest === false ? 'http' : 'rest' });
            });
        }

        return component;
    }

    /**
     * Creates a web socket network component
     *
     * @note Uses socket io/express for web socket server
     * @note When the port is set to 0 a random available port will be assigned
     *
     * @param {number} serviceId The services id from the service stack
     * @param {string} namespace The namespace for the service
     * @param {number} port The port for the web socket component
     * @param {function} middleware The middleware to call for this service
     * @returns {*} Returns component if created or false on failure
     * @private
     */
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
                global.Logger.log('Network:_createWebSocketComponent', 400, 'Unable to create component - Port Reserved by another service. Attempted to mount: ' + namespace + ' / ServiceId: ' + serviceId + ' - Existing service assigned to port: ' + serviceNamespace);
                return false;
            }
        }

        //create webSocket component
        var server = express();
        //server.use(compression({}));

        var httpServer = http.Server(server);
        var webSocket = new SocketIO(httpServer);

        let users = [];
        let sockets = {};

        //webSocket.use(compression({}));
        //app.use(express['static'](__dirname + '/../../client'));

        webSocket.on('connection', (socket) => {
            //let userId = socket.handshake.query.userId;

            let currentUser = {
                id: socket.id,
                userId: socket.id
            };



            if (users.indexOf(currentUser.id) > -1) {
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
                if (users.indexOf(currentUser.id) > -1)
                {
                    users.splice(users.indexOf(currentUser.id), 1);
                }
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

        var listener = httpServer.listen(port, () => {
            NetworkStack.addPortReservation(namespace, listener.address().port);
            global.Console.status('info', 'Web Socket Bound - Service: ' + namespace + ' - ' + (port == 0 ? 'Random ' : '') + 'Port: ' + listener.address().port);
            global.Logger.log('Network:_createWebSocketComponent', 200, 'Created new web socket component - Mounted: ' + namespace + ' / ServiceId: ' + serviceId + ' - listening on ' + (port == 0 ? 'Random ' : '') + 'Port: ' + listener.address().port);
        });

        return webSocket;
    }

    /**
     * Creates a TCP/IP socket network component
     *
     * @note When the port is set to 0 a random available port will be assigned
     *
     * @param {number} serviceId The services id from the service stack
     * @param {string} namespace The namespace for the service
     * @param port The port for the TCP/IP socket component
     * @returns {boolean} Returns true on completion and false on error
     * @private
     */
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
            global.Logger.log('Network:_createSocketComponent', 400, 'A socket error has occurred in Service: ' + namepsace + ' - Service Id: ' + serviceId);
        });

        if (setListener)
        {
            var listener = server.listen(port, () => {
                NetworkStack.addPortReservation(namespace, listener.address().port);
                global.Console.status('info', 'TCP/IP Socket Bound - Service: ' + namespace + ' - ' + (port == 0 ? 'Random ' : '') + 'Port: ' + listener.address().port);
                global.Logger.log('Network:_createSocketComponent', 200, 'Created new TCP/IP socket component - Mounted: ' + namespace + ' / ServiceId: ' + serviceId + ' - listening on ' + (port == 0 ? 'Random ' : '') + 'Port: ' + listener.address().port);
            });
        }
        return server;
    }

    /**
     * Create an API extension component
     *
     * @param {number} serviceId The services id from the service stack
     * @param {string} namespace The namespace for the service
     * @returns {boolean} Returns true on completion and false on error
     * @private
     */
    _createApiComponent(serviceId, namespace)
    {
        return this.api.addApiNode(serviceId, namespace, this.services[serviceId].apiRequest);
    }

    /**
     * Removes a service network component
     *
     * @param {string} serviceNamespace The service namespace for the component
     * @param {string} type The network component type
     * @param {string} label The label for the component
     * @return {boolean} Returns true on completion and false on failure
     * @todo Need to complete this
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

    /**
     * Adds a port reservation to the network stack
     * @param {string} namespace The service namespace for the reserved port
     * @param {number} port The port number
     * @returns {boolean} Returns true on completion
     */
    addPortReservation(namespace, port)
    {
        this.portReservations.push(port);
        this.portReservationNamespace.push(namespace);
        return true;
    }
}

/*
 * Exports
 */

/**
 * The network stack singleton instance instantiation
 * @type {Network}
 */
var NetworkStack = new Network();

export default NetworkStack;