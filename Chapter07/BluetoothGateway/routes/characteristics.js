module.exports = [
  {
    method: 'GET',
    path:'/gatt/nodes/{node_id}/services/{service_id}/characteristics',
    handler: function (request, reply) {
      var node_uuid = request.params.node_id
      var service_uuid = request.params.service_id
      
      reply(request.server.app.characteristics[node_uuid][service_uuid]);
    }
  }
]
