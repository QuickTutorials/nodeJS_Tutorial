function connection_listener(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("<!MESSAGE!>\n");
}
