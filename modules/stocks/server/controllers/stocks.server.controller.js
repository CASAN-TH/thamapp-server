'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  //Stock = mongoose.model('Stock'),
  Product = mongoose.model('Product'),
  User = mongoose.model('User'),
  Order = mongoose.model('Order'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * List of Stocks
 */
exports.list = function (req, res) {
  var stocks = [];
  Product.find().sort('-created').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var stocks = [];
      User.find().sort('-created').exec(function (err, users) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          Order.find().sort('-created').populate('items.product').populate('namedeliver').where('deliverystatus').equals('complete').exec(function (err, orders) {
            if (err) {

            } else {
              products.forEach(function (_product) {
                var st = {
                  name: _product.name,
                  max: 20,
                  min: 15,
                  stocks: []
                };
                users.forEach(function (_usr) {
                  console.log(_usr.profileImageURL);
                  var deliver = {
                    deliveryid: _usr._id,
                    deliveryname: _usr.displayName,
                    profileImageURL: _usr.profileImageURL,
                    sold: 0
                  };
                  orders.forEach(function (_order) {
                    if (_order.namedeliver) {


                      if (_order.namedeliver._id.toString() === _usr._id.toString()) {

                        if (_order.items) {
                          _order.items.forEach(function (_itm) {
                            if (_itm.product._id.toString() === _product._id.toString()) {
                              deliver.sold += (_itm.qty || 0);
                            }
                          });
                        }
                      }
                    }


                  });
                  if (deliver.sold > 0) {
                    st.stocks.push(deliver);
                  }

                });
                stocks.push(st);
              });
            }
            res.jsonp(stocks);
          });
        }
      });
    }

  });
};

