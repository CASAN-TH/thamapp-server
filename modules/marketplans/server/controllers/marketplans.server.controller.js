'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Marketplan = mongoose.model('Marketplan'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Marketplan
 */
exports.create = function (req, res) {
  var marketplan = new Marketplan(req.body);
  marketplan.user = req.user;

  //checkreq
  if (marketplan.startdate && marketplan.enddate && marketplan.startdate > marketplan.enddate) {
    return res.status(400).send({
      message: 'Start date > End date'
    });
  }



  marketplan.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(marketplan);
    }
  });
};

/**
 * Show the current Marketplan
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var marketplan = req.marketplan ? req.marketplan.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  marketplan.isCurrentUserOwner = req.user && marketplan.user && marketplan.user._id.toString() === req.user._id.toString();

  res.jsonp(marketplan);
};

/**
 * Update a Marketplan
 */
exports.update = function (req, res) {
  var marketplan = req.marketplan;

  marketplan = _.extend(marketplan, req.body);

  marketplan.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(marketplan);
    }
  });
};

/**
 * Delete an Marketplan
 */
exports.delete = function (req, res) {
  var marketplan = req.marketplan;

  marketplan.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(marketplan);
    }
  });
};

/**
 * List of Marketplans
 */
exports.list = function (req, res) {
  Marketplan.find().sort('-created').populate('user', 'displayName').exec(function (err, marketplans) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(marketplans);
    }
  });
};

/**
 * Marketplan middleware
 */
exports.marketplanByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Marketplan is invalid'
    });
  }

  Marketplan.findById(id).populate('user', 'displayName').exec(function (err, marketplan) {
    if (err) {
      return next(err);
    } else if (!marketplan) {
      return res.status(404).send({
        message: 'No Marketplan with that identifier has been found'
      });
    }
    req.marketplan = marketplan;
    next();
  });
};
