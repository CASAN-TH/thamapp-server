'use strict';

/**
 * Module dependencies
 */
var marketplansPolicy = require('../policies/marketplans.server.policy'),
  marketplans = require('../controllers/marketplans.server.controller');

module.exports = function(app) {
  // Marketplans Routes
  app.route('/api/marketplans').all(marketplansPolicy.isAllowed)
    .get(marketplans.list)
    .post(marketplans.create);

  app.route('/api/marketplans/:marketplanId').all(marketplansPolicy.isAllowed)
    .get(marketplans.read)
    .put(marketplans.update)
    .delete(marketplans.delete);

  // Finish by binding the Marketplan middleware
  app.param('marketplanId', marketplans.marketplanByID);
};
