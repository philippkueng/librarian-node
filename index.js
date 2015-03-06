var Hapi = require('hapi');

// Loading local dependencies.
var config = require('./config');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection(config.system);

// Add the route
server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {
       reply('hello world');
    }
});

// Start the server
server.start(function () {
  console.log('Server started at [' + server.info.uri + ']');
});
