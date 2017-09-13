var handler = function (request, reply) {
  var http = require('http');
  var node_uuid = request.params.node_id;
  var service_uuid = request.params.service_id;
  var characteristic_uuid = request.params.characteristic_id;
  var write_url = '/nodes/' + node_uuid + '/services/' +
                  service_uuid + '/characteristics/' + characteristic_uuid

  var options = {
    host: 'localhost',
    port: 8001,
    path: '/gatt/nodes/' + node_uuid + '/services/' + service_uuid + '/characteristics/' + characteristic_uuid + '/value' ,
    method: 'GET'
  };

  return http.get(options, function(response) {
   
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
      // Data reception is done, do whatever with it!
      var parsed = JSON.parse(body);

      // Let's figure out if this is a bean
      var options = {
        host: 'localhost',
        port: 8001,
        path: '/gap/nodes',
        method: 'GET'
      };

      return http.get(options, function(nodes_response) {
       
        var nodes_body = '';
        nodes_response.on('data', function(d) {
            nodes_body += d;
        });
        var manufacturer = ''
        nodes_response.on('end', function() {
          var nodes_parsed = JSON.parse(nodes_body);
          for (var i in nodes_parsed.nodes) {
            console.log(nodes_parsed.nodes[i]);
            if (nodes_parsed.nodes[i].bdaddrs[0].bdaddr == node_uuid) {
              manufacturer = nodes_parsed.nodes[i].advertisement.localName
            }
          }

          reply.view('characteristics/show', {
            title: 'Characteristic ' + characteristic_uuid,
            device: node_uuid,
            service: service_uuid,
            characteristic: characteristic_uuid,
            value: parsed,
            write_url: write_url,
            manufacturer: manufacturer
            //bean: manufacturer == 'Bean'
          });
        });
      });
    });
  });
};

var postHandler = function (request, reply) {
  var http = require('http');
  var node_uuid = request.params.node_id;
  var service_uuid = request.params.service_id;
  var characteristic_uuid = request.params.characteristic_id;
  var value = request.payload.new_value
  var url = '/nodes/' + node_uuid + '/services/' +
                  service_uuid + '/characteristics/' + characteristic_uuid
  var options = {
    host: 'localhost',
    port: 8001,
    path: '/gatt/nodes/' + node_uuid + '/services/' + service_uuid + '/characteristics/' + characteristic_uuid + '/value/' + value,
    method: 'PUT'
  };

  var req = http.request(options, function(res) {
    res.on('data', function(d) {
      setTimeout(
        function(){
          reply.redirect(url);
        },
        1000
      )
    });
  });

  req.end();

  req.on('error', function(e) {
    console.log(e)
  });
};

module.exports = [
  { method: 'GET', path: '/nodes/{node_id}/services/{service_id}/characteristics/{characteristic_id}', handler: handler },
  { method: 'POST', path: '/nodes/{node_id}/services/{service_id}/characteristics/{characteristic_id}', handler: postHandler }
]
