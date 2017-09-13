module.exports = [
  {
    method: 'GET',
    path: '/stylesheet.css',
    handler: function (request, reply) {
      reply.file('public/stylesheet.css');
    }
  },
  {
    method: 'GET',
    path: '/bean.js',
    handler: function (request, reply) {
      reply.file('public/bean.js');
    }
  },
  {
    method: 'GET',
    path: '/bean_message.js',
    handler: function (request, reply) {
      reply.file('public/bean_message.js');
    }
  }
  ,
  {
    method: 'GET',
    path: '/bean_data.js',
    handler: function (request, reply) {
      reply.file('public/bean_data.js');
    }
  }
]
