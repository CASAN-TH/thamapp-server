'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Accuralreceipt = mongoose.model('Accuralreceipt'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Accuralreceipt
 */
exports.create = function(req, res) {
  var accuralreceipt = new Accuralreceipt(req.body);
  accuralreceipt.user = req.user;

  accuralreceipt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accuralreceipt);
    }
  });
};

/**
 * Show the current Accuralreceipt
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var accuralreceipt = req.accuralreceipt ? req.accuralreceipt.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  accuralreceipt.isCurrentUserOwner = req.user && accuralreceipt.user && accuralreceipt.user._id.toString() === req.user._id.toString();

  res.jsonp(accuralreceipt);
};

/**
 * Update a Accuralreceipt
 */
exports.update = function(req, res) {
  var accuralreceipt = req.accuralreceipt;

  accuralreceipt = _.extend(accuralreceipt, req.body);

  accuralreceipt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accuralreceipt);
    }
  });
};

/**
 * Delete an Accuralreceipt
 */
exports.delete = function(req, res) {
  var accuralreceipt = req.accuralreceipt;

  accuralreceipt.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accuralreceipt);
    }
  });
};

/**
 * List of Accuralreceipts
 */
exports.list = function(req, res) {
  Accuralreceipt.find().sort('-created').populate('user').populate('items').populate('namedeliver').exec(function(err, accuralreceipts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accuralreceipts);
    }
  });
};

/**
 * Accuralreceipt middleware
 */
exports.accuralreceiptByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Accuralreceipt is invalid'
    });
  }

  Accuralreceipt.findById(id).populate('user').populate('items').populate('namedeliver').exec(function (err, accuralreceipt) {
    if (err) {
      return next(err);
    } else if (!accuralreceipt) {
      return res.status(404).send({
        message: 'No Accuralreceipt with that identifier has been found'
      });
    }
    req.accuralreceipt = accuralreceipt;
    next();
  });
};
