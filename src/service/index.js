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
    constructor() {
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
    constructor()
    {
        this.name = '';
        this.description = '';
        this.type = 'Service';
        this.router = null;
        this.ports = [];
        this.permissions = [];
    }
}