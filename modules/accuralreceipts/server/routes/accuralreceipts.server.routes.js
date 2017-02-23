'use strict';

/**
 * Module dependencies
 */
var accuralreceiptsPolicy = require('../policies/accuralreceipts.server.policy'),
  accuralreceipts = require('../controllers/accuralreceipts.server.controller');
var users = require('../../../users/server/controllers/users.server.controller');


module.exports = function (app) {
  // Accuralreceipts Routes
  app.route('/api/accuralreceipts')//.all(accuralreceiptsPolicy.isAllowed)
    .get(accuralreceiptsPolicy.isAllowed, accuralreceipts.list)
    .post(users.requiresLoginToken, accuralreceiptsPolicy.isAllowed, accuralreceipts.create);

  app.route('/api/accuralreceipts/:accuralreceiptId')//.all(accuralreceiptsPolicy.isAllowed)
    .get(accuralreceiptsPolicy.isAllowed, accuralreceipts.read)
    .put(users.requiresLoginToken, accuralreceiptsPolicy.isAllowed, accuralreceipts.update)
    .delete(users.requiresLoginToken, accuralreceiptsPolicy.isAllowed, accuralreceipts.delete);

  // Finish by binding the Accuralreceipt middleware
  app.param('accuralreceiptId', accuralreceipts.accuralreceiptByID);
};
