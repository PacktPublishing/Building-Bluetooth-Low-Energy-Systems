var nodes_handler = function (request, reply) {
  var http = require('http');

  var options = {
    host: 'localhost',
    port: 8001,
    path: '/gap/nodes',
    method: 'GET'
  };

  return http.get(options, function(response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
      //console.log("BODY: ", body)
      
      var parsed = JSON.parse(body);

      reply.view('nodes/index', {
          title: 'Nodes',
          nodes: parsed
      });
    });
  });
};

var node_handler = function (request, reply) {
  var http = require('http');
  var node_uuid = request.params.node_id;

  var options = {
    host: 'localhost',
    port: 8001,
    path: '/gatt/nodes/' + node_uuid + '/services',
    method: 'GET'
  };

  return http.get(options, function(response) {
    // Continuously update stream with data
    console.log ("get url"+ options.path);
    //console.log("response:  " + response + "\n");
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
      // Data reception is done, do whatever with it!
      var parsed = JSON.parse(body);
      console.log ("response" + body);
      reply.view('nodes/show', {
          title: node_uuid + ' Services',
          device: node_uuid,
          services: parsed
      });
    });
  });
};

module.exports = [
  { method: 'GET', path: '/', handler: nodes_handler },
  { method: 'GET', path: '/nodes', handler: nodes_handler },
  { method: 'GET', path: '/nodes/{node_id}', handler: node_handler }
]
