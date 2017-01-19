'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Managebank = mongoose.model('Managebank'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Managebank
 */
exports.create = function(req, res) {
  var managebank = new Managebank(req.body);
  managebank.user = req.user;

  managebank.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(managebank);
    }
  });
};

/**
 * Show the current Managebank
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var managebank = req.managebank ? req.managebank.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  managebank.isCurrentUserOwner = req.user && managebank.user && managebank.user._id.toString() === req.user._id.toString();

  res.jsonp(managebank);
};

/**
 * Update a Managebank
 */
exports.update = function(req, res) {
  var managebank = req.managebank;

  managebank = _.extend(managebank, req.body);

  managebank.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(managebank);
    }
  });
};

/**
 * Delete an Managebank
 */
exports.delete = function(req, res) {
  var managebank = req.managebank;

  managebank.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(managebank);
    }
  });
};

/**
 * List of Managebanks
 */
exports.list = function(req, res) {
  Managebank.find().sort('-created').populate('user', 'displayName').exec(function(err, managebanks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(managebanks);
    }
  });
};

/**
 * Managebank middleware
 */
exports.managebankByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Managebank is invalid'
    });
  }

  Managebank.findById(id).populate('user', 'displayName').exec(function (err, managebank) {
    if (err) {
      return next(err);
    } else if (!managebank) {
      return res.status(404).send({
        message: 'No Managebank with that identifier has been found'
      });
    }
    req.managebank = managebank;
    next();
  });
};
