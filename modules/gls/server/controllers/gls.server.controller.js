'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Gl = mongoose.model('Gl'),
  Receiving = mongoose.model('Receiving'),
  Invoice = mongoose.model('Invoice'),
  Receipt = mongoose.model('Receipt'),
  Payment = mongoose.model('Payment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

function getReceiving(callback) {
  var transaction = [];
  Receiving.find().sort('-created').populate('user', 'displayName').populate('client').populate('items.product').exec(function (err, receivings) {
    if (err) {
      callback(err, transaction);
    } else {
      receivings.forEach(function (receiving) {
        receiving.items.forEach(function (item) {
          transaction.push({
            date: receiving.docdate,
            refno: receiving.docno,
            actname: item.product.name,
            actno: item.product.buyaccount,
            debit: item.amount,
            credit: 0,
            docno: receiving.docno
          });
        });
        transaction.push({
          date: receiving.docdate,
          refno: receiving.docno,
          actname: 'ภาษีซื้อ',
          actno: '10000',
          debit: receiving.vatamount,
          credit: 0,
          docno: receiving.docno
        });
        transaction.push({
          date: receiving.docdate,
          refno: receiving.docno,
          actname: 'เจ้าหนี้ - ' + receiving.client.name,
          actno: receiving.client.accountno,
          debit: 0,
          credit: receiving.totalamount + (receiving.whtamount || 0),
          docno: receiving.docno
        });
      });
    }
    callback(err, transaction);
  });

  // var actDate = new Date();
}

function getInvoice(callback) {
  var transaction = [];
  Invoice.find().sort('-created').populate('user', 'displayName').populate('client').populate('items.product').exec(function (err, invoices) {
    if (err) {
      callback(err, transaction);
    } else {
      invoices.forEach(function (invoice) {
        transaction.push({
          date: invoice.docdate,
          refno: invoice.docno,
          actname: 'ลูกหนี้ - ' + invoice.client.name,
          actno: invoice.client.accountno,
          debit: invoice.totalamount + (invoice.whtamount || 0),
          credit: 0
        });
        invoice.items.forEach(function (item) {
          transaction.push({
            date: invoice.docdate,
            refno: invoice.docno,
            actname: 'รายได้จากการขาย - ' + item.product.name,
            actno: item.product.saleaccount,
            debit: 0,
            credit: item.amount
          });
        });
        transaction.push({
          date: invoice.docdate,
          refno: invoice.docno,
          actname: 'ภาษีขาย',
          actno: '20000',
          debit: 0,
          credit: invoice.vatamount
        });
      });
    }
    callback(err, transaction);
  });

  // var actDate = new Date();
}

function getReceipt(callback) {
  var transaction = [];
  Receipt.find().sort('-created').populate('user', 'displayName').populate('client').populate('items.product').exec(function (err, receipts) {
    if (err) {
      callback(err, transaction);
    } else {
      receipts.forEach(function (receipt) {
        transaction.push({
          date: receipt.docdate,
          refno: receipt.docno,
          actname: receipt.receiptstated,
          actno: receipt.receiptstated,
          debit: receipt.totalamount + (receipt.whtamount || 0),
          credit: 0
        });
        transaction.push({
          date: receipt.docdate,
          refno: receipt.docno,
          actname: 'ลูกหนี้ - ' + receipt.client.name,
          actno: receipt.client.accountno,
          debit: 0,
          credit: receipt.totalamount + (receipt.whtamount || 0)
        });
        // receipt.items.forEach(function (item) {
        //   transaction.push({
        //     date: receipt.docdate,
        //     refno: receipt.docno,
        //     actname: 'รายได้จากการขาย - ' + item.product.name,
        //     actno: item.product._id,
        //     debit: 0,
        //     credit: item.amount
        //   });
        // });
        // transaction.push({
        //   date: receipt.docdate,
        //   refno: receipt.docno,
        //   actname: 'ภาษีขาย',
        //   actno: '40000',
        //   debit: 0,
        //   credit: receipt.vatamount
        // });
      });
    }
    callback(err, transaction);
  });

  // var actDate = new Date();
}

function getPayment(callback) {
  var transaction = [];
  Payment.find().sort('-created').populate('user', 'displayName').populate('client').populate('items.product').exec(function (err, payments) {
    if (err) {
      callback(err, transaction);
    } else {
      payments.forEach(function (payment) {
        transaction.push({
          date: payment.docdate,
          refno: payment.docno,
          actname: payment.client.name,
          actno: payment.client.accountno,
          debit: payment.totalamount + (payment.whtamount || 0),
          credit: 0
        });
        transaction.push({
          date: payment.docdate,
          refno: payment.docno,
          actname: payment.paymentstated,
          actno: payment.paymentstated,
          debit: 0,
          credit: payment.totalamount + (payment.whtamount || 0)
        });
        // payment.items.forEach(function (item) {
        //   transaction.push({
        //     date: payment.docdate,
        //     refno: payment.docno,
        //     actname: 'รายจ่ายจากการซื้อ - ' + item.product.name,
        //     actno: item.product._id,
        //     debit: item.amount,
        //     credit: 0
        //   });
        // });
        // transaction.push({
        //   date: payment.docdate,
        //   refno: payment.docno,
        //   actname: 'ภาษีซื้อ',
        //   actno: '50000',
        //   debit: payment.vatamount,
        //   credit: 0
        // });
      });
    }
    callback(err, transaction);
  });

  // var actDate = new Date();
}
/**
 * Create a Gl
 */

exports.create = function (req, res) {
  var gl = new Gl(req.body);
  gl.user = req.user;
  gl.transaction = [];
  getReceiving(function (err, transaction) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    getInvoice(function (err, transaction2) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      getReceipt(function (err, transaction3) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        getPayment(function (err, transaction4) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          else {
            gl.transaction = gl.transaction.concat(transaction, transaction2, transaction3, transaction4);
            gl.transaction = gl.transaction.filter(function (onlyOne) {
              var date = new Date(onlyOne.date);
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              if (month < 10) {
                month = '0' + month;
              }
              var batchno = year + '' + month;
              if (batchno === gl.batchno) {
                return true;
              }
            });
            gl.totalcredit = 0;
            gl.totaldebit = 0;
            gl.transaction.forEach(function (sum) {
              gl.totalcredit += sum.credit;
              gl.totaldebit += sum.debit;
            });
            gl.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(gl);
              }
            });
          }
        });
      });
    });
  });
};

