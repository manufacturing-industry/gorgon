/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * The session class
 */
export class Session {
    /**
     * Constructs the class
     */
    constructor()
    {
        this.topicMap = [];
        this.subscribers = [];
        this.subscriberMap = [];
    }

}