"use strict";

/**
 * Module dependencies.
 */
var path = require("path"),
  mongoose = require("mongoose"),
  Stock = mongoose.model("Stock"),
  User = mongoose.model("User"),
  Order = mongoose.model("Order"),
  Accuralreceipt = mongoose.model("Accuralreceipt"),
  Requestorder = mongoose.model("Requestorder"),
  Returnorder = mongoose.model("Returnorder"),
  errorHandler = require(path.resolve(
    "./modules/core/server/controllers/errors.server.controller"
  )),
  _ = require("lodash");

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
exports.list = function(req, res) {
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
  // console.log(req.user);
  var filter = null;
  if (req.user && req.user.roles.indexOf("deliver") !== -1) {
    filter = {
      namedeliver: req.user._id
    };
  }
  Order.find(filter)
    .sort("-created")
    .where("deliverystatus")
    .equals("accept")
    .populate("items.product")
    .populate("namedeliver")
    .exec(function(err, accepts) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        Order.find(filter)
          .sort("-created")
          .where("deliverystatus")
          .equals("complete")
          .populate("items.product")
          .populate("namedeliver")
          .exec(function(err, completes) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              Requestorder.find(filter)
                .sort("-created")
                .where("deliverystatus")
                .equals("received")
                .populate("items.product")
                .populate("namedeliver")
                .exec(function(err, incomes) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    Returnorder.find(filter)
                      .sort("-created")
                      .where("deliverystatus")
                      .equals("received")
                      .populate("items.product")
                      .populate("namedeliver")
                      .exec(function(err, returnords) {
                        if (err) {
                          return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                          });
                        } else {
                          Order.find(filter)
                            .sort("-created")
                            .where("deliverystatus")
                            .equals("ap")
                            .populate("items.product")
                            .populate("namedeliver")
                            .exec(function(err, aps) {
                              if (err) {
                                return res.status(400).send({
                                  message: errorHandler.getErrorMessage(err)
                                });
                              } else {
                                var stocks = [];
                                incomes.forEach(function(income) {
                                  income.items.forEach(function(itm) {
                                    var stock = {
                                      namedeliver: income.namedeliver,
                                      product: itm.product,
                                      income: itm.qty,
                                      wip: 0,
                                      outcome: 0,
                                      returnord: 0,
                                      ap: 0
                                    };
                                    stocks.push(stock);
                                  });
                                });

                                returnords.forEach(function(returnord) {
                                  returnord.items.forEach(function(itm) {
                                    var stock = {
                                      namedeliver: returnord.namedeliver,
                                      product: itm.product,
                                      income: 0,
                                      wip: 0,
                                      outcome: 0,
                                      returnord: itm.qty,
                                      ap: 0
                                    };
                                    stocks.push(stock);
                                  });
                                });

                                aps.forEach(function(apord) {
                                  apord.items.forEach(function(itm) {
                                    var stock = {
                                      namedeliver: apord.namedeliver,
                                      product: itm.product,
                                      income: 0,
                                      wip: 0,
                                      outcome: 0,
                                      returnord: 0,
                                      ap: itm.qty
                                    };
                                    stocks.push(stock);
                                  });
                                });

                                accepts.forEach(function(accept) {
                                  accept.items.forEach(function(itm) {
                                    var stock = {
                                      namedeliver: accept.namedeliver,
                                      product: itm.product,
                                      income: 0,
                                      wip: itm.qty,
                                      outcome: 0,
                                      returnord: 0,
                                      ap: 0
                                    };
                                    stocks.push(stock);
                                  });
                                });

                                completes.forEach(function(complete) {
                                  complete.items.forEach(function(itm) {
                                    var stock = {
                                      namedeliver: complete.namedeliver,
                                      product: itm.product,
                                      income: 0,
                                      wip: 0,
                                      outcome: itm.qty,
                                      returnord: 0,
                                      ap: 0
                                    };
                                    stocks.push(stock);
                                  });
                                });

                                var ret = [];
                                var result = _.chain(stocks)
                                  .groupBy("namedeliver")
                                  .pairs()
                                  .map(function(currentItem) {
                                    return _.object(
                                      _.zip(
                                        ["namedeliver", "stocks"],
                                        currentItem
                                      )
                                    );
                                  })
                                  .value();
                                var stks = [];
                                result.forEach(function(stk) {
                                  var _stk = {
                                    namedeliver: stk.stocks[0].namedeliver,
                                    stocks: []
                                  };
                                  var prods = _.chain(stk.stocks)
                                    .groupBy("product")
                                    .pairs()
                                    .map(function(currentItem) {
                                      return _.object(
                                        _.zip(
                                          ["product", "prodstocks"],
                                          currentItem
                                        )
                                      );
                                    })
                                    .value();

                                  prods.forEach(function(prd) {
                                    var pd = {
                                      product: prd.prodstocks[0].product,
                                      income: 0,
                                      wip: 0,
                                      outcome: 0,
                                      returnord: 0,
                                      ap: 0
                                    };
                                    prd.prodstocks.forEach(function(vol) {
                                      pd.income += vol.income;
                                      pd.wip += vol.wip;
                                      pd.outcome += vol.outcome;
                                      pd.returnord += vol.returnord;
                                      pd.ap += vol.ap;
                                    });
                                    _stk.stocks.push(pd);
                                  });

                                  ret.push(_stk);
                                });

                                res.jsonp(ret);
                              }
                            });
                        }
                      });
                  } //
                });
            }
          });
      }
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

