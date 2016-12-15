'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Gl = mongoose.model('Gl'),
  Receiving = mongoose.model('Receiving'),
  Product = mongoose.model('Product'),
  Company = mongoose.model('Company'),
  Invoice = mongoose.model('Invoice'),
  Receipt = mongoose.model('Receipt'),
  Payment = mongoose.model('Payment'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  receivings,
  receiving,
  product,
  product2,
  company,
  invoice,
  receipt,
  payment,
  gl;

/**
 * Gl routes tests
 */
describe('Gl CRUD tests', function () {

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

    product = new Product({
      name: 'Product Name',
      description: 'Product Description',
      category: 'P',
      buyprice: 50,
      saleprice: 100,
      isincludevat: false,
      unitname: 'Product Unitname',
      saleaccount: 10005,
      buyaccount: 10001
    });

    company = new Company({
      name: 'Company Name',
      address: 'Company Address',
      taxid: 'Company TaxId',
      brunch: 'Company Brunch',
      telofficeno: 'Company TelOfficeNo',
      mobile: 'Company Mobile',
      faxno: 'Company FaxNo',
      email: 'Company Email',
      contact: 'Company Contact',
      website: 'Company Website',
      note: 'Company Note',
      accountno: '1001'
    });

    receiving = new Receiving({
      docno: 'Receiving docno',
      docdate: new Date(),
      refno: 'Receiving refno',
      client: company,
      items: [{
        product: product,
        qty: 1,
        unitprice: 100,
        amount: 100,
        vatamount: 7,
        whtamount: 0,
        totalamount: 107,
      }],
      creditday: 0,
      isincludevat: 0,
      amount: 100,
      discountamount: 0,
      amountafterdiscount: 0,
      vatamount: 7,
      totalamount: 107,
      user: user
    });

    invoice = new Invoice({
      docno: 'Invoice docno',
      docdate: new Date(),
      refno: 'Invoice refno',
      client: company,
      items: [{
        product: product,
        qty: 1,
        unitprice: 100,
        amount: 100,
        vatamount: 7,
        whtamount: 0,
        totalamount: 107,
      }],
      creditday: 0,
      isincludevat: 0,
      amount: 100,
      discountamount: 0,
      amountafterdiscount: 0,
      vatamount: 7,
      totalamount: 107,
      user: user
    });

    receipt = new Receipt({
      docno: 'Receipt docno',
      docdate: new Date(),
      refno: 'Receipt refno',
      client: company,
      items: [{
        product: product,
        qty: 1,
        unitprice: 100,
        amount: 100,
        vatamount: 7,
        whtamount: 0,
        totalamount: 107,
      }],
      creditday: 0,
      isincludevat: 0,
      amount: 100,
      discountamount: 0,
      amountafterdiscount: 0,
      vatamount: 7,
      totalamount: 107,
      receiptstated: '1001',
      user: user
    });

    payment = new Payment({
      docno: 'Payment docno',
      docdate: new Date(),
      refno: 'Payment refno',
      client: company,
      items: [{
        product: product,
        qty: 1,
        unitprice: 100,
        amount: 100,
        vatamount: 7,
        whtamount: 0,
        totalamount: 107,
      }],
      creditday: 0,
      isincludevat: 0,
      amount: 100,
      discountamount: 0,
      amountafterdiscount: 0,
      vatamount: 7,
      totalamount: 107,
      paymentstated: '1001',
      user: user
    });

    // Save a user to the test db and create new Receiving
    user.save(function () {
      gl = new Gl({
        batchno: '201612',
        transaction: [],
        status: 'O'
      });
      company.save(function () {
        product.save(function () {
          done();
        });
      });
    });
  });

  it('should be able to save a Gl if get receivings', function (done) {
    receiving.save(function () {
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

          // Save a new Gl
          agent.post('/api/gls')
            .send(gl)
            .expect(200)
            .end(function (glSaveErr, glSaveRes) {
              // Handle Gl save error
              if (glSaveErr) {
                return done(glSaveErr);
              }

              // Get a list of Gls
              agent.get('/api/gls')
                .end(function (glsGetErr, glsGetRes) {
                  // Handle Gls save error
                  if (glsGetErr) {
                    return done(glsGetErr);
                  }

                  // Get Gls list
                  var gls = glsGetRes.body;

                  // Set assertions debit with items
                  (gls[0].transaction[0].debit).should.match(receiving.items[0].amount);
                  (gls[0].transaction[0].credit).should.match(0);
                  (gls[0].transaction[0].actname).should.match(product.name);
                  (gls[0].transaction[0].date).should.match(receiving.docdate);
                  (gls[0].transaction[0].docno).should.match(receiving.docno);
                  // (gls[0].transaction[1].actno).should.match(product._id);

                  // Set assertions debit with vatamount
                  (gls[0].transaction[1].debit).should.match(receiving.vatamount);
                  (gls[0].transaction[1].credit).should.match(0);
                  (gls[0].transaction[1].actname).should.match('ภาษีซื้อ');
                  (gls[0].transaction[1].date).should.match(receiving.docdate);
                  (gls[0].transaction[1].docno).should.match(receiving.docno);
                  // (gls[0].transaction[2].actno).should.match('10000');

                  // Set assertions credit with client
                  (gls[0].user._id).should.equal(userId);
                  (gls[0].transaction.length).should.match(3);
                  (gls[0].transaction[2].debit).should.match(0);
                  (gls[0].transaction[2].credit).should.match(receiving.totalamount);
                  (gls[0].transaction[2].actname).should.match('เจ้าหนี้ - ' + company.name);
                  (gls[0].transaction[2].date).should.match(receiving.docdate);
                  (gls[0].transaction[2].docno).should.match(receiving.docno);
                  // (gls[0].transaction[0].actno).should.match(company._id);
                  // Call the assertion callback
                  Receiving.remove().exec(function () {
                    Gl.remove().exec(done);
                  });
                });
            });
        });

    });

  });

  it('should be able to save a Gl if get invoice', function (done) {
    invoice.save(function () {
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

          // Save a new Gl
          agent.post('/api/gls')
            .send(gl)
            .expect(200)
            .end(function (glSaveErr, glSaveRes) {
              // Handle Gl save error
              if (glSaveErr) {
                return done(glSaveErr);
              }

              // Get a list of Gls
              agent.get('/api/gls')
                .end(function (glsGetErr, glsGetRes) {
                  // Handle Gls save error
                  if (glsGetErr) {
                    return done(glsGetErr);
                  }

                  // Get Gls list
                  var gls = glsGetRes.body;

                  // Set assertions credit with client
                  (gls[0].user._id).should.equal(userId);
                  (gls[0].transaction.length).should.match(3);
                  (gls[0].transaction[0].debit).should.match(invoice.totalamount);
                  (gls[0].transaction[0].credit).should.match(0);
                  (gls[0].transaction[0].actname).should.match('ลูกหนี้ - ' + company.name);
                  (gls[0].transaction[0].date).should.match(invoice.docdate);
                  (gls[0].transaction[0].actno).should.match(company.accountno);

                  // Set assertions debit with items
                  (gls[0].transaction[1].debit).should.match(0);
                  (gls[0].transaction[1].credit).should.match(invoice.items[0].amount);
                  (gls[0].transaction[1].actname).should.match('รายได้จากการขาย - ' + product.name);
                  (gls[0].transaction[1].date).should.match(invoice.docdate);
                  (gls[0].transaction[1].actno).should.match(product.saleaccount);

                  // Set assertions debit with vatamount
                  (gls[0].transaction[2].debit).should.match(0);
                  (gls[0].transaction[2].credit).should.match(invoice.vatamount);
                  (gls[0].transaction[2].actname).should.match('ภาษีขาย');
                  (gls[0].transaction[2].date).should.match(invoice.docdate);
                  (gls[0].transaction[2].actno).should.match('20000');

                  // Call the assertion callback
                  Invoice.remove().exec(function () {
                    Gl.remove().exec(done);
                  });
                });
            });
        });
    });
  });

  it('should be able to save a Gl if get receipt', function (done) {
    receipt.save(function () {
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

          // Save a new Gl
          agent.post('/api/gls')
            .send(gl)
            .expect(200)
            .end(function (glSaveErr, glSaveRes) {
              // Handle Gl save error
              if (glSaveErr) {
                return done(glSaveErr);
              }

              // Get a list of Gls
              agent.get('/api/gls')
                .end(function (glsGetErr, glsGetRes) {
                  // Handle Gls save error
                  if (glsGetErr) {
                    return done(glsGetErr);
                  }

                  // Get Gls list
                  var gls = glsGetRes.body;
                  // Set assertions credit with client
                  (gls[0].user._id).should.equal(userId);
                  (gls[0].transaction.length).should.match(2);
                  (gls[0].transaction[0].debit).should.match(receipt.totalamount);
                  (gls[0].transaction[0].credit).should.match(0);
                  (gls[0].transaction[0].actname).should.match(receipt.receiptstated);
                  (gls[0].transaction[0].date).should.match(receipt.docdate);
                  (gls[0].transaction[0].actno).should.match(receipt.receiptstated);

                  // Set assertions debit with items
                  (gls[0].transaction[1].debit).should.match(0);
                  (gls[0].transaction[1].credit).should.match(receipt.totalamount);
                  (gls[0].transaction[1].actname).should.match('ลูกหนี้ - ' + company.name);
                  (gls[0].transaction[1].date).should.match(receipt.docdate);
                  (gls[0].transaction[1].actno).should.match(company.accountno);

                  // Set assertions debit with vatamount
                  // (gls[0].transaction[2].debit).should.match(0);
                  // (gls[0].transaction[2].credit).should.match(receipt.vatamount);
                  // (gls[0].transaction[2].actname).should.match('ภาษีขาย');
                  // (gls[0].transaction[2].date).should.match(receipt.docdate);
                  // (gls[0].transaction[2].actno).should.match('10000');

                  // Call the assertion callback
                  Receipt.remove().exec(function () {
                    Gl.remove().exec(done);
                  });
                });
            });
        });
    });
  });

  it('should be able to save a Gl if get payment', function (done) {
    payment.save(function () {
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

          // Save a new Gl
          agent.post('/api/gls')
            .send(gl)
            .expect(200)
            .end(function (glSaveErr, glSaveRes) {
              // Handle Gl save error
              if (glSaveErr) {
                return done(glSaveErr);
              }

              // Get a list of Gls
              agent.get('/api/gls')
                .end(function (glsGetErr, glsGetRes) {
                  // Handle Gls save error
                  if (glsGetErr) {
                    return done(glsGetErr);
                  }

                  // Get Gls list
                  var gls = glsGetRes.body;

                  // Set assertions credit with client

                  // debit ประเภทการรับเงิน
                  (gls[0].user._id).should.equal(userId);
                  (gls[0].transaction.length).should.match(2);
                  (gls[0].transaction[0].credit).should.match(0);
                  (gls[0].transaction[0].debit).should.match(payment.totalamount);
                  (gls[0].transaction[0].actname).should.match(company.name);
                  (gls[0].transaction[0].date).should.match(payment.docdate);
                  (gls[0].transaction[0].actno).should.match(company.accountno);

                  // Set assertions debit with items
                  (gls[0].transaction[1].credit).should.match(payment.totalamount);
                  (gls[0].transaction[1].debit).should.match(0);
                  (gls[0].transaction[1].actname).should.match(payment.paymentstated);
                  (gls[0].transaction[1].date).should.match(payment.docdate);
                  (gls[0].transaction[1].actno).should.match(payment.paymentstated);
                  // (gls[0].transaction[1].actno).should.match(product._id);

                  // Set assertions debit with vatamount
                  // (gls[0].transaction[10].debit).should.match(payment.vatamount);
                  // (gls[0].transaction[10].credit).should.match(0);
                  // (gls[0].transaction[10].actname).should.match('ภาษีซื้อ');
                  // (gls[0].transaction[10].date).should.match(payment.docdate);
                  // (gls[0].transaction[2].actno).should.match('10000');



                  // Call the assertion callback
                  Payment.remove().exec(function () {
                    Gl.remove().exec(done);
                  });
                });
            });
        });
    });
  });

  it('should not be able to save an Gl if not logged in', function (done) {
    agent.post('/api/gls')
      .send(gl)
      .expect(403)
      .end(function (glSaveErr, glSaveRes) {
        // Call the assertion callback
        done(glSaveErr);
      });
  });

  it('should not be able to save an Gl if no batchno is provided', function (done) {
    // Invalidate name field
    gl.batchno = '';

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

        // Save a new Gl
        agent.post('/api/gls')
          .send(gl)
          .expect(400)
          .end(function (glSaveErr, glSaveRes) {
            // Set message assertion
            (glSaveRes.body.message).should.match('Please fill Gl batchno');

            // Handle Gl save error
            done(glSaveErr);
          });
      });
  });

  it('should be able to update an Gl if signed in', function (done) {
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

        // Save a new Gl
        agent.post('/api/gls')
          .send(gl)
          .expect(200)
          .end(function (glSaveErr, glSaveRes) {
            // Handle Gl save error
            if (glSaveErr) {
              return done(glSaveErr);
            }

            // Update Gl name
            gl.batchno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Gl
            agent.put('/api/gls/' + glSaveRes.body._id)
              .send(gl)
              .expect(200)
              .end(function (glUpdateErr, glUpdateRes) {
                // Handle Gl update error
                if (glUpdateErr) {
                  return done(glUpdateErr);
                }

                // Set assertions
                (glUpdateRes.body._id).should.equal(glSaveRes.body._id);
                (glUpdateRes.body.batchno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Gls if not signed in', function (done) {
    // Create new Gl model instance
    var glObj = new Gl(gl);

    // Save the gl
    glObj.save(function () {
      // Request Gls
      request(app).get('/api/gls')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Gl if not signed in', function (done) {
    // Create new Gl model instance
    var glObj = new Gl(gl);

    // Save the Gl
    glObj.save(function () {
      request(app).get('/api/gls/' + glObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('batchno', gl.batchno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Gl with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/gls/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Gl is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Gl which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Gl
    request(app).get('/api/gls/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Gl with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Gl if signed in', function (done) {
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

        // Save a new Gl
        agent.post('/api/gls')
          .send(gl)
          .expect(200)
          .end(function (glSaveErr, glSaveRes) {
            // Handle Gl save error
            if (glSaveErr) {
              return done(glSaveErr);
            }

            // Delete an existing Gl
            agent.delete('/api/gls/' + glSaveRes.body._id)
              .send(gl)
              .expect(200)
              .end(function (glDeleteErr, glDeleteRes) {
                // Handle gl error error
                if (glDeleteErr) {
                  return done(glDeleteErr);
                }

                // Set assertions
                (glDeleteRes.body._id).should.equal(glSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Gl if not signed in', function (done) {
    // Set Gl user
    gl.user = user;

    // Create new Gl model instance
    var glObj = new Gl(gl);

    // Save the Gl
    glObj.save(function () {
      // Try deleting Gl
      request(app).delete('/api/gls/' + glObj._id)
        .expect(403)
        .end(function (glDeleteErr, glDeleteRes) {
          // Set message assertion
          (glDeleteRes.body.message).should.match('User is not authorized');

          // Handle Gl error error
          done(glDeleteErr);
        });

    });
  });

  it('should be able to get a single Gl that has an orphaned user reference', function (done) {
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

          // Save a new Gl
          agent.post('/api/gls')
            .send(gl)
            .expect(200)
            .end(function (glSaveErr, glSaveRes) {
              // Handle Gl save error
              if (glSaveErr) {
                return done(glSaveErr);
              }

              // Set assertions on new Gl
              (glSaveRes.body.batchno).should.equal(gl.batchno);
              should.exist(glSaveRes.body.user);
              should.equal(glSaveRes.body.user._id, orphanId);

              // force the Gl to have an orphaned user reference
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

                    // Get the Gl
                    agent.get('/api/gls/' + glSaveRes.body._id)
                      .expect(200)
                      .end(function (glInfoErr, glInfoRes) {
                        // Handle Gl error
                        if (glInfoErr) {
                          return done(glInfoErr);
                        }

                        // Set assertions
                        (glInfoRes.body._id).should.equal(glSaveRes.body._id);
                        (glInfoRes.body.batchno).should.equal(gl.batchno);
                        should.equal(glInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Company.remove().exec(function () {
        Product.remove().exec(function () {
          Gl.remove().exec(done);
        });
      });
    });
  });
});
