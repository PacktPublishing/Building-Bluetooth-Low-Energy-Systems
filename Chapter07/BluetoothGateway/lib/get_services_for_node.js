
var noble = require('noble');

// function get_services_for_node(nodeUuid) {
  console.log(nodeUuid)
  noble.on('stateChange', function(state) {
    console.log('State')
    console.log(state)
    if (state === 'poweredOn') {
      //
      // Once the BLE radio has been powered on, it is possible
      // to begin scanning for services. Pass an empty array to
      // scan for all services (uses more time and power).
      //
      console.log('scanning...');
      noble.startScanning([], false);
    }
    else {
      console.log('not scanning...');
      noble.stopScanning();
    }
  })

  var nodeService = null;

  noble.on('discover', function(peripheral) {
    // we found a peripheral, stop scanning
    noble.stopScanning();

    //
    // The advertisment data contains a name, power level (if available),
    // certain advertised service uuids, as well as manufacturer data,
    // which could be formatted as an iBeacon.
    //
    console.log('-------- peripheral uuid:', peripheral.uuid);
    console.log('found peripheral:', peripheral.advertisement);
    //
    // Once the peripheral has been discovered, then connect to it.
    // It can also be constructed if the uuid is already known.
    ///
    peripheral.connect(function(err) {
      //
      // Once the peripheral has been connected, then discover the
      // services and characteristics of interest.
      //
      peripheral.discoverServices([], function(err, services) {
        services.forEach(function(service) {
          //
          // This must be the service we were looking for.
          //
          console.log('found service:', service.uuid);

        })
      })
    })
  })
// }
