'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Receiving = mongoose.model('Receiving'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Receiving
 */
exports.create = function(req, res) {
  var receiving = new Receiving(req.body);
  receiving.user = req.user;

  receiving.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(receiving);
    }
  });
};

/**
 * Show the current Receiving
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var receiving = req.receiving ? req.receiving.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  receiving.isCurrentUserOwner = req.user && receiving.user && receiving.user._id.toString() === req.user._id.toString();

  res.jsonp(receiving);
};

/**
 * Update a Receiving
 */
exports.update = function(req, res) {
  var receiving = req.receiving;

  receiving = _.extend(receiving, req.body);

  receiving.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(receiving);
    }
  });
};

/**
 * Delete an Receiving
 */
exports.delete = function(req, res) {
  var receiving = req.receiving;

  receiving.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(receiving);
    }
  });
};

/**
 * List of Receivings
 */
exports.list = function(req, res) {
  Receiving.find().sort('-created').populate('user', 'displayName').populate('client').populate('items.product').exec(function(err, receivings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(receivings);
    }
  });
};

/**
 * Receiving middleware
 */
exports.receivingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Receiving is invalid'
    });
  }

  Receiving.findById(id).populate('user', 'displayName').populate('client').populate('items.product').exec(function (err, receiving) {
    if (err) {
      return next(err);
    } else if (!receiving) {
      return res.status(404).send({
        message: 'No Receiving with that identifier has been found'
      });
    }
    req.receiving = receiving;
    next();
  });
};
