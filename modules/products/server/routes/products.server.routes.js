'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');
var users = require('../../../users/server/controllers/users.server.controller');

module.exports = function (app) {
  // Products Routes
  app.route('/api/products')//.all(productsPolicy.isAllowed)
    .get(productsPolicy.isAllowed, products.list)
    .post(users.requiresLoginToken, productsPolicy.isAllowed, products.create);

  app.route('/api/products/:productId')//.all(productsPolicy.isAllowed)
    .get(productsPolicy.isAllowed, products.read)
    .put(users.requiresLoginToken, productsPolicy.isAllowed, products.update)
    .delete(users.requiresLoginToken, productsPolicy.isAllowed, products.delete);

  app.route('/api/products_picture').post(products.changeProductPicture);

  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
};
