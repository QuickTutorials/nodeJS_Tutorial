var http = require("http");

var req = http.get("http://en.wikipedia.org/wiki/España", function(res) {
    var pageData = "";
    res.on('data', function(chunk) {
        pageData += chunk;
    });

    res.on("error", function() {
        console.log("error")
    });

    res.on('end', function() {
        console.log(pageData);
        console.log("end");
    });
});