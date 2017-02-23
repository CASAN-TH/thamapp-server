'use strict';

/**
 * Module dependencies
 */
var requestordersPolicy = require('../policies/requestorders.server.policy'),
  requestorders = require('../controllers/requestorders.server.controller');
var users = require('../../../users/server/controllers/users.server.controller');


module.exports = function (app) {
  // Requestorders Routes
  app.route('/api/requestorders')//.all(requestordersPolicy.isAllowed)
    .get(requestordersPolicy.isAllowed, requestorders.list)
    .post(users.requiresLoginToken, requestordersPolicy.isAllowed, requestorders.create);

  app.route('/api/requestorders/:requestorderId')//.all(requestordersPolicy.isAllowed)
    .get(requestorders.read)
    .put(users.requiresLoginToken, requestordersPolicy.isAllowed, requestorders.update)
    .delete(users.requiresLoginToken, requestordersPolicy.isAllowed, requestorders.delete);

  // Finish by binding the Requestorder middleware
  app.param('requestorderId', requestorders.requestorderByID);
};
