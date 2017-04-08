'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Payment = mongoose.model('Payment'),
    Order = mongoose.model('Order'),
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
    next();
};

exports.frompayments = function(req, res, next){
    var trns = [];
    var oldtrns = [];
    var enddate = req.enddate;
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

exports.fromorders = function(req, res, next){
    var trns = [];
    var oldtrns = [];
    var enddate = req.enddate;
    Order.find({ docdate: { $gte: new Date(req.startdate), $lte: new Date(enddate) }, deliverystatus : 'complete' }).populate('items.product').populate('namedeliver').exec(function (err, orders) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            orders.forEach(function (order) {
                
                var totalAmt = 0;
                var totalCost = 0;
                order.items.forEach(function (itm) {
                    var saleAmt = itm.qty * itm.product.retailerprice;
                    var costAmt = (itm.qty * (itm.product.retailerprice - 10));
                    totalAmt += saleAmt;
                    totalCost += costAmt;
                    // เครดิต รายได้
                    var trnCredit = {
                        date: order.docdate,
                        trnsno: 'ARR' + order.docno,
                        accountno: '4110000',
                        accountname: 'รายได้ขายข้าว',
                        des: itm.product.name,
                        debit: 0,
                        credit: saleAmt
                    };
                    trns.push(trnCredit);
                    //เดบิต ต้นทุน
                    var trnDebit = {
                        date: order.docdate,
                        trnsno: 'APR' + order.docno,
                        accountno: '5020000',
                        accountname: 'ต้นทุนซื้อข้าวสาร',
                        des: itm.product.name,
                        debit: costAmt,
                        credit: 0
                    };
                    trns.push(trnDebit);
                });
                // เดบิต ลูกหนี้การค้า
                var trnAR = {
                        date: order.docdate,
                        trnsno: 'ARR' + order.docno,
                        accountno: '1150000',
                        accountname: order.namedeliver.displayName,
                        des: 'รายการสั่งซื้อ เลขที่: ' + order.docno,
                        debit: totalAmt,
                        credit: 0
                    };
                    trns.push(trnAR);  
                
                // เครดิต เจ้าหนี้การค้า
                var trnAP = {
                        date: order.docdate,
                        trnsno: 'APR' + order.docno,
                        accountno: '2110001',
                        accountname: 'บ. ธรรมธุรกิจชาวนาธรรมชาติสันป่าตอง',
                        des: 'รายการสั่งซื้อ เลขที่: ' + order.docno,
                        debit: 0,
                        credit: totalCost
                    };
                    trns.push(trnAP); 
            });
            req.trns = trns;
            Order.find({ docdate: { $lt: new Date(req.startdate) } , deliverystatus : 'complete' }).populate('items.product').populate('namedeliver').exec(function (err, oldorders) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    oldorders.forEach(function (oldorder) {
                        var totalAmt = 0;
                var totalCost = 0;
                oldorder.items.forEach(function (itm) {
                    var saleAmt = itm.qty * itm.product.retailerprice;
                    var costAmt = (itm.qty * (itm.product.retailerprice - 10));
                    totalAmt += saleAmt;
                    totalCost += costAmt;
                    // เครดิต รายได้
                    var trnCredit = {
                        date: oldorder.docdate,
                        trnsno: 'ARR' + oldorder.docno,
                        accountno: '4110000',
                        accountname: 'รายได้ขายข้าว',
                        des: itm.product.name,
                        debit: 0,
                        credit: saleAmt
                    };
                    oldtrns.push(trnCredit);
                    //เดบิต ต้นทุน
                    var trnDebit = {
                        date: oldorder.docdate,
                        trnsno: 'APR' + oldorder.docno,
                        accountno: '5020000',
                        accountname: 'ต้นทุนซื้อข้าวสาร',
                        des: itm.product.name,
                        debit: costAmt,
                        credit: 0
                    };
                    oldtrns.push(trnDebit);
                });
                // เดบิต ลูกหนี้การค้า
                var trnAR = {
                        date: oldorder.docdate,
                        trnsno: 'ARR' + oldorder.docno,
                        accountno: '1150000',
                        accountname: oldorder.namedeliver.displayName,
                        des: 'รายการสั่งซื้อ เลขที่: ' + oldorder.docno,
                        debit: totalAmt,
                        credit: 0
                    };
                    oldtrns.push(trnAR);  
                
                // เครดิต เจ้าหนี้การค้า
                var trnAP = {
                        date: oldorder.docdate,
                        trnsno: 'APR' + oldorder.docno,
                        accountno: '2110001',
                        accountname: 'บ. ธรรมธุรกิจชาวนาธรรมชาติสันป่าตอง',
                        des: 'รายการสั่งซื้อ เลขที่: ' + oldorder.docno,
                        debit: 0,
                        credit: totalCost
                    };
                    oldtrns.push(trnAP); 
                    });
                    req.oldtrns = oldtrns;
                    next();
                }

            });

        }

    });
};

