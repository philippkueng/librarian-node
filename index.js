"use strict";

var Hapi = require('hapi');
var Promise = require('bluebird');

// Loading local dependencies.
var config = require('./config');
var database = require('./lib/database');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection(config.system);

// Logging
var loggingOptions = {
    opsInterval: 1000,
    reporters: [{
      reporter: require('good-console'),
      args: [{log: '*', response: '*', request: '*', error: '*'}]
    }]
  };

server.register({
  register: require('good'),
  options: loggingOptions
}, function (err) {
  if (err) {
    console.error(err);
  }
});

// Database
var databasePlugin = {
  register: require('hapi-node-postgres'),
  options: {
    connectionString: config.postgres,
    native: false
  }
};
server.register(databasePlugin, function (err) {
  if (err) {
    console.log("Failed to load the hapi-node-postgres plugin");
  }
});

server.register([require('bell'), require('hapi-auth-cookie')], function (err) {
  if (err) {
    throw err;
  }

  server.auth.strategy('google', 'bell', config.google);
  server.auth.strategy('session', 'cookie', {
    password: config.cookiePassword,
    cookie: 'sid-librarian',
    redirectTo: '/authentication/google',
    isSecure: false
  });
  server.route([{
    method: ['GET', 'POST'], // Must handle both GET and POST
    path: '/authentication/google',          // The callback endpoint registered with the provider
    config: {
      auth: {
        strategy: 'google',
        mode: 'try'
      },
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      },
      handler: function (request, reply) {
        var authenticateAndRedirect = function (data) {
          return new Promise(function (resolve) {
            console.log(data.user);
            data.request.auth.session.set(data.user);
            data.reply.redirect('/authenticated');
            resolve();
          });
        };

        database
        .getUserByGoogleEmail({request: request, reply: reply})
        .then(
          authenticateAndRedirect,
          database.insertUserFromGoogle
            .then(authenticateAndRedirect));


        // Perform any account lookup or registration, setup local session,
        // and redirect to the application. The third-party credentials are
        // stored in request.auth.credentials. Any query parameters from
        // the initial request are passed back via request.auth.credentials.query.
      }
    }
  }, {
    method: ['GET'],
    path: '/authenticated',
    config: {
      auth: 'session',
      handler: function (request, reply) {
        console.log(request.auth.credentials);
        reply('hi there');
      }
    }
  }, {
    method: ['GET'],
    path: '/logout',
    config: {
      auth: 'session',
      handler: function (request, reply) {
        request.auth.session.clear();
        return reply.redirect('/');
      }
    }
  }]);
});

// Add the routes
server.route([{
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'static'
    }
  }
}, {
  method: 'GET',
  path: '/hello',
  handler: function (request, reply) {
    var foobar = {
      name: "foobar2",
      age: 11
    };
    request.pg.client.query("INSERT INTO clients (data) VALUES ($1)", [foobar], function (err, result) {
      if (err) {
        console.error(err);
      }
      console.log(result);
    });
    reply('hello world');
  }
}, {
  method: 'GET',
  path: '/foobar',
  handler: function (request, reply) {
    request.pg.client.query("SELECT data FROM clients WHERE data @> '{\"age\": 11}'", function (err, result) {
      if (err) {
        console.error(err);
      }
      console.log(result.rows);
    });
    reply('foobar');
  }
}, {
  method: 'GET',
  path: '/postgres',
  handler: function (request, reply) {
    database.getUserByGoogleEmail(request.pg.client, "philipp.kueng@gmail.com", function (err, result) {
      if (err) {
        throw err;
      }
      console.log(result);
      reply("the answer");
    });
  }
}, {
  method: 'GET',
  path: '/search',
  handler: function (request, reply) {
    reply({result: [{
      name: "Link 1",
      url: "http://example.com/1"
    }, {
      name: "Link 2",
      url: "http://example.com/2"
    }]})
  }
}]);

// Start the server
server.start(function () {
  console.log('Server started at [' + server.info.uri + ']');
});
