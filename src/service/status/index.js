/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

import {Routes} from '../../component/routes'
import {GorgonService} from '../index';

class StatusService extends GorgonService {
    constructor()
    {
        super();
        this.name = 'Status';
        this.description = 'Provides service status';
        this.type = 'Service';
        this.https = 'enable';
        this.inboundTypes = ['rest', 'socket', 'http', 'webSocket', 'api'];
        this.router = new Routes(this.name);
        this.ports = [2600, null, 2680, 2688, null];
        this.permissions = ['internal'];
        this.router.import(this.routes());
    }

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

    serviceRequest()
    {

    }

    page_Index()
    {

    }

    page_Services()
    {

    }
}

export default StatusService;