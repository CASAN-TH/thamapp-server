'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Accuralreceipt = mongoose.model('Accuralreceipt'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Accuralreceipt
 */
exports.create = function (req, res) {
  var accuralreceipt = new Accuralreceipt(req.body);
  accuralreceipt.user = req.user;

  accuralreceipt.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accuralreceipt);
    }
  });
};

/**
 * Show the current Accuralreceipt
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var accuralreceipts = req.accuralreceipt ? req.accuralreceipt.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  accuralreceipts.isCurrentUserOwner = req.user && accuralreceipts.user && accuralreceipts.user._id.toString() === req.user._id.toString();
  User.populate(accuralreceipts, { path: 'items.user' },
    function (err, user) {
      User.populate(accuralreceipts, { path: 'items.namedeliver' },
        function (err, deliver) {
          Product.populate(accuralreceipts, { path: 'items.items.product' },
            function (err, product) {
              res.jsonp(product);
            }
          );
        }
      );
    }
  );
  // res.jsonp(accuralreceipt);
};

/**
 * Update a Accuralreceipt
 */
exports.update = function (req, res) {
  var accuralreceipt = req.accuralreceipt;

  accuralreceipt = _.extend(accuralreceipt, req.body);

  accuralreceipt.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accuralreceipt);
    }
  });
};

/**
 * Delete an Accuralreceipt
 */
exports.delete = function (req, res) {
  var accuralreceipt = req.accuralreceipt;

  accuralreceipt.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accuralreceipt);
    }
  });
};

/**
 * List of Accuralreceipts
 */
exports.list = function (req, res) {
  Accuralreceipt.find().sort('-created').populate('user').populate('items').populate('namedeliver').exec(function (err, accuralreceipts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      User.populate(accuralreceipts, { path: 'items.user' },
        function (err, user) {
          User.populate(accuralreceipts, { path: 'items.namedeliver' },
            function (err, deliver) {
              Product.populate(accuralreceipts, { path: 'items.items.product' },
                function (err, product) {
                  res.jsonp(product);
                }
              );
            }
          );
        }
      );

    }
  });
};

/**
 * Accuralreceipt middleware
 */
exports.accuralreceiptByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Accuralreceipt is invalid'
    });
  }

  Accuralreceipt.findById(id).populate('user').populate('items').populate('namedeliver').exec(function (err, accuralreceipt) {
    if (err) {
      return next(err);
    } else if (!accuralreceipt) {
      return res.status(404).send({
        message: 'No Accuralreceipt with that identifier has been found'
      });
    }
    req.accuralreceipt = accuralreceipt;
    next();
  });
};
