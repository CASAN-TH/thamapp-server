'use strict';

/**
 * Module dependencies
 */
var paymentsPolicy = require('../policies/payments.server.policy'),
  payments = require('../controllers/payments.server.controller');

module.exports = function (app) {
  // Payments Routes
  app.route('/api/payments').all(paymentsPolicy.isAllowed)
    .get(payments.list)
    .post(payments.create);

  app.route('/api/payments/:paymentId').all(paymentsPolicy.isAllowed)
    .get(payments.read)
    .put(payments.update)
    .delete(payments.delete);
  app.route('/api/payments/docno/:docno')
    .get(payments.docno);

  app.route('/api/ledgers/:startdate/:enddate')
    .get(payments.ledgerCooking, payments.ledgers);

  app.route('/api/expenses/:startdate/:enddate')
    .get(payments.ledgerCooking, payments.expenses);

  app.route('/api/revenues/:startdate/:enddate')
    .get(payments.ledgerCooking, payments.revenues);

  app.route('/api/statementincomes/:startdate/:enddate')
    .get(payments.ledgerCooking, payments.statementincomesCooking, payments.statementincomes);

  app.route('/api/journals/:jrstartdate/:jrenddate')
    .get(payments.journals);

  // Finish by binding the Payment middleware
  app.param('paymentId', payments.paymentByID);
  app.param('docno', payments.paymentBydocno);
  app.param('enddate', payments.enddate);
  app.param('jrstartdate', function (req, res, next, jrstartdate) {
    req.jrstartdate = jrstartdate;
    next();
  });
  app.param('jrenddate', payments.jrenddate);

};
