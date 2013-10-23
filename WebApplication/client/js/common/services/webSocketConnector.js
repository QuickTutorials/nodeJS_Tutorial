/*global connector : false, angular: false, console: false, WebSocket: false*/
connector
    .factory("websocketconnector", function () {
        "use strict";
        var that = this, connection = new WebSocket('<%= pkg.wsServer %>'),
            suscriptors = [], handleMessage, fireEvent;

        connection.onopen = function () {
            console.log("WS connection OPEN...");
            fireEvent("connectionopen");
        };

        connection.onclose = function () {
            console.log("WS connection CLOSED.");
        };

        handleMessage = function (e) {
            var data, evtName;
            data = JSON.parse(e.data);
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

        connection.onmessage = handleMessage;

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