'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pushnotiuser = mongoose.model('Pushnotiuser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Pushnotiuser
 */
exports.create = function(req, res) {
  var pushnotiuser = new Pushnotiuser(req.body);
  pushnotiuser.user = req.user;

  pushnotiuser.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pushnotiuser);
    }
  });
};

/**
 * Show the current Pushnotiuser
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var pushnotiuser = req.pushnotiuser ? req.pushnotiuser.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  pushnotiuser.isCurrentUserOwner = req.user && pushnotiuser.user && pushnotiuser.user._id.toString() === req.user._id.toString();

  res.jsonp(pushnotiuser);
};

/**
 * Update a Pushnotiuser
 */
exports.update = function(req, res) {
  var pushnotiuser = req.pushnotiuser;

  pushnotiuser = _.extend(pushnotiuser, req.body);

  pushnotiuser.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pushnotiuser);
    }
  });
};

/**
 * Delete an Pushnotiuser
 */
exports.delete = function(req, res) {
  var pushnotiuser = req.pushnotiuser;

  pushnotiuser.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pushnotiuser);
    }
  });
};

/**
 * List of Pushnotiusers
 */
exports.list = function(req, res) {
  Pushnotiuser.find().sort('-created').populate('user', 'displayName').exec(function(err, pushnotiusers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pushnotiusers);
    }
  });
};

/**
 * Pushnotiuser middleware
 */
exports.pushnotiuserByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pushnotiuser is invalid'
    });
  }

  Pushnotiuser.findById(id).populate('user', 'displayName').exec(function (err, pushnotiuser) {
    if (err) {
      return next(err);
    } else if (!pushnotiuser) {
      return res.status(404).send({
        message: 'No Pushnotiuser with that identifier has been found'
      });
    }
    req.pushnotiuser = pushnotiuser;
    next();
  });
};
