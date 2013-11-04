function connection_listener(request, response) {
  var fs = require("fs");
  if (request.url == '/') {
      // Read the file.
    fs.readFile("<!CONF_FILENAME!>", 'utf-8', function (error, data) {
      // Write headers.
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      console.log("read: ",data);
      if(isNaN(data)){
        data = 1;
      }
      else {
        // Increment the number obtained from file.
        data = parseInt(data) + 1;
      }
      // Write incremented number to file.
      fs.writeFile('<!CONF_FILENAME!>', data);
      // End response with some nice message.
      response.end('This page was refreshed ' + data + ' times!');
    });
  } 
  else {
    // Indicate that requested file was not found.
    response.writeHead(404);
    // And end request without sending any data.
    response.end();
  }
}