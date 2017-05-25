'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Download = mongoose.model('Download'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Download
 */
exports.create = function(req, res) {
  var download = new Download(req.body);
  download.user = req.user;

  download.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(download);
    }
  });
};

/**
 * Show the current Download
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var download = req.download ? req.download.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  download.isCurrentUserOwner = req.user && download.user && download.user._id.toString() === req.user._id.toString();

  res.jsonp(download);
};

/**
 * Update a Download
 */
exports.update = function(req, res) {
  var download = req.download;

  download = _.extend(download, req.body);

  download.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(download);
    }
  });
};

/**
 * Delete an Download
 */
exports.delete = function(req, res) {
  var download = req.download;

  download.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(download);
    }
  });
};

/**
 * List of Downloads
 */
exports.list = function(req, res) {
  Download.find().sort('-created').populate('user', 'displayName').exec(function(err, downloads) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(downloads);
    }
  });
};

/**
 * Download middleware
 */
exports.downloadByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Download is invalid'
    });
  }

  Download.findById(id).populate('user', 'displayName').exec(function (err, download) {
    if (err) {
      return next(err);
    } else if (!download) {
      return res.status(404).send({
        message: 'No Download with that identifier has been found'
      });
    }
    req.download = download;
    next();
  });
};
