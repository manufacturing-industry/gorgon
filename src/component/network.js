/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

export class Network {
    constructor()
    {
        this.services = [];
        this.serviceMap = [];
    }

    addService(service)
    {

    }

    removeService(service)
    {

    }

    add(service, type, label, port)
    {

    }

    remove(service, type, label)
    {

    }

    call()
    {

    }

    __webSocket()
    {

    }

    __webServer()
    {

    }

}

class NetworkConnectionFactory
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