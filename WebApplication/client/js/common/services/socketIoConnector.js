/*global connector: false, angular: false, console: false, io: false*/
connector
    .factory("socketioconnector", function () {
        "use strict";
        var that = this, connection = io.connect('<%= pkg.wsServer %>'),
            suscriptors = [], handleMessage, fireEvent;

        handleMessage = function (data) {
            var evtName;
            data = JSON.parse(data);
            for (evtName in data) {
                if (data.hasOwnProperty(evtName)) {
                    fireEvent(evtName, data[evtName]);
                }
            }
        };

        fireEvent = function (event) {
            var len = suscriptors.length, evtHandler,
                args = Array.prototype.slice.call(arguments);
            console.log(event + " FIRED");
            while (len--) {
                evtHandler = suscriptors[len];
                if (typeof evtHandler[event] === "function") {
                    evtHandler[event].apply(that, args.slice(1, args.length));
                }
            }
        };

        connection.on('connect', function (socket) {
            console.log("WS connection OPEN...");
            fireEvent("connectionopen");
        });


        connection.on('message', function (message) {
            handleMessage(message);
        });

        connection.on('disconnect', function () {
            console.log("WS connection CLOSED.");
        });

        return {
            sendMessage: function (messageType, data, fn) {
                var message = {
                    type: messageType,
                    data: data,
                    fn  : fn
                };
                connection.send(angular.toJson(message));
            },
            on         : function (event, handler) {
                var evtHandler = {};
                evtHandler[event] = handler;
                suscriptors.push(evtHandler);
            }

        };
    });