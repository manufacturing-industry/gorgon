/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

export class Routes {
    constructor(serviceNamespace) {
        this.service = serviceNamespace;
        this.inboundTypes = ['rest', 'socket', 'http', 'https', 'webSocket', 'api'];
        this.routes = [];
        this.routeCallbacks = [];
        this.permissionMap = [];
    }

    add(inboundTypes, method, callback)
    {
        this.routes.push(method);
        this.routeCallbacks(callback);
        var pos = this.routeCallbacks.length - 1;

        inboundTypes.forEach(function(value){
            if (this.inboundTypes.indexOf(value) > -1) this.permissionMap[value].push(pos);
            else console.log('ERROR - Invalid Permission Encountered in Service: [' + this.service + '] Method: [' + method + ']');
        });
    }

    remove(method)
    {
        let pos = this.routes.indexOf(method);
        if (pos > -1)
        {
            this.routeCallbacks[pos] = null;
            this.routes[pos] = null;

            this.inboundTypes.forEach(function(value)
            {
                if (this.permissionMap[value] != undefined && this.permissionMap[value] instanceof Array)
                {
                    let keyPos = this.permissionMap[value].indexOf(pos);
                    if (keyPos > -1) this.permissionMap[value].splice(keyPos, 1);
                }
            });
            return true;
        }
        return false;
    }

    importRoutes(routes)
    {
        if (routes instanceof Array)
        {
            for (var key in routes) {
                if (routes.hasOwnProperty(key)) {
                    this.add(routes[key]['inboundTypes'], routes[key]['method'], routes[key]['callback']);
                }
            }
        }
        return false;
    }

    route(inboundType, method, payload)
    {
        let pos = this.routes.indexOf(method);
        if (pos > -1)
        {
            if (this.permissionMap[inboundType] != undefined && this.permissionMap[inboundType].length > 0 && this.permissionMap[inboundType].indexOf(pos) > -1)
            {
                //callback exists for method
                return this.routeCallbacks[pos](method, inboundType, ...payload);
            }
        }
        return false;
    }
}