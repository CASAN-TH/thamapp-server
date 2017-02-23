'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Requestorder = mongoose.model('Requestorder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Requestorder
 */
exports.create = function (req, res) {
  var requestorder = new Requestorder(req.body);
  requestorder.user = req.user;

  requestorder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(requestorder);
    }
  });
};

/**
 * Show the current Requestorder
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var requestorder = req.requestorder ? req.requestorder.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  requestorder.isCurrentUserOwner = req.user && requestorder.user && requestorder.user._id.toString() === req.user._id.toString();

  res.jsonp(requestorder);
};

/**
 * Update a Requestorder
 */
exports.update = function (req, res) {
  var requestorder = req.requestorder;

  requestorder = _.extend(requestorder, req.body);

  requestorder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(requestorder);
    }
  });
};

/**
 * Delete an Requestorder
 */
exports.delete = function (req, res) {
  var requestorder = req.requestorder;

  requestorder.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(requestorder);
    }
  });
};

/**
 * List of Requestorders
 */
exports.list = function (req, res) {
  Requestorder.find().sort('-created').populate('user', 'displayName').populate('items.product').populate('namedeliver').populate('transport').exec(function (err, requestorders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(requestorders);
    }
  });
};

/**
 * Requestorder middleware
 */
exports.requestorderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Requestorder is invalid'
    });
  }

  Requestorder.findById(id).populate('user', 'displayName').populate('items.product').populate('namedeliver').populate('transport').exec(function (err, requestorder) {
    if (err) {
      return next(err);
    } else if (!requestorder) {
      return res.status(404).send({
        message: 'No Requestorder with that identifier has been found'
      });
    }
    req.requestorder = requestorder;
    next();
  });
};