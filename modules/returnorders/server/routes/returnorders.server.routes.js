'use strict';

/**
 * Module dependencies
 */
var returnordersPolicy = require('../policies/returnorders.server.policy'),
  returnorders = require('../controllers/returnorders.server.controller');

module.exports = function(app) {
  // Returnorders Routes
  app.route('/api/returnorders').all(returnordersPolicy.isAllowed)
    .get(returnorders.list)
    .post(returnorders.create);

  app.route('/api/returnorders/:returnorderId').all(returnordersPolicy.isAllowed)
    .get(returnorders.read)
    .put(returnorders.update)
    .delete(returnorders.delete);

  // Finish by binding the Returnorder middleware
  app.param('returnorderId', returnorders.returnorderByID);
};
