"use strict";

var noble = require('noble');

var Hapi = require('hapi');

var routes = require('./routes');

var async =require('async');

var chat = {
    "#channel": {
        open: true,
        'say-"hello"': function (msg) {}
    }
};



var host = 'localhost:8001';





var server = new Hapi.Server();

server.connection({
  port: 8001
});

server.route(routes);

server.app.peripherals = [];
server.app.services = [];
server.app.characteristics = [];
server.app.characteristic_values = [];
server.app._characteristics = {};
server.app.descriptors = [];

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning()
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  console.log("found a node: ", peripheral.address);

  server.app.peripherals.push(peripheral);
  server.app.characteristics[peripheral.address] = {};
  server.app.characteristic_values[peripheral.address] = {};
  server.app._characteristics[peripheral.address] = {};
  server.app.services[peripheral.address] = [];
  server.app.descriptors[peripheral.address] = {};
})

noble.on('scanStart', function() {
  console.log('on -> scanStart');
  setTimeout(function() {
    noble.stopScanning();
  }, 10 * 1000);
})

noble.on('scanStop', function() {         
  console.log('on -> scanStop');
  mapPeripherals();
});

function mapPeripherals() {
  server.app.peripherals.map(function(peripheral){
    peripheral.connect(function(error) {
      if (error){
        console.log(error);
      }
      async.waterfall([
          function(callback){
            // Get services
            peripheral.discoverServices([],function discoverSvcCB(error, services){
              services.forEach(function(service){
                  server.app.services[peripheral.address].push({
                    "uuid": service.uuid,
                    "handle": service.name 
                  })
                  server.app.characteristics[peripheral.address][service.uuid] = [];
                  server.app.characteristic_values[peripheral.address][service.uuid] = {};
                  server.app._characteristics[peripheral.address][service.uuid] = {};
                  server.app.descriptors[peripheral.address][service.uuid] = {};
                });
                callback (error, services);   
            })
          },
          
          function discoverChars(services,callback){
            //Get chars
          
            services.forEach(function(service){
              service.discoverCharacteristics([],function discoverCharCB(error, characteristics){
                
                characteristics.forEach(function(characteristic){
                  console.log(' save char:  '+ characteristic.uuid);
                  
                  server.app.descriptors[peripheral.address][service.uuid][characteristic.uuid] = [];
                  
                  server.app._characteristics[peripheral.address][characteristic._serviceUuid][characteristic.uuid] = characteristic;
              
                  server.app.characteristics[peripheral.address][characteristic._serviceUuid].push({
                    "self" : {
                        "href" : "http://" + host + "/gatt/nodes/" + peripheral.address + "/characteristics/" + characteristic.uuid
                    },
                    "handle"     : characteristic.name,
                    "uuid"       : characteristic.uuid,
                    "properties" : characteristic.properties
                  });
				  characteristic.discoverDescriptors(function(error, descriptors){
                    descriptors.forEach(function(descriptor){
					     
                      server.app.descriptors[peripheral.address][service.uuid][characteristic.uuid] = descriptor;
                      console.log(server.app.descriptors[peripheral.address][service.uuid]);
                    })
				  });
                });
              });
            })
          },
       
      ],function(error){
        //close connection
        peripheral.disconnect(function(error){
          console.log('Disconnect called');
        });
      }) 
    });  
  })
}


/** @description Start server.
 */
server.start();
