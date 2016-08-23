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
import {GorgonConfig} from "config/config";
import {GorgonEnv} from "config/env";
import {GorgonContainerServiceLoader} from 'service/index';
import {GorgonContainerService} from 'service/index';

/**
 * The Gorgon main class
 */
class Gorgon {
    constructor()
    {
        this.GorgonConfig = new GorgonConfig();
        this.GorgonEnv = new GorgonEnv();
        console.log(this.GorgonConfig);
        console.log(this.GorgonEnv);
    }

    initServer()
    {
        this.GorgonEnv.service.forEach(function(value){
            console.log('Load Service');
            console.log(value.namespace);
        });
    }
}

/*
 * Run Gorgon Server
 */
var GorgonServer = new Gorgon();
GorgonServer.initServer();