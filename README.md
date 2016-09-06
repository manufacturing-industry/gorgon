#Gorgon
An ES6 highly scriptable, configurable, and network capable service container server for Node JS.

##What is the purpose of Gorgon?
Gorgon provides a server daemon, command line interface (CLI), and API that can be used to create robust network based services. You can create scripted services that can be used to develop software defined networks of instanced micro services.  Services run in service containers that can easily mount network and storage services.  In the future we will also include a cross node communication network layer to easily scale your services to any size needed.

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
Config  | Alpha
Logger  | Beta
Sessions | Development
Routing  | Alpha
Service Containers | Alpha
Network Components  | Development
Storage  | Development
Status Service | Development

###Planned Network Support
Feature  | Status
------------- | -------------
Web Sockets | Development
HTTP/1.1 | Development
HTTP/2.0 | Development
TCP/IP Sockets | Development
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