'use strict';

/**
 * Module dependencies
 */
var promotionsPolicy = require('../policies/promotions.server.policy'),
  promotions = require('../controllers/promotions.server.controller');

module.exports = function (app) {
  // Promotions Routes
  app.route('/api/promotions').all(promotionsPolicy.isAllowed)
    .get(promotions.list)
    .post(promotions.create);

  app.route('/api/promotions/:promotionId').all(promotionsPolicy.isAllowed)
    .get(promotions.read)
    .put(promotions.update)
    .delete(promotions.delete);

  // app.route('/api/promotions/productid/:_id')
  //   .get(promotions.readProductById);

  // Finish by binding the Promotion middleware
  app.param('promotionId', promotions.promotionByID);
  // app.param('_id', promotions.promotionByProductID);
};
