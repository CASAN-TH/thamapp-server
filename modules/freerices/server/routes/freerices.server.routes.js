'use strict';

/**
 * Module dependencies
 */
var freericesPolicy = require('../policies/freerices.server.policy'),
  freerices = require('../controllers/freerices.server.controller');

module.exports = function(app) {
  // Freerices Routes
  app.route('/api/freerices').all(freericesPolicy.isAllowed)
    .get(freerices.list)
    .post(freerices.create);

  app.route('/api/freerices/:freericeId').all(freericesPolicy.isAllowed)
    .get(freerices.read)
    .put(freerices.update)
    .delete(freerices.delete);

  // Finish by binding the Freerice middleware
  app.param('freericeId', freerices.freericeByID);
};
