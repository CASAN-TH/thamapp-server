'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Payment = mongoose.model('Payment'),
    Accountchart = mongoose.model('Accountchart'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Payment
 */
exports.create = function (req, res) {
    var payment = new Payment(req.body);
    payment.user = req.user;
    var reqGltype = payment.gltype;
    var year = payment.docdate.getFullYear();
    var getmonth = payment.docdate.getMonth() + 1;
    var month = '';
    if (getmonth >= 10) {
        month = getmonth;
    } else {
        month = '0' + getmonth;
    }
    var genDocno = year + '' + month;
    Payment.find({ gltype: reqGltype }).sort('-docno').populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, payments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var reqDocno = reqGltype + genDocno;
            if (payments.length > 0) {
                var chkDoc = payment.docno.substr(0, 8);
                var chkResultDoc = payments[0].docno.substr(0, 8);
                if (chkDoc === chkResultDoc) {
                    var getDocno = payments[0].docno.substr(2, 9);
                    var calDocno = parseInt(getDocno) + 1;
                    payment.docno = payments[0].gltype + calDocno;
                } else {
                    var setDocno = '';

                    if (payments.length > 0) {
                        var setDoc = '';
                        var maxDoc = 0;
                        var getMaxs = [];
                        payments.forEach(function (pm) {
                            var pmDocno = pm.docno.substr(2, 6);
                            var countDocno = pm.docno.substr(2, 9);
                            if (genDocno.toString() === pmDocno.toString()) {
                                getMaxs.push(countDocno);
                            }
                        });
                        if (getMaxs.length > 0) {
                            getMaxs.forEach(function (max) {
                                if (maxDoc < max) {
                                    maxDoc = max;
                                }
                            });
                        } else {
                            maxDoc = genDocno + '000';
                        }
                        setDocno = payments[0].gltype + (parseInt(maxDoc) + 1);
                    } else {
                        setDocno = reqDocno + '001';
                    }
                    payment.docno = setDocno;
                }
            } else if (payments.length === 0) {
                payment.docno = reqGltype + genDocno + '001';
            }
            payment.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(payment);
                }
            });
        }
    });
};

/**
 * Show the current Payment
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var payment = req.payment ? req.payment.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    payment.isCurrentUserOwner = req.user && payment.user && payment.user._id.toString() === req.user._id.toString();

    res.jsonp(payment);
};

/**
 * Update a Payment
 */
exports.update = function (req, res) {
    var payment = req.payment;

    payment = _.extend(payment, req.body);

    payment.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(payment);
        }
    });
};

/**
 * Delete an Payment
 */
exports.delete = function (req, res) {
    var payment = req.payment;

    payment.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(payment);
        }
    });
};

/**
 * List of Payments
 */
exports.list = function (req, res) {
    Payment.find().sort('-created').populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, payments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(payments);
        }
    });
};

/**
 * Payment middleware
 */
exports.paymentByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Payment is invalid'
        });
    }

    Payment.findById(id).populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, payment) {
        if (err) {
            return next(err);
        } else if (!payment) {
            return res.status(404).send({
                message: 'No Payment with that identifier has been found'
            });
        }
        req.payment = payment;
        next();
    });
};

exports.paymentBydocno = function (req, res, next, docno) {
    Payment.find({ docno: docno }).populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, payment) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.payment = payment;
            next();
        }
    });
};

exports.docno = function (req, res) {
    var payment = req.payment ? req.payment : {};
    res.jsonp(payment);
};

exports.enddate = function (req, res, next, enddate) {
    req.enddate = enddate;
    req.startdate = req.startdate;
    var trns = [];

    Payment.find({ docdate: { $gte: new Date(req.startdate), $lte: new Date(enddate) } }).populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, payments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            
            payments.forEach(function (payment) {
                payment.debits.forEach(function (debit) {
                    var trn = {
                        date: payment.docdate,
                        trnsno: payment.docno,
                        accountno: debit.account.accountno,
                        accountname: debit.account.accountname,
                        des: debit.description,
                        debit: debit.amount,
                        credit: 0
                    };
                    trns.push(trn);
                });
                payment.credits.forEach(function (credit) {
                    var trn = {
                        date: payment.docdate,
                        trnsno: payment.docno,
                        accountno: credit.account.accountno,
                        accountname: credit.account.accountname,
                        des: credit.description,
                        debit: 0,
                        credit: credit.amount
                    };
                    trns.push(trn);
                });
            });
            req.trns = trns;
            next();
        }

    });

};

exports.ledgers = function (req, res) {
    Accountchart.find().exec(function (err, accountcharts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var accntcharts = [];

            accountcharts.forEach(function (accountchart) {
                var transetions = [];
                req.trns.forEach(function (trn) {
                    if (trn.accountno === accountcharts.accountno) {
                        transetions.push(trn);
                    }
                });
                var accntchart = {
                    account: accountchart,
                    trns: req.trns
                };
                accntcharts.push(accntchart);
            });
            res.jsonp({
                startdate: req.startdate,
                enddate: req.enddate,
                accounts: accntcharts
            });
        }
    });

};