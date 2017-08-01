'use strict';

/**
 * Module dependencies
 */
var accountsPolicy = require('../policies/accounts.server.policy'),
  accounts = require('../controllers/accounts.server.controller');

module.exports = function (app) {
  // Accounts Routes
  app.route('/api/accounts').all(accountsPolicy.isAllowed)
    .get(accounts.list)
    .post(accounts.create);

  app.route('/api/accounts/:accountId').all(accountsPolicy.isAllowed)
    .get(accounts.read)
    .put(accounts.update)
    .delete(accounts.delete);

  app.route('/api/account/ap')
    .get(accounts.sendAp);

  app.route('/api/account/ar')
    .get(accounts.sendAr);

  app.route('/api/account/pv')
    .get(accounts.sendPv);

  app.route('/api/account/rv')
    .get(accounts.sendRv);

  app.route('/api/account/jv')
    .get(accounts.sendJv);

  // Finish by binding the Account middleware
  app.param('accountId', accounts.accountByID);
};
