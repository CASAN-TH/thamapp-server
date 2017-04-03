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
    var oldtrns = [];

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
            Payment.find({ docdate: { $lt: new Date(req.startdate) } }).populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, oldpayments) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    oldpayments.forEach(function (oldpayment) {
                        oldpayment.debits.forEach(function (debit) {
                            var otrn = {
                                date: oldpayment.docdate,
                                trnsno: oldpayment.docno,
                                accountno: debit.account.accountno,
                                accountname: debit.account.accountname,
                                des: debit.description,
                                debit: debit.amount,
                                credit: 0
                            };
                            oldtrns.push(otrn);
                        });
                        oldpayment.credits.forEach(function (credit) {
                            var otrn = {
                                date: oldpayment.docdate,
                                trnsno: oldpayment.docno,
                                accountno: credit.account.accountno,
                                accountname: credit.account.accountname,
                                des: credit.description,
                                debit: 0,
                                credit: credit.amount
                            };
                            oldtrns.push(otrn);
                        });
                    });
                    req.oldtrns = oldtrns;
                    next();
                }

            });

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
                var sumdebit = 0;
                var sumcredit = 0;
                var bfsumdebit = 0;
                var bfsumcredit = 0;
                req.trns.forEach(function (trn) {
                    if (trn.accountno === accountchart.accountno) {
                        transetions.push(trn);
                        sumdebit += trn.debit || 0;
                        sumcredit += trn.credit || 0;
                    }
                });
                req.oldtrns.forEach(function (otrn) {
                    if (otrn.accountno === accountchart.accountno) {
                        bfsumdebit += otrn.debit || 0;
                        bfsumcredit += otrn.credit || 0;
                    }
                });
                var accntchart = {
                    account: accountchart,
                    trns: transetions,
                    bfsumdebit: bfsumdebit || 0,
                    bfsumcredit: bfsumcredit || 0,
                    sumdebit: sumdebit || 0,
                    sumcredit: sumcredit || 0,
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

exports.jrenddate = function (req, res, next, jrenddate) {
    req.jrenddate = jrenddate;
    req.jrstartdate = req.jrstartdate;
    var types = ['AP', 'AR', 'PV', 'RV', 'JV'];
    var journals = [];

    Payment.find({ docdate: { $gte: new Date(req.jrstartdate), $lte: new Date(req.jrenddate) } }).populate('user', 'displayName').populate('debits.account').populate('credits.account').exec(function (err, payments) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var trns = [];
            types.forEach(function (type) {
                var sumdebit = 0;
                var sumcredit = 0;
                payments.forEach(function (payment) {
                    if (type === payment.gltype) {
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
                            sumdebit += debit.amount;

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
                            sumcredit += credit.amount;
                        });

                    }
                    var journal = {
                        gltype: type,
                        trns: trns,
                        bfsumdebit: 0,
                        bfsumcredit: 0,
                        sumdebit: sumdebit,
                        sumcredit: sumcredit
                    };
                    journals.push(journal);
                });
            });
            req.journals = journals;
            next();
        }
    });


};
exports.journals = function (req, res) {
    res.jsonp({
        jrstartdate: req.jrstartdate,
        jrenddate: req.jrenddate,
        journals: req.journals
    });
};