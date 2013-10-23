/*global require: false, console: false*/
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require('path'),
    Controller;

server.listen(package.json);

app.get('/', function (req, res) {
    "use strict";
    res.sendfile(path.resolve(__dirname + "/../client") + "/index.html");
});

app.use(express.static(path.resolve(__dirname + "/../client") + '/'));

Controller = require('./app/Controller').Controller;

io.sockets.on('connection', function (socket) {
    "use strict";
    console.log("connection open....");
    socket.on('message', function (message) {
        console.log("Message received...");
        var data, type, mgrFunction, manager;

        data = JSON.parse(message);
        type = data.type;

        //get the manager and threat the message
        manager = Controller.getManager(type);
        //this closure returned is the function of the manager to execute
        mgrFunction = manager.handleMessage(type);
        mgrFunction(data.data).then(function (result) {
            if (result.doBroadCasting) {
                console.log("broadcasting...");
                io.sockets.send(JSON.stringify(result.data));
            } else {
                console.log("sending data");
                socket.send(JSON.stringify(result.data));
            }
        });

    });
});

