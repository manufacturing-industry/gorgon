/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * The common library controls for the front end client
 *
 */
export default class CommonLib
{
    constructor()
    {
        this.name = 'Common Library';
    }

    /**
     * Used to post to a service
     *
     * @param {string} target The target to call
     * @param {object} data The object to be sent
     * @param {function} callback The callback the data should be returned to
     */
    post(target, data, callback)
    {
        $.post(target, data, function() {
            /*Request is sent */
        })
        .done(function()
        {
            if (typeof data !== 'object') data = JSON.parse(data);
            if (data)
            {
                if (typeof callback === "function") callback(data); //sends the requested data back to the control handler
                return true;
            }
            if (typeof callback === "function") callback(false);
            return false;
        })
        .fail(function() {

        })
        .always(function() {

        });
    }

    /**
     * Creates a new web socket connection for a client
     *
     * @param {string} host The host for the socket to connect to
     * @param {function} connect The connect callback
     * @param {function} event The event handler callback
     * @param {function} disconnect The disconnect callback
     */
    webSocket(host, connect, event, disconnect)
    {
        var socket = io(host);
        socket.on('connect', connect);
        socket.on('event', event);
        socket.on('disconnect', disconnect);

        return socket;
    }


    test()
    {
        console.log('this is a common lib test');
        this.post('http://localhost:2680/testrequest', { test1: 'test', test2: 'moreTEst' }, function(data)
        {
            console.log('my result was ');
            console.log(data);
        });
    }
}