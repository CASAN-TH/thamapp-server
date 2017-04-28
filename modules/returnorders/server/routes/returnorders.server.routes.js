'use strict';

/**
 * Module dependencies
 */
var returnordersPolicy = require('../policies/returnorders.server.policy'),
  returnorders = require('../controllers/returnorders.server.controller');
var users = require('../../../users/server/controllers/users.server.controller');


module.exports = function (app) {
  // Returnorders Routes
  app.route('/api/returnorders')//.all(returnordersPolicy.isAllowed)
    .get(returnordersPolicy.isAllowed, returnorders.list)
    .post(users.requiresLoginToken, returnordersPolicy.isAllowed, returnorders.create);

  app.route('/api/returnorders/:returnorderId')//.all(returnordersPolicy.isAllowed)
    .get(returnorders.read)
    .put(users.requiresLoginToken, returnordersPolicy.isAllowed, returnorders.update)
    .delete(users.requiresLoginToken, returnordersPolicy.isAllowed, returnorders.delete);

  app.route('/api/reportreturnorder/:startdate/:enddate')
    .get(returnorders.reportreturnorderCooking,
    returnorders.reportreturnorder);

  // Finish by binding the Returnorder middleware
  app.param('returnorderId', returnorders.returnorderByID);
};
