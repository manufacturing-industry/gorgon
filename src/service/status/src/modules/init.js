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
import CommonLib from '../../../../component/client/common'

/**
 * The front-end application init
 */
class AppInit {

    constructor()
    {
        this.common = new CommonLib();

        console.log('i work on the web!');

        console.log('common lib is mounted');
    }

    run()
    {
        console.log('Your web app is now running!');
        console.log('connecting to web socket');

        //Host, connect, event, disconnect
        this.common.webSocket('http://localhost:2688', function(){
            //connect
            console.log('web socket has connected');
        }, function(data){
            //event
            console.log('web socket has an event');
            console.log(data);
        }, function(){
            //disconnection
            console.log('web socket has disconnected');
        });
    }


}

var webApp = new AppInit();
webApp.run();