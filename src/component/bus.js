/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */

/**
 * The service event message bus class
 *
 * @note Allows for topic subscription for service events
 */
export class Bus {
    /**
     * Constructs the class
     */
    constructor() {
        this.topicMap = [];
        this.subscribers = [];
        this.subscriberMap = [];
    }

}