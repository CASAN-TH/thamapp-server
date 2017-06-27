'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Freerice = mongoose.model('Freerice'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Freerice
 */
exports.create = function(req, res) {
  var freerice = new Freerice(req.body);
  freerice.user = req.user;

  freerice.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(freerice);
    }
  });
};

/**
 * Show the current Freerice
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var freerice = req.freerice ? req.freerice.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  freerice.isCurrentUserOwner = req.user && freerice.user && freerice.user._id.toString() === req.user._id.toString();

  res.jsonp(freerice);
};

/**
 * Update a Freerice
 */
exports.update = function(req, res) {
  var freerice = req.freerice;

  freerice = _.extend(freerice, req.body);

  freerice.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(freerice);
    }
  });
};

/**
 * Delete an Freerice
 */
exports.delete = function(req, res) {
  var freerice = req.freerice;

  freerice.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(freerice);
    }
  });
};

/**
 * List of Freerices
 */
exports.list = function(req, res) {
  Freerice.find().sort('-created').populate('user', 'displayName').exec(function(err, freerices) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(freerices);
    }
  });
};

/**
 * Freerice middleware
 */
exports.freericeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Freerice is invalid'
    });
  }

  Freerice.findById(id).populate('user', 'displayName').exec(function (err, freerice) {
    if (err) {
      return next(err);
    } else if (!freerice) {
      return res.status(404).send({
        message: 'No Freerice with that identifier has been found'
      });
    }
    req.freerice = freerice;
    next();
  });
};
