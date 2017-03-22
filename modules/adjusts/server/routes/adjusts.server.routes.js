'use strict';

/**
 * Module dependencies
 */
var adjustsPolicy = require('../policies/adjusts.server.policy'),
  adjusts = require('../controllers/adjusts.server.controller');

module.exports = function(app) {
  // Adjusts Routes
  app.route('/api/adjusts').all(adjustsPolicy.isAllowed)
    .get(adjusts.list)
    .post(adjusts.create);

  app.route('/api/adjusts/:adjustId').all(adjustsPolicy.isAllowed)
    .get(adjusts.read)
    .put(adjusts.update)
    .delete(adjusts.delete);

  // Finish by binding the Adjust middleware
  app.param('adjustId', adjusts.adjustByID);
};
