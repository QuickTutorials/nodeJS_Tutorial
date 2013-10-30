The purpose of this application is take a look about some different possibilities that NodeJS offer to us in the application building process, both the back and the front side.

In this example, the communication will be based on websockets connections, provieded by the socket.io module.
The database in this application is a MongoDB hosted in www.mongolab.com

##Build client side

First at all, we are going to build the front side of the application. What might be desirable?

- We want it to be well modularized
- Testable
- Easy to optimize for deploy in production environments
- With css preprocessors
- And maybe others...

All of these features, and many others, are provided by GruntJS. But... What is Grunt? It's a task runner, a NodeJS application that provied automation, that are managed by npm. Further reading in the <a target="_blank" href="http://gruntjs.com">GruntJS site</a>.

To start usgin grunt, we need need install locally grunt dependencies located at client/package.json with the following command:

    cd client
    npm install -d

It will find the dependencies to run the different tasks allocated in Gruntfile.js (in client path).

In the next step, you need install the grunt client too as globally

    npm install -g grunt-client
    
Now, you could build the application. Simply run this command:

    grunt
    
What is it doing this? It take a look in the GruntFile.js, and search the default task:

    grunt.registerTask("default", ["jshint", "concat", "uglify", "stylus"]);

It will execute these plugins (early downloaded with the npm install -d command) with the proper configuration from the Gruntfile:

- Check sintax validations with jshint plugin of our javascript files
- Combine the different javascript sources 
- Compress and offuscate the combined result of the previous task
- Create the css file from the stylus css preprocessor

This will ready our client side to work. 

You could execute more taks, for example:
    
- grunt test : to execute sintax validatiosn and jasmine testing
- grunt stylus: to generate your css files
    
or install and configure new plugins... You only must go to the <a target="_blank" href="http://gruntjs.com/plugins">grunt plugin listing</a> and get all you need, all provided by GruntJS and nodeJS
    
##Prepare server side

Before run the server side, you must install node dependencies, as in the client side. These dependencies are located in server/package.json:

- mongodb: to connect with the mongo database
- socket.io: for the websocket's support
- express: web framework for nodejs
- q: for the javascript promises support

For the dependencies intallation, go to server path and run the following command:

    node install -d
    
It will install those dependencies

##Server config files

There are different files to configure the application:

###server/app/config/database.json: 
this file contains the configuration params to connect with the database, hosted in <a target="_blank" href="https://mongolab.com/welcome/">https://mongolab.com/welcome/</a></li>

###server/app/config/managers.json: 
this file maps the different websocket event keys to the correct manager.

##Running the server

To run the server, you must go to the server path and run the server.js with node

    node server.js
    
But... Wait a minute! Where I configure my websocket connection? I forgot it! No problem, you only need to go to your package.json in your client path, and set your host and port in the wsServer property. For example:

    "wsServer"       : "ws://localhost:8888"

Then you will need to run grunt command again. But... how my connection javascript module knows that needs to get this value from the package.json file? It is simple. In the client/js/common/services/socketioConnection.js you have this line:

    connection = io.connect('<%= pkg.wsServer %>')
    
Yes! When you run grunt, you coult treat the javascript files as templates, setting the proccess property to true, for example in the concat configuration plugin:

     concat : {
            options: {
                separator: "\n",
                process : true   //treating js files as templates!
            },
            dist   : {
                files: [
                    {
                        src : [
                            "js/common/**/*.js",
                            "js/app.js",
                            "js/app/**/*.js"
                        ],
                        dest: "build/<%= pkg.name %>.js"
                    }
                ]
            }
        }
     
This is another interesting trick with grunt. 

And it is all! You are runnning your server and you could go to your favourite web browser and run the applicacion typing http://application_host:application_port! I am sorry, it is not work on IE < 10... ups! I told you your FAVOURITE web browser!! I do not think you test it on IE<10 ;)

