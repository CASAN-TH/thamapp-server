'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Returnorder = mongoose.model('Returnorder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Returnorder
 */
exports.create = function(req, res) {
  var returnorder = new Returnorder(req.body);
  returnorder.user = req.user;

  returnorder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(returnorder);
    }
  });
};

/**
 * Show the current Returnorder
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var returnorder = req.returnorder ? req.returnorder.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  returnorder.isCurrentUserOwner = req.user && returnorder.user && returnorder.user._id.toString() === req.user._id.toString();

  res.jsonp(returnorder);
};

/**
 * Update a Returnorder
 */
exports.update = function(req, res) {
  var returnorder = req.returnorder;

  returnorder = _.extend(returnorder, req.body);

  returnorder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(returnorder);
    }
  });
};

/**
 * Delete an Returnorder
 */
exports.delete = function(req, res) {
  var returnorder = req.returnorder;

  returnorder.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(returnorder);
    }
  });
};

/**
 * List of Returnorders
 */
exports.list = function(req, res) {
  Returnorder.find().sort('-created').populate('user', 'displayName').exec(function(err, returnorders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(returnorders);
    }
  });
};

/**
 * Returnorder middleware
 */
exports.returnorderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Returnorder is invalid'
    });
  }

  Returnorder.findById(id).populate('user', 'displayName').exec(function (err, returnorder) {
    if (err) {
      return next(err);
    } else if (!returnorder) {
      return res.status(404).send({
        message: 'No Returnorder with that identifier has been found'
      });
    }
    req.returnorder = returnorder;
    next();
  });
};
