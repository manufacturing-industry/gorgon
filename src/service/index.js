/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * The Gorgon Container Service Class
 *
 * @note This class provides containers for services
 */
export class GorgonContainerService {
    /**
     * Constructs the class
     */
    constructor()
    {
        this.containers = [];
        this.containerMap = [];
        this.name = "Gorgon Container Service";
        this.type = "Service";
    }

    /**
     * Adds a new service by creating a container and injecting the service and its location to the service map
     *
     * @param {object} service The service to tbe added
     * @returns {boolean} Returns true on completion and false on failure
     */
    add(service)
    {
        if (service.namespace != null && service.namespace != '' && this.containerMap.indexOf(service.namespace) == -1)
        {
            this.containers.push(service);
            this.containerMap.push(service.namespace);
            return true;
        }
        return false;
    }

    /**
     * Removes a service container by the service namespace
     *
     * @param {string} serviceNamespace The service namespace to be removed
     * @returns {boolean} Returns true on completion and false on failure
     */
    remove(serviceNamespace)
    {
        if (this.containerMap.indexOf(serviceNamespace) > -1)
        {
            let pos = this.containerMap.indexOf(serviceNamespace);
            this.containers.splice(pos, 1);
            this.containerMap.splice(pos, 1);
            return true;
        }
        return false;
    }

    /**
     * Retrieves a service container by its namespace
     *
     * @param {string} serviceNamespace The service namespace
     * @returns {*} Returns the service when located or false when not located
     */
    get(serviceNamespace)
    {
        if (this.containerMap.indexOf(serviceNamespace) > -1) return this.containers[this.containerMap.indexOf(serviceNamespace)];
        return false;
    }
}

/**
 * The gorgon service object
 *
 * @note Provides the service, default properties/methods used for constructing containers
 */
export class GorgonService
{
    /**
     * Constructs the class
     */
    constructor()
    {
        /**
         * The service id for the service
         *
         * @note The service Id is set when a service is added to the network layer and its service id is returned
         *
         * @type {null|number}
         */
        this.serviceId = null;

        /**
         * The service name
         * @type {null|string}
         */
        this.name = null;

        /**
         * The service description
         * @type {null|string}
         */
        this.description = null;

        /**
         * The service type
         * @type {string}
         */
        this.type = 'Service';

        /**
         * The service router
         * @type {null|Router}
         */
        this.router = null;

        /**
         * The list of inbound service types to connect
         *
         * @note These map 1:1 with this.ports
         *
         * @type {Array}
         */
        this.inboundTypes = [];

        /**
         * The list of inbound ports types to
         *
         * @note These map 1:1 with this.inboundTypes
         *
         * @type {Array}
         */
        this.ports = [];

        /**
         * The service permissions list
         * @type {Array}
         */
        this.permissions = [];

        /**
         * The service networking configuration
         *
         * @note Most object will build this via this._setNetworking
         *
         * @type {Array}
         */
        this.networking = [];
    }

    /**
     * Sets the networking property via the inboundTypes and ports properties
     * @private
     */
    _setNetworking()
    {
        if (this.inboundTypes instanceof Array && this.ports instanceof Array && this.inboundTypes.length == this.ports.length)
        {
            for(var i = 0; i < this.inboundTypes.length; i++)
            {
                this.networking.push({ name: this.inboundTypes[i], port: this.ports[i] })
            }
        } else {
            console.warn('GorgonService:_setNetworking - Missing or invalid networking for service ' + this.name);
        }
    }

    /**
     * Sets the serviceId for the service
     * @param {number} serviceId
     * @return {boolean} Returns true on completion
     */
    setServiceId(serviceId)
    {
        this.serviceId = serviceId;
        return true;
    }

    apiRequest(req, res, isRest)
    {
        return null;
    }

    setWebSocketEvents(socket)
    {
        return null;
    }
}