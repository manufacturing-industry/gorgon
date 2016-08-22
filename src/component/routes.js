/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

import _ from 'lodash'

export class Routes {
    construct() {
        this.routes = [];
        this.routeMap = [];
        this.serviceMap = [];
    }

    addServiceContainer(service)
    {
        if (service.routes == null || service.routes == '' && service.routes instanceof Array)
        var routeTable = new RouteItemFactory(service.routes);
        routeTable.forEach(function (value) {
            let routePath = value.parent == null || value.parent == '' ? value.service : value.parent + '/' + value.service;
            this.routes.push(value);
            this.routeMap.push(routePath);
            let pos = this.routeMap.length - 1;
            this.serviceMap[value.service].push(pos);
        });
    }

    removeServiceContainer(serviceName)
    {
        let pos = this.serviceMap.indexOf(serviceName);
        if (pos > -1)
        {
            this.routeMap.forEach(function(value){
                this.routes[value] = null;
                this.routeMap[value] = null;
            });
            return true;
        }
        return false;
    }
}

export class RouteItemFactory
{
    construct(routes)
    {
        var routeTable = [];
        routes.forEach(function (value) {
            routeTable.push(new RouteItem(value.service, value.parent, value.command))
        });

        return routeTable;
    }
}

export class RouteItem
{
    construct(service, parent, command)
    {
        this.service = null;
        this.parent = null;
        this.command = null;
    }

    call(payload)
    {
        return this.command(...payload);
    }
}