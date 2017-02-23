'use strict';

/**
 * Module dependencies
 */
var managebanksPolicy = require('../policies/managebanks.server.policy'),
  managebanks = require('../controllers/managebanks.server.controller');
var users = require('../../../users/server/controllers/users.server.controller');


module.exports = function (app) {
  // Managebanks Routes
  app.route('/api/managebanks')//.all(managebanksPolicy.isAllowed)
    .get(managebanksPolicy.isAllowed, managebanks.list)
    .post(users.requiresLoginToken, managebanksPolicy.isAllowed, managebanks.create);

  app.route('/api/managebanks/:managebankId')//.all(managebanksPolicy.isAllowed)
    .get(managebanksPolicy.isAllowed, managebanks.read)
    .put(users.requiresLoginToken, managebanksPolicy.isAllowed, managebanks.update)
    .delete(users.requiresLoginToken, managebanksPolicy.isAllowed, managebanks.delete);

  // Finish by binding the Managebank middleware
  app.param('managebankId', managebanks.managebankByID);
};
