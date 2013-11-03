Stem.js its a command line interface tool, written in node.js to dynamically create/define/clone templates of other node.js servers. This means that you configure several templates applyting configuration files to them, and you can generate a nodejs server file which is launched with Forever!

## Installation 

Just clone this git repo, I recommend youto add a simbolic link to the stem main program, to be in the PATH so you can execute it anywhere on your machine.

```ruby
luis@boxita:~/git/stem.js$ ls -la /usr/local/bin/stem 
lrwxrwxrwx 1 root root 27 abr  4 15:27 /usr/local/bin/stem -> /home/luis/git/stem.js/stem
```
Also you require the following node.js packages (installed from NPM), including node.js itself which is not covered on this wiki.

```ruby
npm install sqlite3 commander colors
npm install -g forever
```

## Current commands implemented
```ruby
luis@boxita:~/git/stem.js$ stem -h
  Usage: stem [options]
  Options:
    -h, --help                          output usage information
    -V, --version                       output the version number
    list                                Get the list of all registered servers.
    create [server] [core_template]     Create [server] with [core_template].
    destroy [server]                    Destroy [server] with specified name.
    add [server] [template]             Add the [template] to the existing [server].
    remove [server] [template]          Given a [template] ID (int) remove it from the [server].
    describe [server]                   Show the details of a particular [server].
    stop [server]                       Stop an active running server.
    start [server]                      Start a server.
    setconf [conf_id] [value]           Given a [config] ID (int) of a conf, change the its value.
    applyconf [server] [conf_file]      Apply a [configuration] file to a [server].
    compile [server]                    Generate the physical NODEJS file as stem_<id>.js
    clone [source_server] [new_server]  Tool to fully clone a server including templates and configs.
```

## HOW IT (SHOULD) WORKS

A simple workflow should be:

1. add a server (stem create).
2. add X additionally templates to that server (stem add).
3. apply a configuration file (stem applyconf) and/or change individual configuration params (stem setconf).
4. compile the server to generate the .js file (stem compile).
5. start/stop the server (stem start, stem stop).

## AN EXAMPLE

Lets suppose you have the following 3 templates.

1. templates/server_http.js, which contains the main server listeners, not all <! !> are the params that will be replaced later.

```ruby
// Load the http module to create an http server.
var http = require('http');
// Configure our HTTP server to respond with a message to all requests.
var server = http.createServer(<!CONNECTION_LISTENER!>);
// Listen on port <!CONF_PORT!> on localhost
server.listen(<!CONF_PORT!>, "localhost");
console.log("Server running at http://localhost:<!CONF_PORT!>/");
```

2. templates/action_helloworld.js, which is the action that will be emmbedded inside the server template
```ruby
function connection_listener(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("<!MESSAGE!>\n");
}
```
3. config/basic.json which is the json file that contains the configuration params that will be replaced into the server templates
```ruby
{
	"CONF_FILENAME": "counter.txt",
	"CONNECTION_LISTENER": "connection_listener",
	"CONF_PORT": 8080,
	"MESSAGE": "Hola mundito!"
}
```

So in order to use Stem, you first create the server name "tango", and check it was created with the command list.
```ruby
luis@boxita:~/git/stem.js$ stem create tango templates/server_http.js 
Added server <tango> with id <1>
Added template <templates/server_http.js> to server <1>
Found 4 parameters in the template: 
- CONNECTION_LISTENER
- CONF_PORT
- CONF_PORT
- CONF_PORT

luis@boxita:~/git/stem.js$ stem list
List of SERVERS:
ID	STATE	NAME
1	STOPPED	tang
```

You can check the structure of any "server template" with the command "describe".
```ruby
luis@boxita:~/git/stem.js$ stem describe tango
STRUCTURE
1---- tango is STOPPED
    |
    1---- templates/server_http.js
        |
        1---- CONNECTION_LISTENER = UNDEFINED
        |
        2---- CONF_PORT = UNDEFINED

```

Now you should add the second template, which is the action inside that will be replaced inside the listener of the server:
```ruby
luis@boxita:~/git/stem.js$ stem add tango templates/action_helloworld.js 
Added template <templates/action_helloworld.js> to server <1>
Found 1 parameters in the template: 
- MESSAGE

luis@boxita:~/git/stem.js$ stem describe tango
STRUCTURE
1---- tango is STOPPED
    |
    1---- templates/server_http.js
    |   |
    |   1---- CONNECTION_LISTENER = UNDEFINED
    |   |
    |   2---- CONF_PORT = UNDEFINED
    |
    2---- templates/action_helloworld.js
        |
        3---- MESSAGE = UNDEFINED
```

As you probably noticed, there are some UNDEFINED fields, which should change either with applyconf (which will change all the confs from the json file, or setconf which allow you to change a single and particular param.
```ruby
luis@boxita:~/git/stem.js$ stem applyconf tango config/basic.json 
Configuration applied! Total changed items: 3

luis@boxita:~/git/stem.js$ stem describe tango

STRUCTURE
1---- tango is STOPPED
    |
    1---- templates/server_http.js
    |   |
    |   1---- CONNECTION_LISTENER = connection_listener
    |   |
    |   2---- CONF_PORT = 8080
    |
    2---- templates/action_helloworld.js
        |
        3---- MESSAGE = Hola mundito!
```



Now that you have all the params set, you should "compile" the server template, which will generate a local file named "server_XXX.js" where XXX is the ID of the server:
```ruby
luis@boxita:~/git/stem.js$ stem compile tango
Server created on file server_1.js


luis@boxita:~/git/stem.js$ cat server_1.js 

/***** FROM TEMPLATE templates/action_helloworld.js******/

function connection_listener(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hola mundito!\n");
}


/***** FROM TEMPLATE templates/server_http.js******/
// Load the http module to create an http server.
var http = require('http');

// Configure our HTTP server to respond with a message to all requests.
var server = http.createServer(connection_listener);

// Listen on port 8080 on localhost
server.listen(8080, "localhost");

console.log("Server running at http://localhost:8080/");
```

And now you can start your new server and if it works (with curl in this case).
```ruby
luis@boxita:~/git/stem.js$ stem start tango
info:    Forever processing file: server_1.js
Server started succesfully

luis@boxita:~/git/stem.js$ curl localhost:8080
Hola mundito!
```

You can also make other insteresting operations like clone a server, and start it into another port.
```ruby
luis@boxita:~/git/stem.js$ stem clone tango romeo
luis@boxita:~/git/stem.js$ stem describe romeo
STRUCTURE
2---- romeo is STOPPED
    |
    3---- templates/server_http.js
    |   |
    |   4---- CONNECTION_LISTENER = connection_listener
    |   |
    |   5---- CONF_PORT = 8080
    |
    4---- templates/action_helloworld.js
        |
        6---- MESSAGE = Hola mundito!
luis@boxita:~/git/stem.js$ stem setconf 5 8888
luis@boxita:~/git/stem.js$ stem start romeo
```