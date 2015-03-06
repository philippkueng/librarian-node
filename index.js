var Hapi = require('hapi');

// Loading local dependencies.
var config = require('./config');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection(config.system);

server.register(require('bell'), function (err) {

  server.auth.strategy('google', 'bell', config.google);
  server.route({
    method: ['GET', 'POST'], // Must handle both GET and POST
    path: '/authentication/google',          // The callback endpoint registered with the provider
    config: {
      auth: {
        strategy: 'google',
        mode: 'try'
      },
      handler: function (request, reply) {
        console.log(request.auth.credentials);

        // Perform any account lookup or registration, setup local session,
        // and redirect to the application. The third-party credentials are
        // stored in request.auth.credentials. Any query parameters from
        // the initial request are passed back via request.auth.credentials.query.
        return reply.redirect('/hello');
      }
    }
  });

});

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
