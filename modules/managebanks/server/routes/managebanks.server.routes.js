'use strict';

/**
 * Module dependencies
 */
var managebanksPolicy = require('../policies/managebanks.server.policy'),
  managebanks = require('../controllers/managebanks.server.controller');

module.exports = function(app) {
  // Managebanks Routes
  app.route('/api/managebanks').all(managebanksPolicy.isAllowed)
    .get(managebanks.list)
    .post(managebanks.create);

  app.route('/api/managebanks/:managebankId').all(managebanksPolicy.isAllowed)
    .get(managebanks.read)
    .put(managebanks.update)
    .delete(managebanks.delete);

  // Finish by binding the Managebank middleware
  app.param('managebankId', managebanks.managebankByID);
};
