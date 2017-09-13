
var Path = require('path');
var Hapi = require('hapi');

var routes = require('./routes');

var server = new Hapi.Server();


server.connection({
    port: 8000
});

server.register([require('vision'), require('inert')], function (err) {

  if (err) {
    throw err;
  }

  server.views({
      engines: { html: require('handlebars') },
      path: __dirname + '/templates',
      layout: true
  });
  server.route(routes)
});

// Start the server
server.start(function() {
   console.log('Server running at:', server.info.uri);
});
