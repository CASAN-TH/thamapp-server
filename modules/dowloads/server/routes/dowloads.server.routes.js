'use strict';

/**
 * Module dependencies
 */
var dowloadsPolicy = require('../policies/dowloads.server.policy'),
  dowloads = require('../controllers/dowloads.server.controller');

module.exports = function(app) {
  // Dowloads Routes
  app.route('/api/dowloads').all(dowloadsPolicy.isAllowed)
    .get(dowloads.list)
    .post(dowloads.create);

  app.route('/api/dowloads/:dowloadId').all(dowloadsPolicy.isAllowed)
    .get(dowloads.read)
    .put(dowloads.update)
    .delete(dowloads.delete);

  // Finish by binding the Dowload middleware
  app.param('dowloadId', dowloads.dowloadByID);
};
