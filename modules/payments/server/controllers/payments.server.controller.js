'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Payment = mongoose.model('Payment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Payment
 */
exports.create = function (req, res) {
  var payment = new Payment(req.body);
  payment.user = req.user;
  var reqGltype = payment.gltype;
  var year = payment.docdate.getFullYear();
  var getmonth = payment.docdate.getMonth() + 1;
  var month = '';
  if (month < 10) {
    month = '0' + getmonth;
  } else {
    month = getmonth;
  }
  var genDocno = year + month;
  Payment.find({ gltype: reqGltype }).sort('-docno').populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, payments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (payments.length > 0) {
        var chkDoc = payment.docno.substr(0, 8);
        var chkResultDoc = payments[0].docno.substr(0, 8);
        if (chkDoc === chkResultDoc) {
          var getDocno = payments[0].docno.substr(2, 9);
          var calDocno = parseInt(getDocno) + 1;
          payment.docno = payments[0].gltype + calDocno;
        } else {
          var reqDocno = payments[0].gltype + genDocno;
          var setDocno = '';

          if (payments.length > 0) {
            var setDoc = '';
            var maxDoc = 0;
            payments.forEach(function (pm) {
              var pmDocno = pm.docno.substr(2, 6);
              var countDocno = pm.docno.substr(2, 9);
              if (genDocno.toString() === pmDocno.toString()) {
                if (maxDoc < parseInt(pmDocno)) {
                  maxDoc = countDocno;
                }
              }
            });
            setDocno = payments[0].gltype + (parseInt(maxDoc) + 1);
          } else {
            setDocno = reqDocno + '001';
          }
          payment.docno = setDocno;
        }
      } else if (payments.length === 0) {
        payment.docno = reqGltype + genDocno + '001';
      }
      payment.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(payment);
        }
      });
    }
  });
};

/**
 * Show the current Payment
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var payment = req.payment ? req.payment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  payment.isCurrentUserOwner = req.user && payment.user && payment.user._id.toString() === req.user._id.toString();

  res.jsonp(payment);
};

/**
 * Update a Payment
 */
exports.update = function (req, res) {
  var payment = req.payment;

  payment = _.extend(payment, req.body);

  payment.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(payment);
    }
  });
};

/**
 * Delete an Payment
 */
exports.delete = function (req, res) {
  var payment = req.payment;

  payment.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(payment);
    }
  });
};

/**
 * List of Payments
 */
exports.list = function (req, res) {
  Payment.find().sort('-created').populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, payments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(payments);
    }
  });
};

/**
 * Payment middleware
 */
exports.paymentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Payment is invalid'
    });
  }

  Payment.findById(id).populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, payment) {
    if (err) {
      return next(err);
    } else if (!payment) {
      return res.status(404).send({
        message: 'No Payment with that identifier has been found'
      });
    }
    req.payment = payment;
    next();
  });
};