exports.ledgerCooking = function (req, res, next) {
    Accountchart.find().sort('accountno').exec(function (err, accountcharts) {
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
            req.accntcharts = accntcharts;
            next();
        }
    });
};

exports.ledgers = function (req, res) {

    res.jsonp({
        startdate: req.startdate,
        enddate: req.enddate,
        accounts: req.accntcharts
    });

};

exports.expenses = function (req, res) {
    var listexpenser = [];
    req.accntcharts.forEach(function (acc) {
        if (acc.account.accountno.substr(0, 1) === '5') {
            listexpenser.push(acc);
        }
    });
    res.jsonp({
        startdate: req.startdate,
        enddate: req.enddate,
        accounts: listexpenser
    });
};

exports.revenues = function (req, res) {
    var listrevenues = [];
    req.accntcharts.forEach(function (acc) {
        if (acc.account.accountno.substr(0, 1) === '4') {
            listrevenues.push(acc);
        }
    });
    res.jsonp({
        startdate: req.startdate,
        enddate: req.enddate,
        accounts: listrevenues
    });
};

exports.statementincomesCooking = function (req, res, next) {
    var listsaleincome = [];
    var listcostsell = [];
    var summarySaleIncome = 0;
    var summaryCostsell = 0;
    var summaryotherincome = 0;
    var summaryothercost = 0;
    var summaryinterestcost = 0;
    req.accntcharts.forEach(function (acc) {
        if (acc.account.accountno.substr(0, 2) === '41' && acc.account.accountno.substr(0, 3) !== '410') {
            listsaleincome.push({
                accountname: acc.account.accountname,
                summary: acc.sumcredit - acc.sumdebit
            });
            summarySaleIncome += acc.sumcredit - acc.sumdebit;
        }
        if (acc.account.accountno.substr(0, 2) === '42') {
            summaryotherincome += acc.sumcredit - acc.sumdebit;
        }

        if (acc.account.accountno.substr(0, 2) === '50' && acc.account.accountno.substr(0, 3) !== '500') {
            listcostsell.push({
                accountname: acc.account.accountname,
                bfsummary: acc.bfsumdebit - acc.bfsumcredit, //สินค้าคงเหลือต้นงวด
                summary: acc.sumdebit - acc.sumcredit, //ซื้อในงวด
                cursummary: (acc.bfsumdebit - acc.bfsumcredit) + (acc.sumdebit - acc.sumcredit),//สินค้าคงเหลือปลายงวด
                afsummary: acc.sumdebit - acc.sumcredit // ต้นทุนสินค้าในงวด = สินค้าคงเหลือต้นงวด+ซื้อในงวด-สินค้าคงเหลือปลายงวด
            });
            summaryCostsell += acc.sumdebit - acc.sumcredit;// ต้นทุนสินค้าในงวด = สินค้าคงเหลือต้นงวด+ซื้อในงวด-สินค้าคงเหลือปลายงวด
        }

        if (acc.account.accountno.substr(0, 2) === '51') {
            summaryothercost += acc.sumdebit - acc.sumcredit;
        }
        if (acc.account.accountno.substr(0, 2) === '52') {
            summaryinterestcost += acc.sumdebit - acc.sumcredit;
        }

    });
    // ทุน
    req.costsell = {
        trns: listcostsell,
        summary: summaryCostsell
    };
    //  รายได้อื่นๆ
    req.otherincome = summaryotherincome;
    // รายได้
    req.saleincome = {
        trns: listsaleincome,
        summary: summarySaleIncome
    };
    // ค่าใช้จ่ายอื่นๆ
    req.othercost = summaryothercost;
    // หัก ดอกเบี้ยจ่าย
    req.interestcost = summaryinterestcost;
    // 	กำไรขั้นต้น	
    req.grossprofit = summarySaleIncome - summaryCostsell;
    // กำไร (ขาดทุน) จากการดำเนินงาน
    req.grossprofitwithoutotherincome = (summarySaleIncome - summaryCostsell) - summaryothercost;
    // กำไร (ขาดทุน) สุทธิก่อนหักดอกเบี้ย
    req.grossprofitwithoutinterest = ((summarySaleIncome - summaryCostsell) - summaryothercost) + summaryotherincome;
    // กำไร (ขาดทุน) สุทธิ	
    req.netprofit = (((summarySaleIncome - summaryCostsell) - summaryothercost) + summaryotherincome) - summaryinterestcost;
    next();
};

