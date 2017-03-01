'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Stock = mongoose.model('Stock'),
  User = mongoose.model('User'),
  Order = mongoose.model('Order'),
  Requestorder = mongoose.model('Requestorder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Stock
 */
// exports.create = function(req, res) {
//   var stock = new Stock(req.body);
//   stock.user = req.user;

//   stock.save(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.jsonp(stock);
//     }
//   });
// };

/**
 * Show the current Stock
 */
// exports.read = function(req, res) {
//   // convert mongoose document to JSON
//   var stock = req.stock ? req.stock.toJSON() : {};

//   // Add a custom field to the Article, for determining if the current User is the "owner".
//   // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
//   stock.isCurrentUserOwner = req.user && stock.user && stock.user._id.toString() === req.user._id.toString();

//   res.jsonp(stock);
// };

/**
 * Update a Stock
 */
// exports.update = function(req, res) {
//   var stock = req.stock;

//   stock = _.extend(stock, req.body);

//   stock.save(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.jsonp(stock);
//     }
//   });
// };

/**
 * Delete an Stock
 */
// exports.delete = function(req, res) {
//   var stock = req.stock;

//   stock.remove(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.jsonp(stock);
//     }
//   });
// };

/**
 * List of Stocks
 */
exports.list = function (req, res) {
  // User.find().sort('-created').where("roles").equals("deliver").exec(function (err, delivers) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {

  //     delivers.forEach(function(deliver){

  //     });

  //   }
  // });
  Order.find().sort('-created').where('deliverystatus').equals('accept').exec(function (err, accepts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      
      Order.find().sort('-created').where('deliverystatus').equals('complete').exec(function (err, completes) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          Requestorder.find().sort('-created').where("deliverystatus").equals("received").exec(function (err, incomes) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              var stocks = [];
              incomes.forEach(function (income) {
                income.items.forEach(function (itm) {
                  var stock = {
                    namedeliver: income.namedeliver,
                    product: itm.product,
                    income: itm.qty,
                    wip: 0,
                    outcom: 0
                  };
                  stocks.push(stock);
                });
              });

              accepts.forEach(function (accept) {
                accept.items.forEach(function (itm) {
                  var stock = {
                    namedeliver: accept.namedeliver,
                    product: itm.product,
                    income: 0,
                    wip: itm.qty,
                    outcom: 0
                  };
                  stocks.push(stock);
                });
              });

              completes.forEach(function (complete) {
                complete.items.forEach(function (itm) {
                  var stock = {
                    namedeliver: complete.namedeliver,
                    product: itm.product,
                    income: 0,
                    wip: 0,
                    outcom: itm.qty
                  };
                  stocks.push(stock);
                });
              });

              res.jsonp(stocks);
            }
          });
        }
      });
    }//
  });
};

/**
 * Stock middleware
 */
// exports.stockByID = function(req, res, next, id) {

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).send({
//       message: 'Stock is invalid'
//     });
//   }

//   Stock.findById(id).populate('user', 'displayName').exec(function (err, stock) {
//     if (err) {
//       return next(err);
//     } else if (!stock) {
//       return res.status(404).send({
//         message: 'No Stock with that identifier has been found'
//       });
//     }
//     req.stock = stock;
//     next();
//   });
// };
