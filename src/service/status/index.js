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
import {StatusServiceConfig} from 'config/config';
import {Network} from '../../component/network'

var NetworkStack = new Network();

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
            'ServiceRequest':
            {
                inboundTypes: this.inboundTypes,
                method: '/StatusServiceRequest',
                callback: this.serviceRequest()
            }
        };

    }

    /**
     * The service request method
     *
     * @note Provides the service request for the server
     */
    serviceRequest(req, res)
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

    serviceUnbind()
    {
        NetworkStack.removeService(this.namespace);
    }

}

/*
 * Exports
 */
export default StatusService;