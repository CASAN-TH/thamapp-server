'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Dowload = mongoose.model('Dowload'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Dowload
 */
exports.create = function(req, res) {
  var dowload = new Dowload(req.body);
  dowload.user = req.user;

  dowload.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dowload);
    }
  });
};

/**
 * Show the current Dowload
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var dowload = req.dowload ? req.dowload.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  dowload.isCurrentUserOwner = req.user && dowload.user && dowload.user._id.toString() === req.user._id.toString();

  res.jsonp(dowload);
};

/**
 * Update a Dowload
 */
exports.update = function(req, res) {
  var dowload = req.dowload;

  dowload = _.extend(dowload, req.body);

  dowload.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dowload);
    }
  });
};

/**
 * Delete an Dowload
 */
exports.delete = function(req, res) {
  var dowload = req.dowload;

  dowload.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dowload);
    }
  });
};

/**
 * List of Dowloads
 */
exports.list = function(req, res) {
  Dowload.find().sort('-created').populate('user', 'displayName').exec(function(err, dowloads) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dowloads);
    }
  });
};

/**
 * Dowload middleware
 */
exports.dowloadByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Dowload is invalid'
    });
  }

  Dowload.findById(id).populate('user', 'displayName').exec(function (err, dowload) {
    if (err) {
      return next(err);
    } else if (!dowload) {
      return res.status(404).send({
        message: 'No Dowload with that identifier has been found'
      });
    }
    req.dowload = dowload;
    next();
  });
};