/**
 * Show the current Gl
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var gl = req.gl ? req.gl.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  gl.isCurrentUserOwner = req.user && gl.user && gl.user._id.toString() === req.user._id.toString();

  res.jsonp(gl);
};

/**
 * Update a Gl
 */
exports.update = function (req, res) {
  var gl = req.gl;

  gl = _.extend(gl, req.body);
  gl.transaction = [];
  getReceiving(function (err, transaction) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    getInvoice(function (err, transaction2) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      getReceipt(function (err, transaction3) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        getPayment(function (err, transaction4) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          else {
            gl.transaction = gl.transaction.concat(transaction, transaction2, transaction3, transaction4);
            gl.transaction = gl.transaction.filter(function (onlyOne) {
              var date = new Date(onlyOne.date);
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              if (month < 10) {
                month = '0' + month;
              }
              var batchno = year + '' + month;
              if (batchno === gl.batchno) {
                return true;
              }
            });
            gl.totalcredit = 0;
            gl.totaldebit = 0;
            gl.transaction.forEach(function (sum) {
              gl.totalcredit += sum.credit;
              gl.totaldebit += sum.debit;
            });
            gl.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(gl);
              }
            });
          }
        });
      });
    });
  });

};

/**
 * Delete an Gl
 */
exports.delete = function (req, res) {
  var gl = req.gl;

  gl.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gl);
    }
  });
};

/**
 * List of Gls
 */
exports.list = function (req, res) {
  Gl.find().sort('-created').populate('user', 'displayName').exec(function (err, gls) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gls);
    }
  });
};

/**
 * Gl middleware
 */
exports.glByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Gl is invalid'
    });
  }

  Gl.findById(id).populate('user', 'displayName').exec(function (err, gl) {
    if (err) {
      return next(err);
    } else if (!gl) {
      return res.status(404).send({
        message: 'No Gl with that identifier has been found'
      });
    }
    req.gl = gl;
    next();
  });
};
