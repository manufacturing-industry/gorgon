/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */
import {Routes} from '../component/routes'

export class GorgonContainerService {
    construct() {
        this.containers = [];
        this.containerMap = [];
        this.name = "Gorgon Container Service";
        this.type = "Service";
    }

    add(service)
    {
        if (service.name != null && service.name != '' && this.containerMap.indexOf(service.name) == -1)
        {
            this.containers.push(service);
            this.containerMap.push(service.name);
            return true;
        }
        return false;
    }

    remove(serviceName)
    {
        if (this.containerMap.indexOf(serviceName) > -1)
        {
            let pos = this.containerMap.indexOf(serviceName);
            this.containers.splice(pos, 1);
            this.containerMap.splice(pos, 1);
            return true;
        }
        return false;
    }

    get(serviceName)
    {
        if (this.containerMap.indexOf(serviceName) > -1) return this.containers[this.containerMap.indexOf(serviceName)];
        return false;
    }
}

export class GorgonService
{
    construct(name)
    {
        this.name = name;
        this.type = 'Service';
        this.router = new Rooutes(name);
    }
}