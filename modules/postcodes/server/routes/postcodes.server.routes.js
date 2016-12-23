'use strict';

/**
 * Module dependencies
 */
var postcodesPolicy = require('../policies/postcodes.server.policy'),
  postcodes = require('../controllers/postcodes.server.controller');

module.exports = function(app) {
  // Postcodes Routes
  app.route('/api/postcodes').all(postcodesPolicy.isAllowed)
    .get(postcodes.list)
    .post(postcodes.create);

  app.route('/api/postcodes/:postcodeId').all(postcodesPolicy.isAllowed)
    .get(postcodes.read)
    .put(postcodes.update)
    .delete(postcodes.delete);

  // Finish by binding the Postcode middleware
  app.param('postcodeId', postcodes.postcodeByID);
};