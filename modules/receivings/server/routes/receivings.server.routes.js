'use strict';

/**
 * Module dependencies
 */
var receivingsPolicy = require('../policies/receivings.server.policy'),
  receivings = require('../controllers/receivings.server.controller');

module.exports = function(app) {
  // Receivings Routes
  app.route('/api/receivings').all(receivingsPolicy.isAllowed)
    .get(receivings.list)
    .post(receivings.create);

  app.route('/api/receivings/:receivingId').all(receivingsPolicy.isAllowed)
    .get(receivings.read)
    .put(receivings.update)
    .delete(receivings.delete);

  // Finish by binding the Receiving middleware
  app.param('receivingId', receivings.receivingByID);
};
