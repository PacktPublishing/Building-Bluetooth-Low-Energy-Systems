module.exports = [
  {
    method: 'GET',
    path:'/gap/nodes',
    handler: function (request, reply) {
      var reply_json = request.server.app.peripherals.map(function(peripheralString) {
        peripheral = JSON.parse(peripheralString);
        console.log(peripheral)
        return {
          "self" : { "href" : "http://" + request.headers.host + "/gap/nodes/" + peripheral.address },
          "handle"    :  peripheral.id,
          "advertisement" : peripheral.advertisement,
          "bdaddrs": [
            {
              "bdaddr" : peripheral.address,
              "bdaddrType" : peripheral.addressType
            },
          ],
          "service": request.server.app.services[peripheral.address],
          "rssi" : peripheral.rssi,
          "AD"          : [
            {
              "ADType" : "<type1>",
              "ADValue" : " <value1>"
            }
          ]
        };
      });

      reply({"nodes" : reply_json});
    }
  }
]
