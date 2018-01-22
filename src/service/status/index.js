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
import {Routes} from '../../component/routes'
import {GorgonService} from '../index';
import {StatusServiceConfig} from '../../config/config';
import {Network} from '../../component/network'
import moment from 'moment'

const NetworkStack = new Network();

/**
 * The status service
 *
 * @note Provides status on server configuration
 */
class StatusService extends GorgonService {
    /**
     * Constructs the class
     */
    constructor()
    {
        super();

        /**
         * The status service configuration
         * @type {StatusServiceConfig}
         */
        this.config = StatusServiceConfig;

        /**
         * The service name
         * @type {string}
         */
        this.name = 'Status Service';

        /**
         * The service namespace
         * @type {string}
         */
        this.namespace = 'StatusService';

        /**
         * The service description
         * @type {string}
         */
        this.description = 'Provides service status';

        /**
         * The service type
         * @type {string}
         */
        this.type = 'Service';

        /**
         * The service https control - controls how https works for the services exposed http endpoints
         * @type {string|boolean} Can be enable, disable, true, false, or enforce
         */
        this.https = true;

        /**
         * The inbound types supported by the service
         * @type {string[]}
         */
        this.inboundTypes = ['rest', 'socket', 'http', 'webSocket', 'api'];

        /**
         * The ports that map to the inbound types 1:1
         * @type {number|null[]}
         */
        this.ports = [2600, null, 2680, 2688, null];

        /**
         * The router for the service
         * @type {Routes}
         */
        this.router = new Routes(this.namepsace);

        /**
         * The permissions for the service
         * @type {string[]} Can be internal and/or external
         */
        this.permissions = ['internal'];

        /**
         * The file path for the service
         * @type {String}
         */
        this.filePath = __dirname;

        /**
         * Binds the services routes and networking
         */
        this.serviceBind();
    }

    /**
     * The routes configuration for the service
     *
     * @note This is loaded into the classes router and the network stack
     */
    routes()
    {
        return {
            'ServiceStatus':
            {
                inboundTypes: this.inboundTypes,
                method: '/ServiceStatus',
                callback: this.serviceStatus,
                note: 'Used for requesting service details.'
            },
            'Init':
            {
                inboundTypes: ['http'],
                method: '/',
                callback: this._pageInit,
                note: 'Used for requesting the home page.'
            }
        };

    }

    /**
     * Initializes the web app
     *
     * @param {string} method The method being called from the URL
     * @param {string} inboundType How the request has inbound
     * @param {object} req The request object
     * @param {object} res The response object
     */
    serviceStatus(method, inboundType, req, res)
    {
        console.warn('service status was called');
        console.log('Method: ' + method + ' - Inbound Type: ' + inboundType);
        console.log('Request');
        console.log(req);


        if (req.method === 'GET')
        {

        }
    }

    /**
     * Initializes the web app
     *
     * @param {string} method The method being called from the URL
     * @param {string} inboundType How the request has inbound
     * @param {object} req The request object
     * @param {object} res The response object
     * @private
     */
    _pageInit(method, inboundType, req, res)
    {
        if (inboundType !== 'http' || method !== '/' && req.method === 'GET')
        {
            global.Console.status('notice', 'Invalid Service Request in StatusService:_pageInit for Method: ' + req.method + ' - Inbound Type: ' + inboundType,
                {
                    requested: method,
                    inboundType: inboundType,
                    method: req.method
                });
            global.Logger.log('StatusService:_pageInit', 300, 'Invalid Page Request', {
                requested: method,
                inboundType: inboundType,
                method: req.method
            });
            res.status(405).end();
        }

        global.Console.status('info', 'Status Service Routed: ' + method + ' - Method: ' + req.method);

        res.status(200).render('init.twig', {
            title: 'Gorgon Service Monitor',
            message: 'Gorgon Service Monitor',
            upTime: global.getUpTime(),
            version: global.Version,
            nodeTotal: global.ConnectedNodes,
            connectedClientTotal: global.ConnectedClients,
            serviceTotal: global.ServiceTotal,
            serviceFail: global.ServiceFail,
            serviceError: global.ServiceError,
            serviceWarning: global.ServiceWarning,
            connectStat: global.connectStat,
            sessionStat: global.sessionStat,
            storageStat: global.storageStat,
            lastCheck: moment().calendar()
    });
    }

    /**
     * The service request method for http and rest services
     *
     * @note Provides the service request for the server
     *
     * @param {Request} req A request object
     * @param {Object} res A response object
     * @param {string} mode Controls if the call is http or rest
     * @todo Add routing for handling inbound requests
     */
    serviceRequest(req, res, mode)
    {
        if (req instanceof Object && res instanceof Object && this.inboundTypes.indexOf(mode) > -1)
        {
            this.router.route(mode, req.originalUrl, [req, res] );
            return true;
        }

        global.Console.status('notice', 'Invalid Service Request in StatusService:serviceRequest for mode: ' + mode);
        global.Logger.log('StatusService:serviceRequest', 300, 'Invalid Service Request', { mode: mode });
        return false;
    }

    /**
     * The service api call method
     *
     * @param data
     * @todo Add routing for handling inbound requests
     */
    apiRequest(data)
    {

    }

    /**
     * Sets the web socket events after socket creation
     *
     * @param {object} socket The web socket
     */
    setWebSocketEvents(socket)
    {

    }

    /**
     * Binds the services routes and networking components
     *
     * @return {boolean} Returns true on completion
     */
    serviceBind()
    {
        /*
         * Imports the routers routes from the class
         */
        this.router.importRoutes(this.routes());

        /*
         * Set the networking configuration for the class
         */
        this._setNetworking();

        /*
         * Add the service to the network
         */
        NetworkStack.addService(this);

        return true;
    }

    /**
     * Unbinds the service from the network stack
     */
    serviceUnbind()
    {
        NetworkStack.removeService(this.namespace);
    }
}

/*
 * Exports
 */
export default StatusService;