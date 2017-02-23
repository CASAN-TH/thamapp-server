'use strict';

/**
 * Module dependencies
 */
var transportsPolicy = require('../policies/transports.server.policy'),
  transports = require('../controllers/transports.server.controller');
var users = require('../../../users/server/controllers/users.server.controller');


module.exports = function (app) {
  // Transports Routes
  app.route('/api/transports')//.all(transportsPolicy.isAllowed)
    .get(transportsPolicy.isAllowed, transports.list)
    .post(users.requiresLoginToken, transportsPolicy.isAllowed, transports.create);

  app.route('/api/transports/:transportId')//.all(transportsPolicy.isAllowed)
    .get(transportsPolicy.isAllowed, transports.read)
    .put(users.requiresLoginToken, transportsPolicy.isAllowed, transports.update)
    .delete(users.requiresLoginToken, transportsPolicy.isAllowed, transports.delete);

  // Finish by binding the Transport middleware
  app.param('transportId', transports.transportByID);
};
