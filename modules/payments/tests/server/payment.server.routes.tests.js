'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Payment = mongoose.model('Payment'),
    Accountchart = mongoose.model('Accountchart'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    payment,
    payment2,
    paymenttest,
    paymenttest2,
    paymenttest3,
    accountchart,
    accountchart1,
    accountchart109,
    accountchart4,
    accountchart41,
    accountchart411,
    accountchart42,
    accountchart5,
    accountchart51,
    accountchart52,
    accountchart412,
    accountchart502,
    accountchart503;

/**
 * Payment routes tests
 */
describe('Payment CRUD tests', function () {

    before(function (done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });
        accountchart = new Accountchart({
            accountno: '1234567',
            accountname: 'Account Name',
            user: user
        });
        accountchart1 = new Accountchart({
            accountno: '1000000',
            accountname: 'Balance',
            user: user
        });
        accountchart109 = new Accountchart({
            accountno: '1009000',
            accountname: 'Balance',
            user: user
        });
        accountchart4 = new Accountchart({
            accountno: '4000000',
            accountname: 'Income',
            user: user
        });
        accountchart41 = new Accountchart({
            accountno: '4100000',
            accountname: 'saleIncome',
            user: user
        });
        accountchart411 = new Accountchart({
            accountno: '4110001',
            accountname: 'saleIncome',
            user: user
        });
        accountchart412 = new Accountchart({
            accountno: '4120000',
            accountname: 'saleIncome',
            user: user
        });
        accountchart42 = new Accountchart({
            accountno: '4200000',
            accountname: 'saleIncome',
            user: user
        });
        accountchart5 = new Accountchart({
            accountno: '5000000',
            accountname: 'Expense',
            user: user
        });
        accountchart51 = new Accountchart({
            accountno: '5100000',
            accountname: 'Expense',
            user: user
        });
        accountchart502 = new Accountchart({
            accountno: '5020000',
            accountname: 'Expense',
            user: user
        });
        accountchart503 = new Accountchart({
            accountno: '5030000',
            accountname: 'Expense',
            user: user
        });
        accountchart52 = new Accountchart({
            accountno: '5200000',
            accountname: 'Expense',
            user: user
        });
        payment2 = new Payment({
            docno: 'AP201704',
            user: user
        });


        // Save a user to the test db and create new Payment
        user.save(function () {
            accountchart1.save();
            accountchart109.save();
            accountchart4.save();
            accountchart41.save();
            accountchart411.save();
            accountchart42.save();
            accountchart5.save();
            accountchart51.save();
            accountchart52.save();
            accountchart412.save();
            accountchart502.save();
            accountchart503.save();
            accountchart.save(function () {
                payment = {
                    docno: 'AP201703',
                    docdate: '2017-03-17T04:49:37.653Z',
                    gltype: 'AP',
                    user: user
                };
                done();
            });
        });
    });

    it('should be able to save a Payment if logged in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Savea new Payment
                agent.post('/api/payments')
                    .send(payment)
                    .expect(200)
                    .end(function (paymentSaveErr, paymentSaveRes) {
                        // Handle Payment save error
                        if (paymentSaveErr) {
                            return done(paymentSaveErr);
                        }

                        // Get a list of Payments
                        agent.get('/api/payments')
                            .end(function (paymentsGetErr, paymentsGetRes) {
                                // Handle Payments save error
                                if (paymentsGetErr) {
                                    return done(paymentsGetErr);
                                }

                                // Get Payments list
                                var payments = paymentsGetRes.body;

                                // Set assertions
                                (payments[0].user._id).should.equal(userId);
                                (payments[0].docno).should.match('AP201703001');
                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save an Payment if not logged in', function (done) {
        agent.post('/api/payments')
            .send(payment)
            .expect(403)
            .end(function (paymentSaveErr, paymentSaveRes) {
                // Call the assertion callback
                done(paymentSaveErr);
            });
    });

    it('should not be able to save an Payment if docno is not duplicated', function (done) {

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;
                // Save a new payment
                agent.post('/api/payments')
                    .send(payment)
                    .expect(200)
                    .end(function (paymentSaveErr, paymentSaveRes) {
                        // Handle payment save error
                        if (paymentSaveErr) {
                            return done(paymentSaveErr);
                        }
                        // Save a new payment
                        agent.post('/api/payments')
                            .send(payment2)
                            .expect(200)
                            .end(function (paymentSaveErr, paymentSaveRes) {
                                // Handle payment save error
                                if (paymentSaveErr) {
                                    return done(paymentSaveErr);
                                }
                                agent.post('/api/payments')
                                    .send(payment)
                                    .expect(200)
                                    .end(function (paymentSaveErr, paymentSaveRes) {
                                        // Set message assertion
                                        // (paymentSaveRes.body.message.toLowerCase()).should.endWith('docno already exists');

                                        // Handle company save error
                                        done();
                                    });
                            });

                    });

            });
    });

    it('should not be able to save an Payment if no docno is provided', function (done) {
        // Invalidate name field
        payment.docno = '';

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Payment
                agent.post('/api/payments')
                    .send(payment)
                    .expect(200)
                    .end(function (paymentSaveErr, paymentSaveRes) {
                        // Set message assertion
                        // (paymentSaveRes.body[0].docno).should.match('001');

                        // Handle Payment save error
                        done(paymentSaveErr);
                    });
            });
    });

    it('should be able to update an Payment if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Payment
                agent.post('/api/payments')
                    .send(payment)
                    .expect(200)
                    .end(function (paymentSaveErr, paymentSaveRes) {
                        // Handle Payment save error
                        if (paymentSaveErr) {
                            return done(paymentSaveErr);
                        }

                        // Update Payment name
                        payment.docno = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update an existing Payment
                        agent.put('/api/payments/' + paymentSaveRes.body._id)
                            .send(payment)
                            .expect(200)
                            .end(function (paymentUpdateErr, paymentUpdateRes) {
                                // Handle Payment update error
                                if (paymentUpdateErr) {
                                    return done(paymentUpdateErr);
                                }

                                // Set assertions
                                (paymentUpdateRes.body._id).should.equal(paymentSaveRes.body._id);
                                (paymentUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Payments if not signed in', function (done) {
        // Create new Payment model instance
        var paymentObj = new Payment(payment);

        // Save the payment
        paymentObj.save(function () {
            // Request Payments
            request(app).get('/api/payments')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should be able to get a single Payment if not signed in', function (done) {
        // Create new Payment model instance
        var paymentObj = new Payment(payment);

        // Save the Payment
        paymentObj.save(function () {
            request(app).get('/api/payments/' + paymentObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Object).and.have.property('docno', payment.docno);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should return proper error for single Payment with an invalid Id, if not signed in', function (done) {
        // test is not a valid mongoose Id
        request(app).get('/api/payments/test')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Payment is invalid');

                // Call the assertion callback
                done();
            });
    });

    it('should return proper error for single Payment which doesnt exist, if not signed in', function (done) {
        // This is a valid mongoose Id but a non-existent Payment
        request(app).get('/api/payments/559e9cd815f80b4c256a8f41')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Payment with that identifier has been found');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete an Payment if signed in', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Payment
                agent.post('/api/payments')
                    .send(payment)
                    .expect(200)
                    .end(function (paymentSaveErr, paymentSaveRes) {
                        // Handle Payment save error
                        if (paymentSaveErr) {
                            return done(paymentSaveErr);
                        }

                        // Delete an existing Payment
                        agent.delete('/api/payments/' + paymentSaveRes.body._id)
                            .send(payment)
                            .expect(200)
                            .end(function (paymentDeleteErr, paymentDeleteRes) {
                                // Handle payment error error
                                if (paymentDeleteErr) {
                                    return done(paymentDeleteErr);
                                }

                                // Set assertions
                                (paymentDeleteRes.body._id).should.equal(paymentSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete an Payment if not signed in', function (done) {
        // Set Payment user
        payment.user = user;

        // Create new Payment model instance
        var paymentObj = new Payment(payment);

        // Save the Payment
        paymentObj.save(function () {
            // Try deleting Payment
            request(app).delete('/api/payments/' + paymentObj._id)
                .expect(403)
                .end(function (paymentDeleteErr, paymentDeleteRes) {
                    // Set message assertion
                    (paymentDeleteRes.body.message).should.match('User is not authorized');

                    // Handle Payment error error
                    done(paymentDeleteErr);
                });

        });
    });

    it('should be able to get a single Payment that has an orphaned user reference', function (done) {
        // Create orphan user creds
        var _creds = {
            username: 'orphan',
            password: 'M3@n.jsI$Aw3$0m3'
        };

        // Create orphan user
        var _orphan = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'orphan@test.com',
            username: _creds.username,
            password: _creds.password,
            provider: 'local'
        });

        _orphan.save(function (err, orphan) {
            // Handle save error
            if (err) {
                return done(err);
            }

            agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) {
                        return done(signinErr);
                    }

                    // Get the userId
                    var orphanId = orphan._id;

                    // Save a new Payment
                    agent.post('/api/payments')
                        .send(payment)
                        .expect(200)
                        .end(function (paymentSaveErr, paymentSaveRes) {
                            // Handle Payment save error
                            if (paymentSaveErr) {
                                return done(paymentSaveErr);
                            }

                            // Set assertions on new Payment
                            (paymentSaveRes.body.docno).should.equal(payment.docno + '001');
                            should.exist(paymentSaveRes.body.user);
                            should.equal(paymentSaveRes.body.user._id, orphanId);

                            // force the Payment to have an orphaned user reference
                            orphan.remove(function () {
                                // now signin with valid user
                                agent.post('/api/auth/signin')
                                    .send(credentials)
                                    .expect(200)
                                    .end(function (err, res) {
                                        // Handle signin error
                                        if (err) {
                                            return done(err);
                                        }

                                        // Get the Payment
                                        agent.get('/api/payments/' + paymentSaveRes.body._id)
                                            .expect(200)
                                            .end(function (paymentInfoErr, paymentInfoRes) {
                                                // Handle Payment error
                                                if (paymentInfoErr) {
                                                    return done(paymentInfoErr);
                                                }

                                                // Set assertions
                                                (paymentInfoRes.body._id).should.equal(paymentSaveRes.body._id);
                                                (paymentInfoRes.body.docno).should.equal(payment.docno + '001');
                                                should.equal(paymentInfoRes.body.user, undefined);

                                                // Call the assertion callback
                                                done();
                                            });
                                    });
                            });
                        });
                });
        });
    });

    it('ledger report', function (done) {
        var startdate = '2017-03-01';
        var enddate = '2017-03-31';
        paymenttest2 = new Payment({
            docno: 'AP201703022',
            docdate: '2017-02-17T04:49:37.653Z',
            gltype: 'AP',
            credits: [{
                account: accountchart1,
                description: 'ทดสอบ',
                amount: 200
            }],
            debits: [{
                account: accountchart1,
                description: 'ทดสอบ',
                amount: 200
            }],
            user: user
        });
        paymenttest3 = new Payment({
            docno: 'AP201703033',
            docdate: '2017-01-17T04:49:37.653Z',
            gltype: 'AP',
            credits: [{
                account: accountchart1,
                description: 'ทดสอบ',
                amount: 200
            }],
            debits: [{
                account: accountchart1,
                description: 'ทดสอบ',
                amount: 200
            }],
            user: user
        });
        paymenttest = new Payment({
            docno: 'AP201703001',
            docdate: '2017-03-17T04:49:37.653Z',
            gltype: 'AP',
            credits: [{
                account: accountchart1,
                description: 'ทดสอบ',
                amount: 200
            }],
            debits: [{
                account: accountchart1,
                description: 'ทดสอบ',
                amount: 200
            }],
            user: user
        });
        paymenttest2.save();
        paymenttest3.save();
        paymenttest.save(function () {
            agent.get('/api/ledgers/' + startdate + '/' + enddate)
                .expect(200)
                .end(function (paymentInfoErr, paymentInfoRes) {
                    // Handle Payment error
                    if (paymentInfoErr) {
                        return done(paymentInfoErr);
                    }

                    // Set assertions
                    (paymentInfoRes.body.startdate).should.equal('2017-03-01');
                    (paymentInfoRes.body.enddate).should.equal('2017-03-31');
                    // (paymentInfoRes.body.accounts.length).should.equal(1);
                    (paymentInfoRes.body.accounts[0].account.accountno).should.equal('1000000');
                    (paymentInfoRes.body.accounts[0].account.accountname).should.equal('Balance');
                    (paymentInfoRes.body.accounts[0].trns.length).should.equal(2);
                    (paymentInfoRes.body.accounts[0].trns[0].trnsno).should.equal('AP201703001');
                    (paymentInfoRes.body.accounts[0].trns[0].accountno).should.equal('1000000');
                    (paymentInfoRes.body.accounts[0].trns[0].accountname).should.equal('Balance');
                    (paymentInfoRes.body.accounts[0].sumcredit).should.equal(200);
                    (paymentInfoRes.body.accounts[0].sumdebit).should.equal(200);
                    (paymentInfoRes.body.accounts[0].bfsumdebit).should.equal(400);
                    (paymentInfoRes.body.accounts[0].bfsumcredit).should.equal(400);

                    // Call the assertion callback
                    done();
                });
        });
    });

    // it('expense report', function (done) {
    //     var startdate = '2017-03-01';
    //     var enddate = '2017-03-31';
    //     paymenttest2 = new Payment({
    //         docno: 'AP201703026',
    //         docdate: '2017-03-17T04:49:37.653Z',
    //         gltype: 'AP',
    //         credits: [{
    //             account: accountchart4,
    //             description: 'ทดสอบ',
    //             amount: 200
    //         }],
    //         debits: [{
    //             account: accountchart5,
    //             description: 'ทดสอบ',
    //             amount: 200
    //         }],
    //         user: user
    //     });
    //     paymenttest2.save(function () {
    //         agent.get('/api/expenses/' + startdate + '/' + enddate)
    //             .expect(200)
    //             .end(function (paymentInfoErr, paymentInfoRes) {
    //                 // Handle Payment error
    //                 if (paymentInfoErr) {
    //                     return done(paymentInfoErr);
    //                 }

    //                 // Set assertions
    //                 (paymentInfoRes.body.startdate).should.equal('2017-03-01');
    //                 (paymentInfoRes.body.enddate).should.equal('2017-03-31');
    //                 // (paymentInfoRes.body.accounts.length).should.equal(3);
    //                 (paymentInfoRes.body.accounts[0].trns[0].accountno.substring(0, 1)).should.equal('5');
    //                 done();
    //             });
    //     });
    // });

    // it('revenuereport report', function (done) {
    //     var startdate = '2017-03-01';
    //     var enddate = '2017-03-31';
    //     paymenttest2 = new Payment({
    //         docno: 'AP201703027',
    //         docdate: '2017-03-17T04:49:37.653Z',
    //         gltype: 'AP',
    //         credits: [{
    //             account: accountchart4,
    //             description: 'ทดสอบ',
    //             amount: 200
    //         }],
    //         debits: [{
    //             account: accountchart5,
    //             description: 'ทดสอบ',
    //             amount: 200
    //         }],
    //         user: user
    //     });
    //     paymenttest2.save(function () {
    //         agent.get('/api/revenues/' + startdate + '/' + enddate)
    //             .expect(200)
    //             .end(function (paymentInfoErr, paymentInfoRes) {
    //                 // Handle Payment error
    //                 if (paymentInfoErr) {
    //                     return done(paymentInfoErr);
    //                 }

    //                 // Set assertions
    //                 (paymentInfoRes.body.startdate).should.equal('2017-03-01');
    //                 (paymentInfoRes.body.enddate).should.equal('2017-03-31');
    //                 // (paymentInfoRes.body.accounts.length).should.equal(4);
    //                 (paymentInfoRes.body.accounts[0].trns[0].accountno.substring(0, 1)).should.equal('4');

    //                 // Call the assertion callback
    //                 done();
    //             });
    //     });
    // });

    // it('statementincomereport report', function (done) {
    //     var startdate = '2017-03-01';
    //     var enddate = '2017-03-31';
    //     paymenttest2 = new Payment({
    //         docno: 'AP201703027',
    //         docdate: '2017-03-17T04:49:37.653Z',
    //         gltype: 'AP',
    //         credits: [{
    //             account: accountchart411,
    //             description: 'ทดสอบ',
    //             amount: 200
    //         }, {
    //                 account: accountchart412,
    //                 description: 'ทดสอบ',
    //                 amount: 200
    //             }, {
    //                 account: accountchart42,
    //                 description: 'ทดสอบ',
    //                 amount: 200
    //             }],
    //         debits: [{
    //             account: accountchart502,
    //             description: 'ทดสอบ',
    //             amount: 200
    //         }, {
    //                 account: accountchart503,
    //                 description: 'ทดสอบ',
    //                 amount: 200
    //             }, {
    //                 account: accountchart51,
    //                 description: 'ทดสอบ',
    //                 amount: 200
    //             }, {
    //                 account: accountchart52,
    //                 description: 'ทดสอบ',
    //                 amount: 200
    //             }],
    //         user: user
    //     });
    //     paymenttest2.save(function () {
    //         agent.get('/api/statementincomes/' + startdate + '/' + enddate)
    //             .expect(200)
    //             .end(function (paymentInfoErr, paymentInfoRes) {
    //                 // Handle Payment error
    //                 if (paymentInfoErr) {
    //                     return done(paymentInfoErr);
    //                 }

    //                 // Set assertions
    //                 (paymentInfoRes.body.startdate).should.equal('2017-03-01');
    //                 (paymentInfoRes.body.enddate).should.equal('2017-03-31');
    //                 (paymentInfoRes.body.data.saleincome.trns.length).should.equal(2);
    //                 (paymentInfoRes.body.data.saleincome.summary).should.equal(400);
    //                 (paymentInfoRes.body.data.costsell.trns.length).should.equal(2);
    //                 (paymentInfoRes.body.data.costsell.summary).should.equal(400);
    //                 (paymentInfoRes.body.data.otherincome).should.equal(200);
    //                 (paymentInfoRes.body.data.othercost).should.equal(200);
    //                 (paymentInfoRes.body.data.interestcost).should.equal(200);
    //                 (paymentInfoRes.body.data.grossprofit).should.equal(0);
    //                 (paymentInfoRes.body.data.grossprofitwithoutotherincome).should.equal(-200);
    //                 (paymentInfoRes.body.data.grossprofitwithoutinterest).should.equal(0);
    //                 (paymentInfoRes.body.data.netprofit).should.equal(-200);

    //                 // (paymentInfoRes.body.accounts[0].trns[0].accountno.substring(0, 1)).should.equal('4');

    //                 // Call the assertion callback
    //                 done();
    //             });
    //     });
    // });

    it('balance report', function (done) {
        var startdate = '2017-03-01';
        var enddate = '2017-03-31';
        paymenttest2 = new Payment({
            docno: 'AP201703027',
            docdate: '2017-03-17T04:49:37.653Z',
            gltype: 'AP',
            credits: [{
                account: accountchart1,
                description: 'ทดสอบ',
                amount: 200
            },
                {
                    account: accountchart109,
                    description: 'ทดสอบ',
                    amount: 200
                }],
            debits: [{
                account: accountchart502,
                description: 'ทดสอบ',
                amount: 200
            }, {
                    account: accountchart503,
                    description: 'ทดสอบ',
                    amount: 200
                }, {
                    account: accountchart51,
                    description: 'ทดสอบ',
                    amount: 200
                }, {
                    account: accountchart52,
                    description: 'ทดสอบ',
                    amount: 200
                }],
            user: user
        });
        paymenttest2.save(function () {
            agent.get('/api/balance/' + startdate + '/' + enddate)
                .expect(200)
                .end(function (paymentInfoErr, paymentInfoRes) {
                    // Handle Payment error
                    if (paymentInfoErr) {
                        return done(paymentInfoErr);
                    }

                    // Set assertions
                    (paymentInfoRes.body.startdate).should.equal('2017-03-01');
                    (paymentInfoRes.body.enddate).should.equal('2017-03-31');
                    // (paymentInfoRes.body.data.costsell.trns.length).should.equal(2);
                    // (paymentInfoRes.body.data.costsell.summary).should.equal(400);
                    // (paymentInfoRes.body.data.otherincome).should.equal(200);
                    // (paymentInfoRes.body.data.othercost).should.equal(200);
                    // (paymentInfoRes.body.data.interestcost).should.equal(200);
                    // (paymentInfoRes.body.data.grossprofit).should.equal(0);
                    // (paymentInfoRes.body.data.grossprofitwithoutotherincome).should.equal(-200);
                    // (paymentInfoRes.body.data.grossprofitwithoutinterest).should.equal(0);
                    // (paymentInfoRes.body.data.netprofit).should.equal(-200);

                    // (paymentInfoRes.body.accounts[0].trns[0].accountno.substring(0, 1)).should.equal('4');

                    // Call the assertion callback
                    done();
                });
        });
    });

    xit('Journal report', function (done) {
        var jrstartdate = '2017-03-01';
        var jrenddate = '2017-03-31';
        paymenttest = new Payment({
            docno: 'AP201703001',
            docdate: '2017-03-17T04:49:37.653Z',
            gltype: 'AP',
            credits: [{
                account: accountchart,
                description: 'ทดสอบ',
                amount: 200
            }],
            debits: [{
                account: accountchart,
                description: 'ทดสอบ',
                amount: 200
            }],
            user: user
        });
        paymenttest.save(function () {
            agent.get('/api/journals/' + jrstartdate + '/' + jrenddate)
                .expect(200)
                .end(function (paymentInfoErr, paymentInfoRes) {
                    // Handle Payment error
                    if (paymentInfoErr) {
                        return done(paymentInfoErr);
                    }

                    // Set assertions
                    // (paymentInfoRes.body).should.equal('');
                    (paymentInfoRes.body.jrstartdate).should.equal('2017-03-01');
                    (paymentInfoRes.body.jrenddate).should.equal('2017-03-31');
                    (paymentInfoRes.body.journals.length).should.equal(5);
                    (paymentInfoRes.body.journals[0].gltype).should.equal('AP');
                    (paymentInfoRes.body.journals[0].trns.length).should.equal(2);
                    (paymentInfoRes.body.journals[0].sumdebit).should.equal(200);
                    (paymentInfoRes.body.journals[0].sumcredit).should.equal(200);






                    // Call the assertion callback
                    done();
                });
        });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Accountchart.remove().exec(function () {
                Payment.remove().exec(done);
            });
        });
    });
});
