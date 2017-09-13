/* global Buffer */
var BeanMessage = require('../lib/bean_message');
var messageBuilder = new BeanMessage();
var async = require('async');
var BeanData = require('../lib/bean_data');

module.exports = [
  {
    method: 'GET',
    path:'/gatt/nodes/{node_id}/services/{service_id}/characteristics/{characteristic_id}/value',
    handler: function (request, reply) {
      var node_uuid = request.params.node_id;
      var service_uuid = request.params.service_id;
      var characteristic_uuid = request.params.characteristic_id;
      var async = require('async');
      var peripheral;
      var characteristics_json = [];
      var host = request.server.app.host;

      if(request.server.app.cached_value) {
        reply(request.server.app.cached_value)
      } else {
        request.server.app.peripherals.forEach(function(node){
          if(node.address === node_uuid) {
            peripheral = node
          }
        })
        peripheral.connect(function(error) { 
          console.log('connected \n');
          if(error) {
            reply(new Error(error))
            
          } else {
            peripheral.discoverSomeServicesAndCharacteristics(
              [service_uuid],
              [characteristic_uuid],
              function(error, services, characteristics) {
                if(error){
                  reply(new Error(error));
                  peripheral.disconnect(function(error){
                      });
                } else {
                  var characteristic = characteristics[0]
                  characteristic.read(function(error, data) {
                    if(error) {
                      reply(new Error(error));
                      peripheral.disconnect(function(error){
                       
                      });
                    }
                    else {
                      reply(
                        {
                          "self" : {
                            "href" : "http://" + host + "/gatt/nodes/" + peripheral.address + "/characteristics/" + characteristic.uuid
                            },
                          "handle" : characteristic.name,
                          "value"  : data
                        }
                      )
                      peripheral.disconnect(function(error){
                        
                      });
                    }
                  })
                }
              }
            );
          }
        })
      }
    }
  },
  {
    method: 'PUT',
    path:'/gatt/nodes/{node_id}/services/{service_id}/characteristics/{characteristic_id}/value/{value}',
    handler: function (request, reply) {
      var node_uuid = request.params.node_id;
      var service_uuid = request.params.service_id;
      var characteristic_uuid = request.params.characteristic_id;
      var host = request.server.app.host;
      
      console.log(typeof request.params.value)
      console.log('request value: '+request.params.value);
      console.log('\n'); //this is correct!
      //var value = new Buffer(request.params.value, 'hex');
      var value =new Buffer (1);
      value.writeUInt8(parseInt(request.params.value,10),0);
      var peripheral;

      request.server.app.peripherals.forEach(function(node){
        if(node.address === node_uuid) {
          peripheral = node
        }
      })

      peripheral.connect(function(error) {
        if(error) {
          console.log("PROBLEM WRITING", error);
        }
        peripheral.discoverSomeServicesAndCharacteristics(
          [service_uuid],
          [characteristic_uuid],
          function(error, services, characteristics) {
            if(error){
              reply(new Error(error));
              console.log(error);
              peripheral.disconnect();
            } else {
              var characteristic = characteristics[0]

      //        characteristic.on('read', function(data, isNotification) {
        //        request.server.app.cached_value =
          //        {
            //        "self" : {
              //        "href" : "http://" + host + "/gatt/nodes/" + peripheral.address + "/characteristics/" + characteristic.uuid
                //      },
            //        "handle" : characteristic.name,
             //       "value"  : data
           //       }
          //    });

        //      characteristic.notify(true, function(error) {
          //      if(error) {
            //      console.log(error)
              //  }
            //  })

             
             
                characteristic.write(value, false, function(error) {
                  if(error) {
                    reply(new Error(error));
                    console.log(error);
                    peripheral.disconnect();
                  }
                });
                setTimeout(function(){
                  peripheral.disconnect()
                },300);
                reply("OK");
            
            }
          }
        );
      });
    }
  }
];
