'use strict';

/**
 * Module dependencies
 */
var postcodesPolicy = require('../policies/postcodes.server.policy'),
  postcodes = require('../controllers/postcodes.server.controller');
var users = require('../../../users/server/controllers/users.server.controller');


module.exports = function (app) {
  // Postcodes Routes
  app.route('/api/postcodes')//.all(postcodesPolicy.isAllowed)
    .get(postcodesPolicy.isAllowed, postcodes.list)
    .post(users.requiresLoginToken, postcodesPolicy.isAllowed, postcodes.create);

  app.route('/api/postcodes/:postcodeId')//.all(postcodesPolicy.isAllowed)
    .get(postcodesPolicy.isAllowed, postcodes.read)
    .put(users.requiresLoginToken, postcodesPolicy.isAllowed, postcodes.update)
    .delete(users.requiresLoginToken, postcodesPolicy.isAllowed, postcodes.delete);
  app.route('/api/getpostcodes/:postcode')//.all(postcodesPolicy.isAllowed)
    .get(postcodesPolicy.isAllowed, postcodes.getpostcodes)
  // Finish by binding the Postcode middleware
  app.param('postcodeId', postcodes.postcodeByID);
  app.param('postcode', postcodes.postcodeFilter);
};