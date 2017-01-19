'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Promotion = mongoose.model('Promotion'),
  Product = mongoose.model('Product'),
  Order = mongoose.model('Order'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Promotion
 */
exports.create = function (req, res) {
  var promotion = new Promotion(req.body);
  promotion.user = req.user;

  promotion.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(promotion);
    }
  });
};

/**
 * Show the current Promotion
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var promotion = req.promotion ? req.promotion.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  promotion.isCurrentUserOwner = req.user && promotion.user && promotion.user._id.toString() === req.user._id.toString();

  res.jsonp(promotion);
};

/**
 * Update a Promotion
 */
exports.update = function (req, res) {
  var promotion = req.promotion;

  promotion = _.extend(promotion, req.body);

  promotion.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(promotion);
    }
  });
};

/**
 * Delete an Promotion
 */
exports.delete = function (req, res) {
  var promotion = req.promotion;

  promotion.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(promotion);
    }
  });
};

/**
 * List of Promotions
 */
exports.list = function (req, res) {
  Promotion.find().sort('-created').populate('user', 'displayName').populate('product').exec(function (err, promotions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(promotions);
    }
  });
};

/**
 * Promotion middleware
 */
exports.promotionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Promotion is invalid'
    });
  }

  Promotion.findById(id).populate('user', 'displayName').populate('product').exec(function (err, promotion) {
    if (err) {
      return next(err);
    } else if (!promotion) {
      return res.status(404).send({
        message: 'No Promotion with that identifier has been found'
      });
    }
    req.promotion = promotion;
    next();
  });
};

exports.promotionByProductID = function (req, res, next, _id) {
  Promotion.find().sort('-created').populate('user', 'displayName').populate('product').exec(function (err, promotions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var promos = [];
      for (var i = 0; i < promotions.length; i++) {
        // console.log(promotions[i].product._id + ':' + _id);
        if (promotions[i].product._id.toString() === _id.toString()) {
          // console.log(promotions[i]);

          promos.push(promotions[i]);

        }
      }
      //console.log(promos);
      req.promotions = promos;
      next();
    }
  });
  // Promotion.find({ 'product._id': _id }).populate('user', 'displayName').populate('product').exec(function (err, promotion) {
  //   // console.dir(promotion);    
  //   if (err) {
  //     return next(err);
  //   } else if (!promotion) {
  //     return res.status(404).send({
  //       message: 'No Promotion with that identifier has been found'
  //     });
  //   }

  //   req.promotion = promotion[0];
  //   console.log(req.promotion.product._id);
  //   next();
  // });
};

exports.readProductById = function (req, res) {
  var qty = req.qty;
  // convert mongoose document to JSON
  //console.log(req.promotions);
  var promotions = req.promotions ? req.promotions : [];
  // console.log(promotion.product._id);
  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  var sum = 0;
  var resultQty = 0;
  var total = 0;
  promotions.forEach(function (promotion) {
    // console.log(promotion);
    // promotion.isCurrentUserOwner = req.user && promotion.user && promotion.user._id.toString() === req.user._id.toString();
    if (qty >= promotion.condition) {
      resultQty = parseInt(qty / promotion.condition);
      // if (promotion.freeitem && promotion.freeitem.qty) {
      //   sum += (promotion.freeitem.qty || 0) * resultQty;
      //   //res.jsonp({ promotion: promotion, freeitemunit: resultQty, total: sum });
      // } else 

      if (promotion.discount.fixBath > 0) {
        sum += (promotion.discount.fixBath || 0) * resultQty;
        //res.jsonp({ promotion: promotion, freeitemunit: resultQty, total: sum });
      }
      if (promotion.discount.percen > 0) {
        var checkQty = promotion.condition * resultQty;
        var checkAmount = (promotion.product.price || 0) * checkQty;
        sum += checkAmount * (promotion.discount.percen / 100);
        //res.jsonp({ promotion: promotion, freeitemunit: resultQty, total: sum });
      }

    } else {
      //res.jsonp({});
    }
    
  });

  res.jsonp({ promotions: promotions, freeitemunit: resultQty, total: sum });

};


