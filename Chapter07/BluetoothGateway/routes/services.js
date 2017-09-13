module.exports = [
  {
    method: 'GET',
    path:'/gatt/nodes/{node_id}/services',
    handler: function (request, reply) {
      var services_json = [];
      var node_uuid = request.params.node_id;

      request.server.app.peripherals.map(function(peripheralString) {
        peripheral = JSON.parse(peripheralString);
        if (peripheral.address === node_uuid) {
          var services = request.server.app.services[peripheral.address]

          if (services && services.length) {
            for (var i in services) {
              var service = services[i];

              var service_json = {
                "self" : { "href" : "http://" + request.headers.host + "/gatt/nodes/" + peripheral.address + "/services/" + service.uuid },
                "handle"  : service.handle,
                "uuid"      : service.uuid,
                "primary" :  true
              }

              services_json.push(service_json);
            }
          }
        }
      });
      reply({"services" : services_json});
    }
  }
]
