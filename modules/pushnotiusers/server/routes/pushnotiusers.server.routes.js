'use strict';

/**
 * Module dependencies
 */
var pushnotiusersPolicy = require('../policies/pushnotiusers.server.policy'),
  pushnotiusers = require('../controllers/pushnotiusers.server.controller');
var users = require('../../../users/server/controllers/users.server.controller');


module.exports = function (app) {
  // Pushnotiusers Routes
  app.route('/api/pushnotiusers')//.all(pushnotiusersPolicy.isAllowed)
    .get(pushnotiusers.list)
    .post(users.requiresLoginToken, pushnotiusers.create);

  app.route('/api/pushnotiusers/:pushnotiuserId')//.all(pushnotiusersPolicy.isAllowed)
    .get(pushnotiusers.read)
    .put(users.requiresLoginToken, pushnotiusers.update)
    .delete(users.requiresLoginToken, pushnotiusers.delete);
    
  // Finish by binding the Pushnotiuser middleware
  app.param('pushnotiuserId', pushnotiusers.pushnotiuserByID);
};