exports.statementincomes = function (req, res) {

    res.jsonp({
        startdate: req.startdate,
        enddate: req.enddate,
        data: {
            saleincome: req.saleincome,
            costsell: req.costsell,
            otherincome: req.otherincome,
            othercost: req.othercost,
            interestcost: req.interestcost,
            grossprofit: req.grossprofit,
            grossprofitwithoutotherincome: req.grossprofitwithoutotherincome,
            grossprofitwithoutinterest: req.grossprofitwithoutinterest,
            netprofit: req.netprofit
        }
    });
};


exports.balanceCooking = function (req, res, next) {
    var listasset = [];
    var listpayable = [];
    var listinvestment = [];
    var summaryAsset = 0;
    var summaryPayable = 0;
    var summaryInvestment = 0;
    req.accntcharts.forEach(function (acc) {
        if (acc.account.accountno.substr(0, 1) === '1' && acc.account.accountno.substr(4, 3) === '000') {
            // console.log(acc);

            var fncSummaryByCate1 = function () {
                var result = 0;
                req.accntcharts.forEach(function (itm) {
                    if (acc.account.accountno.substr(0, 3) === itm.account.accountno.substr(0, 3)) {
                        result += (itm.bfsumdebit - itm.bfsumcredit) + (itm.sumdebit - itm.sumcredit);
                    }
                });
                return result;
            };
            var summaryByCate1 = fncSummaryByCate1();

            listasset.push({
                accountno: acc.account.accountno,
                accountname: acc.account.accountname,
                summary: summaryByCate1
            });

            summaryAsset += summaryByCate1;
        }
        if (acc.account.accountno.substr(0, 2) === '21' && acc.account.accountno.substr(4, 3) === '000') {
            // console.log(acc);

            var fncSummaryByCate2 = function () {
                var result = 0;
                req.accntcharts.forEach(function (itm) {
                    if (acc.account.accountno.substr(0, 3) === itm.account.accountno.substr(0, 3)) {
                        result += (itm.bfsumcredit - itm.bfsumdebit) + (itm.sumcredit - itm.sumdebit);
                    }
                });
                return result;
            };
            var summaryByCate2 = fncSummaryByCate2();

            listpayable.push({
                accountno: acc.account.accountno,
                accountname: acc.account.accountname,
                summary: summaryByCate2
            });

            summaryPayable += summaryByCate2;
        }
        if (acc.account.accountno.substr(0, 2) === '31' && acc.account.accountno.substr(4, 3) === '000') {
            // console.log(acc);

            var fncSummaryByCate3 = function () {
                var result = 0;
                req.accntcharts.forEach(function (itm) {
                    if (acc.account.accountno.substr(0, 3) === itm.account.accountno.substr(0, 3)) {
                        if(acc.account.accountno.substr(0, 3) === '312'){
                            result = req.netprofit;
                        }else
                        {
                            result += (itm.bfsumcredit - itm.bfsumdebit) + (itm.sumcredit - itm.sumdebit);
                        }
                        
                    }
                });
                return result;
            };
            var summaryByCate3 = fncSummaryByCate3();

            listinvestment.push({
                accountno: acc.account.accountno,
                accountname: acc.account.accountname,
                summary: summaryByCate3
            });

            summaryInvestment += summaryByCate3;
        }
    });
    req.assets = {
        trns: listasset,
        summary: summaryAsset
    };
    req.payable = {
        trns: listpayable,
        summary: summaryPayable
    };
    req.investment = {
        trns: listinvestment,
        summary: summaryInvestment
    };
    next();
};

exports.balance = function (req, res) {

    res.jsonp({
        startdate: req.startdate,
        enddate: req.enddate,
        data: {
            assets: req.assets,
            payable: req.payable,
            investment: req.investment
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
            var sumdebit = 0;
            var sumcredit = 0;
            var trns = [];
            types.forEach(function (type) {
                sumdebit = 0;
                sumcredit = 0;
                trns = [];
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
                });
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