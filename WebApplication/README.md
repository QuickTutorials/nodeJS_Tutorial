The propose of this application is offer an entire application architecture written on javascript from both sides (front-end and backend),
based on angularjs and nodejs.

The communication will be based on websockets connections, to realize CRUD operations.

The database in this application is a MongoDB hosted in www.mongolab.com

Tested in Google Chrome 27, Firefox 21 and Safari 6

##Build client side

The client side need to be combined/offuscated using Grunt. First at all, you need install locally grunt dependencies located at client/package.json with the following command:

    cd client
    npm install -d

It will find the dependencies to build the application.

Next, you need install the grunt client too as globally

    npm install -g grunt-client
    
Now, you could build the application. Simply run this command:

    grunt --force
    
##Prepare server side

Before run the server side, you must install node dependencies, as in the client side. These dependencies are located in server/package.json:

- mongodb: to connect with the database
- socket.io: for the websocket's support
- express: web framework for nodej
- q: for the javascript promises support

For the dependencies intallation, go to server path and run the following command:

    node install -d
    
It will install those dependencies

##Running the server

To run the server, you must go to the server path and run the server.js with node

    node server.js

##Server config

There are different files to configure the application:

###server/config.json: 
this file configure the server basics. At the moment, only configre the port where application will listen. If you wanna deploy the application usin <a target="_blank" href="https://c9.io">https://c9.io</a>, you must change the port number (default to 8888) by process.env.PORT</li>
        
###server/app/config/database.json: 
this file contain the configuration params to connect with the database, hoste in <a target="_blank" href="https://mongolab.com/welcome/">https://mongolab.com/welcome/</a></li>
