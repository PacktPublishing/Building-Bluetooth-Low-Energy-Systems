function GatewayClient() {
  var http = require('http');

  var valuesPath = '/gatt/nodes/4ab08b9dd6884357aaecf4c3983fd420/services/a495ff10c5b14b44b5121370f02d74de/characteristics/a495ff11c5b14b44b5121370f02d74de/value/';

  this.writeValue = function(hexData) {
    var options = {
      host:    'localhost',
      port:    8000,
      path:    valuesPath + hexData,
      method : 'PUT'
    };

    var req = http.request(options, logResponses).end();
  };

  function logResponses(res) {
    res.on('data', function(data) {
      console.log(data.toString('utf-8'));
    });
  }
}

module.exports = GatewayClient;
