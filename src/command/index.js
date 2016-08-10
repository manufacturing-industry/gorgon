/**
 * Gorgon the scripting capable network server for Node JS
 *
 * @package Gorgon
 * @author Ryan Rentfro
 * @license MIT
 * @url https://github.com/manufacturing-industry
 */


export class GorgonCommandRouter {
    construct()
    {
        this.commands = [];
        this.commandMap = [];
    }

    addCommand(command, commandConfig)
    {
        this.commands.push(commandConfig);
        this.commandMap[this.commands.length - 1] = command;
    }

    fireCommand(command, args)
    {

    }

    commandError()
    {

    }
}