var nodes = require('./nodes');
var services = require('./services');
var assets = require('./assets');
var characteristics = require('./characteristics');

module.exports = [].concat(nodes, assets, services, characteristics);
