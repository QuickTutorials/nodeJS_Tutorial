/*global connector: false*/
connector
    .factory("mockconnector", function () {
        "use strict";

        return {
            sendMessage: function () {},
            on         : function () {}
        };
    });