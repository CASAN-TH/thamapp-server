'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adjust = mongoose.model('Adjust'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adjust
 */
exports.create = function(req, res) {
  var adjust = new Adjust(req.body);
  adjust.user = req.user;

  adjust.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adjust);
    }
  });
};

/**
 * Show the current Adjust
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adjust = req.adjust ? req.adjust.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adjust.isCurrentUserOwner = req.user && adjust.user && adjust.user._id.toString() === req.user._id.toString();

  res.jsonp(adjust);
};

/**
 * Update a Adjust
 */
exports.update = function(req, res) {
  var adjust = req.adjust;

  adjust = _.extend(adjust, req.body);

  adjust.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adjust);
    }
  });
};

/**
 * Delete an Adjust
 */
exports.delete = function(req, res) {
  var adjust = req.adjust;

  adjust.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adjust);
    }
  });
};

/**
 * List of Adjusts
 */
exports.list = function(req, res) {
  Adjust.find().sort('-created').populate('user', 'displayName').exec(function(err, adjusts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adjusts);
    }
  });
};

/**
 * Adjust middleware
 */
exports.adjustByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adjust is invalid'
    });
  }

  Adjust.findById(id).populate('user', 'displayName').exec(function (err, adjust) {
    if (err) {
      return next(err);
    } else if (!adjust) {
      return res.status(404).send({
        message: 'No Adjust with that identifier has been found'
      });
    }
    req.adjust = adjust;
    next();
  });
};
