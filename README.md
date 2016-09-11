#Gorgon
An ES6 highly scriptable, configurable, and network capable service container server for Node JS.

##What is the purpose of Gorgon?
Gorgon provides a server daemon, command line interface (CLI), and API that can be used to create robust network based services. You can create scripted services that can be used to develop software defined networks of instanced micro services.  Services run in service containers that can easily mount network and storage services.  In the future we will also include a cross node communication network layer to easily scale your services to any size needed.

##Latest News
* RELEASE: Gorgon v0.0.2 is out - you can bow build services, grab it in [releases](https://github.com/manufacturing-industry/gorgon/releases)!

##System Requirements
* Node JS
* Extra: System Build Tools (For Electron Apps)

##Installation
- Clone this repository
- Enter the directory.
- In your console: npm install
- Build the project: npm run build
- Run gorgon: npm run gorgon

##Build & Run (For Development)
- Build/Run Gorgon: npm run gorgon-build

##Current Features
- NOTE: This is currently pre-alpha, we will update the documentation as the server becomes more stable and capable.

Feature  | Status
------------- | -------------
Config  | Beta
Logger  | Beta
Middleware  | Alpha
Routing  | Alpha
Service Containers | Beta
Network Components  | Beta
Storage  | Beta
Status Service | Alpha
Sessions | Development

###Planned Network Support
Feature  | Status
------------- | -------------
Web Sockets | Beta
REST HTTP/1.1 | Beta
HTTP/1.1 | Beta
TCP/IP Sockets | Beta
HTTP/2.0 | Development
Streams | Development

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