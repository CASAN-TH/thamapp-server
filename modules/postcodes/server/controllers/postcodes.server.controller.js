'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Postcode = mongoose.model('Postcode'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Postcode
 */
exports.create = function(req, res) {
  var postcode = new Postcode(req.body);
  postcode.user = req.user;

  postcode.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(postcode);
    }
  });
};

/**
 * Show the current Postcode
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var postcode = req.postcode ? req.postcode.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  postcode.isCurrentUserOwner = req.user && postcode.user && postcode.user._id.toString() === req.user._id.toString();

  res.jsonp(postcode);
};

/**
 * Update a Postcode
 */
exports.update = function(req, res) {
  var postcode = req.postcode;

  postcode = _.extend(postcode, req.body);

  postcode.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(postcode);
    }
  });
};

/**
 * Delete an Postcode
 */
exports.delete = function(req, res) {
  var postcode = req.postcode;

  postcode.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(postcode);
    }
  });
};

/**
 * List of Postcodes
 */
exports.list = function(req, res) {
  Postcode.find().sort('-created').populate('user', 'displayName').exec(function(err, postcodes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(postcodes);
    }
  });
};

/**
 * Postcode middleware
 */
exports.postcodeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Postcode is invalid'
    });
  }

  Postcode.findById(id).populate('user', 'displayName').exec(function (err, postcode) {
    if (err) {
      return next(err);
    } else if (!postcode) {
      return res.status(404).send({
        message: 'No Postcode with that identifier has been found'
      });
    }
    req.postcode = postcode;
    next();
  });
};
