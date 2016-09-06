/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * The network controls class
 *
 * @note Creates and maps the network components for services
 */
export class Network {
    /**
     * Constructs the class
     */
    constructor()
    {
        this.services = [];
        this.serviceMap = [];
        this.componentTypeMap = {
            rest: [],
            socket: [],
            webSocket: [],
            http: [],
            api: []
        };
        this.portReservations = [];
        this.activeServices = [];
    }

    /**
     * Adds a service to the network layer
     *
     * @param {object} service The service to be added
     * @return {boolean} Returns true on completion and false on failure
     */
    addService(service)
    {
        if (activeServices.indexOf('service.namespace') == -1)
        {
            this.services.push(service);
            this.serviceMap.push(service.namespace);
            serviceId = this.serviceMap.length - 1;

            /*
             * Add networking components
             */
            if (service.networking instanceof Array)
            {
                service.networking.forEach(function(value){

                }, this);

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
            this.componentTypeMap[type].push(serviceNamespace + '-' + type + '-' + label + '-' + port);
            this.serviceMap.push(serviceNamespace + '-' + type + '-' + label + '-' + port);
        }
        return false;


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