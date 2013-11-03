// Load the http module to create an http server.
var http = require('http');
// Configure our HTTP server to respond with a message to all requests.
var server = http.createServer(<!CONNECTION_LISTENER!>);
// Listen on port <!CONF_PORT!> on localhost
server.listen(<!CONF_PORT!>, "localhost");
console.log("Server running at http://localhost:<!CONF_PORT!>/");