exports.getStocksReceipted = function(req, res, next) {
  Requestorder.find(
    {
      deliverystatus: "received",
      docdate: { $lte: new Date(req.enddate) }
    },
    function(err, data) {
      if (err) {
        return res.status(400).send({
          status: 400,
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.dataReceipted = data;
        next();
      }
    }
  )
    .populate("items.product")
    .populate("namedeliver")
    .lean()
    .sort({
      created: -1
    });
};

exports.getStockReturned = function(req, res, next) {
  Returnorder.find(
    {
      deliverystatus: "received",
      docdate: { $lte: new Date(req.enddate) }
    },
    function(err, data) {
      if (err) {
        return res.status(400).send({
          status: 400,
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.dataReturned = data;
        next();
      }
    }
  )
    .populate("items.product")
    .populate("namedeliver")
    .lean()
    .sort({
      created: -1
    });
};

exports.getStockAP = function(req, res, next) {
  Accuralreceipt.find(
    {
      arstatus: "confirmed",
      docdate: { $lte: new Date(req.enddate) }
    },
    function(err, data) {
      if (err) {
        return res.status(400).send({
          status: 400,
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.dataAP = data;
        next();
      }
    }
  )
    .populate("items.product")
    .populate("namedeliver")
    .lean()
    .sort({
      created: -1
    });
};

exports.cookingStock = function(req, res, next) {
  var stocks = [];
  var incomes = req.dataReceipted;
  incomes.forEach(function(income) {
    income.items.forEach(function(itm) {
      var stock = {
        docno: income.docno,
        docdate: income.docdate,
        namedeliver: income.namedeliver,
        product: itm.product.name,
        income: itm.qty,
        return: 0,
        ap: 0
      };
      stocks.push(stock);
    });
  });
  var returnords = req.dataReturned;
  returnords.forEach(function(returnord) {
    returnord.items.forEach(function(itm) {
      var stock = {
        docno: returnord.docno,
        docdate: returnord.docdate,
        namedeliver: returnord.namedeliver,
        product: itm.product.name,
        income: 0,
        return: itm.qty,
        ap: 0
      };
      stocks.push(stock);
    });
  });

  var aps = req.dataAP;
  aps.forEach(function(ap) {
    ap.items.forEach(function(itm) {
      var stock = {
        docno: ap.docno,
        docdate: ap.docdate,
        namedeliver: ap.namedeliver,
        product: itm.product.name,
        income: 0,
        return: 0,
        ap: itm.qty
      };
      stocks.push(stock);
    });
  });

  req.data = stocks;

};

exports.respone = function(req, res) {
  return res.jsonp({
    status: 200,
    data: req.data
  });
};

exports.setConditionStock = function(req, res, next, enddate) {
  if (enddate) {
    req.enddate = enddate;
    next();
  } else {
    return res.status(400).send({
      status: 400,
      message: "date is null!!!"
    });
  }
};
