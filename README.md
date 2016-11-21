#Gorgon [![Build Status](https://travis-ci.org/manufacturing-industry/gorgon.svg?branch=master)](https://travis-ci.org/manufacturing-industry/gorgon) [![npm version](https://img.shields.io/npm/v/gorgon.svg?style=flat-square)](https://www.npmjs.com/package/gorgon) [![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)]() [![npm](https://img.shields.io/npm/dt/gorgon.svg?maxAge=2592000)]()
An ES6 highly scriptable, configurable, and network capable service container server for Node JS.

##What is the purpose of Gorgon?
Gorgon provides a server daemon, command line interface (CLI), and API that can be used to create robust network based services. You can create scripted services that can be used to develop software defined networks of instanced micro services.  Services run in service containers that can easily mount network and storage services.  In the future we will also include a cross node communication network layer to easily scale your services to any size needed.

##Latest News
* RELEASE: Gorgon v0.1.3 is out - updates the service monitor ui / ux. This service can be used as an example to build more services - grab it in [releases](https://github.com/manufacturing-industry/gorgon/releases)!
* Update: Initial Travis-ci support.  If the build shows as broke, don't worry - it 'should' run.

##System Requirements
* Node JS 6 or greater
* Extra: System Build Tools (For Electron Apps - Run: npm run install-global)

##Installation via Git
- Clone this repository
- Enter the directory.
- In your console: npm install
- Run the server: npm run babel

##Installation via NPM
- npm install gorgon
- NOTE: NPM installation has not been tested or refined yet.

##Installation from Source
- You can obtain the full source code/package in [releases](https://github.com/manufacturing-industry/gorgon/releases).

##Tests
- Run the test suite: npm test

##Dev Mode
- Run the server: npm run babel-debug

##Applications
Gorgon is a collection of applications that allow for a robust network service infrastructure.

Application  | Status
------------- | -------------
Server  | Alpha
Web CLI | Development
WebSocket Client | Development

##Core Features
- NOTE: This is currently pre-alpha, we will update the documentation as the server becomes more stable and capable.

Feature  | Status
------------- | -------------
Config  | Beta
Logger  | Beta
Access Logs | Alpha
Middleware  | Alpha
Routing  | Alpha
Service Containers | Beta
Network Service Layer  | Beta
Storage Service Layer  | Beta
Error Handler Components | Beta
Status Service | Alpha
Sessions | Development

###Applications & Services
Application  | Status
------------- | -------------
Service Monitor | Beta

###Networking Service Layer
Feature  | Status
------------- | -------------
Web Sockets | Beta
REST HTTP/1.1 | Beta
HTTP/1.1 | Beta
TCP/IP Sockets | Beta
HTTP/2.0 | Development
Streams | Development

###Storage Service Layer
Feature  | Status
------------- | -------------
Base Storage Driver | Beta
Memory Storage Driver | Beta
Timed Storage Driver | Beta

##Planned API Integrations
Feature  | Status
------------- | -------------
Mongo | Development
MySQL | Development
AWS | Development

##Have a contribution?
Please feel free to fork this repository and submit pull requests.

##Found a Bug or Have a Suggestion?
Please report your bug or suggestion to the [issues](https://github.com/manufacturing-industry/gorgon/issues) section.
 
##Author
- Ryan Rentfro - rrentfro at gmail dot com

##License

#####License Information
- MIT - https://opensource.org/licenses/MIT