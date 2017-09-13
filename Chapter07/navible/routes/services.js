var service_handler = function (request, reply) {
  var http = require('http');
  var node_uuid = request.params.node_id;
  var service_uuid = request.params.service_id;

  var options = {
    host: 'localhost',
    port: 8001,
    path: '/gatt/nodes/' + node_uuid + '/services/' + service_uuid + '/characteristics',
    method: 'GET'
  };

  return http.get(options, function(response) {
    // Continuously update stream with data
    var body = '';
    
    response.on('data', function(d) {
        body += d;
    
    });
    
    
    response.on('end', function() {
      // Data reception is done, do whatever with it!
      
      var parsed = JSON.parse(body);
     

      reply.view('services/show', {
          title: 'Service Characteristics',
          device: node_uuid,
          service: service_uuid,
          characteristics: parsed //VG: check json.parse  "characteristics"
      });
    });
  });
};

module.exports = [
  { method: 'GET', path: '/nodes/{node_id}/services/{service_id}', handler: service_handler }
]
