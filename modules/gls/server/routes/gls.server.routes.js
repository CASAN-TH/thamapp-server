'use strict';

/**
 * Module dependencies
 */
var glsPolicy = require('../policies/gls.server.policy'),
  gls = require('../controllers/gls.server.controller');

module.exports = function(app) {
  // Gls Routes
  app.route('/api/gls').all(glsPolicy.isAllowed)
    .get(gls.list)
    .post(gls.create);

  app.route('/api/gls/:glId').all(glsPolicy.isAllowed)
    .get(gls.read)
    .put(gls.update)
    .delete(gls.delete);

  // Finish by binding the Gl middleware
  app.param('glId', gls.glByID);
};
