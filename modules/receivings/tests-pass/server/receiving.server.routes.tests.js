'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Receiving = mongoose.model('Receiving'),
  Product = mongoose.model('Product'),
  Company = mongoose.model('Company'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  receiving,
  product,
  product2,
  company;

/**
 * Receiving routes tests
 */
describe('Receiving CRUD tests', function () {

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
      unitname: 'Product Unitname'
    });

    product2 = new Product({
      name: 'Product Name2',
      description: 'Product Description2',
      category: 'P',
      buyprice: 50,
      saleprice: 100,
      isincludevat: false,
      unitname: 'Product Unitname2'
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
    // Save a user to the test db and create new Receiving
    user.save(function () {
      company.save(function () {
        product.save(function () {
          receiving = {
            docno: 'Receiving docno',
            refno: 'Receiving refno',
            client: company,
            items: [{
              product: product,
              qty: 1,
              // unitprice: 107,
              // amount: 107,
              // vatamount: 7,
              // whtamount: 0,
              // totalamount: 107,
            }],
            creditday: 0,
            isincludevat: 0,
            // amount: 107,
            // discountamount: 0,
            // amountafterdiscount: 0,
            // vatamount: 7,
            // totalamount: 107,
            user: user
          };

          done();
        });
      });
    });
  });

  it('should be able to save a Receiving if logged in', function (done) {
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

        // Save a new Receiving
        agent.post('/api/receivings')
          .send(receiving)
          .expect(200)
          .end(function (receivingSaveErr, receivingSaveRes) {
            // Handle Receiving save error
            if (receivingSaveErr) {
              return done(receivingSaveErr);
            }

            // Get a list of Receivings
            agent.get('/api/receivings')
              .end(function (receivingsGetErr, receivingsGetRes) {
                // Handle Receivings save error
                if (receivingsGetErr) {
                  return done(receivingsGetErr);
                }

                // Get Receivings list
                var receivings = receivingsGetRes.body;

                // Set assertions
                (receivings[0].user._id).should.equal(userId);
                (receivings[0].docno).should.match('Receiving docno');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Receiving if not logged in', function (done) {
    agent.post('/api/receivings')
      .send(receiving)
      .expect(403)
      .end(function (receivingSaveErr, receivingSaveRes) {
        // Call the assertion callback
        done(receivingSaveErr);
      });
  });

  it('should not be able to save an Receiving if docno is duplicated', function (done) {

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
        // Save a new receiving
        agent.post('/api/receivings')
          .send(receiving)
          .expect(200)
          .end(function (receivingSaveErr, receivingSaveRes) {
            // Handle receiving save error
            if (receivingSaveErr) {
              return done(receivingSaveErr);
            }
            // Save a new receiving
            agent.post('/api/receivings')
              .send(receiving)
              .expect(400)
              .end(function (receivingSaveErr, receivingSaveRes) {
                // Set message assertion
                (receivingSaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.receivings index: docno already exists');

                // Handle company save error
                done(receivingSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Receiving if no docno is provided', function (done) {
    // Invalidate name field
    receiving.docno = '';

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

        // Save a new Receiving
        agent.post('/api/receivings')
          .send(receiving)
          .expect(400)
          .end(function (receivingSaveErr, receivingSaveRes) {
            // Set message assertion
            (receivingSaveRes.body.message).should.match('Please fill Receiving docno');

            // Handle Receiving save error
            done(receivingSaveErr);
          });
      });
  });

  it('should not be able to save an Receiving if no client is provided', function (done) {
    // Invalidate name field
    receiving.client = null;

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

        // Save a new Receiving
        agent.post('/api/receivings')
          .send(receiving)
          .expect(400)
          .end(function (receivingSaveErr, receivingSaveRes) {
            // Set message assertion
            (receivingSaveRes.body.message).should.match('Please fill Receiving client');

            // Handle Receiving save error
            done(receivingSaveErr);
          });
      });
  });

  it('should not be able to save an Receiving if update product', function (done) {
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

        // Save a new Receiving
        agent.post('/api/receivings')
          .send(receiving)
          .expect(200)
          .end(function (receivingSaveErr, receivingSaveRes) {
            // Handle Receiving save error
            if (receivingSaveErr) {
              return done(receivingSaveErr);
            }

            // Update Receiving name
            receiving.docno = 'WHY YOU GOTTA BE SO MEAN?';
            receiving.items.push(product2);
            // Update an existing Receiving
            agent.put('/api/receivings/' + receivingSaveRes.body._id)
              .send(receiving)
              .expect(200)
              .end(function (receivingUpdateErr, receivingUpdateRes) {
                // Handle Receiving update error
                if (receivingUpdateErr) {
                  return done(receivingUpdateErr);
                }

                // Set assertions
                (receivingUpdateRes.body._id).should.equal(receivingSaveRes.body._id);
                (receivingUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');
                (receivingUpdateRes.body.items.length).should.match(2);
                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an Receiving if signed in', function (done) {
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

        // Save a new Receiving
        agent.post('/api/receivings')
          .send(receiving)
          .expect(200)
          .end(function (receivingSaveErr, receivingSaveRes) {
            // Handle Receiving save error
            if (receivingSaveErr) {
              return done(receivingSaveErr);
            }

            // Update Receiving name
            receiving.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Receiving
            agent.put('/api/receivings/' + receivingSaveRes.body._id)
              .send(receiving)
              .expect(200)
              .end(function (receivingUpdateErr, receivingUpdateRes) {
                // Handle Receiving update error
                if (receivingUpdateErr) {
                  return done(receivingUpdateErr);
                }

                // Set assertions
                (receivingUpdateRes.body._id).should.equal(receivingSaveRes.body._id);
                (receivingUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Receivings if not signed in', function (done) {
    // Create new Receiving model instance
    var receivingObj = new Receiving(receiving);

    // Save the receiving
    receivingObj.save(function () {
      // Request Receivings
      request(app).get('/api/receivings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Receiving if not signed in', function (done) {
    // Create new Receiving model instance
    var receivingObj = new Receiving(receiving);

    // Save the Receiving
    receivingObj.save(function () {
      request(app).get('/api/receivings/' + receivingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', receiving.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Receiving with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/receivings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Receiving is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Receiving which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Receiving
    request(app).get('/api/receivings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Receiving with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Receiving if signed in', function (done) {
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

        // Save a new Receiving
        agent.post('/api/receivings')
          .send(receiving)
          .expect(200)
          .end(function (receivingSaveErr, receivingSaveRes) {
            // Handle Receiving save error
            if (receivingSaveErr) {
              return done(receivingSaveErr);
            }

            // Delete an existing Receiving
            agent.delete('/api/receivings/' + receivingSaveRes.body._id)
              .send(receiving)
              .expect(200)
              .end(function (receivingDeleteErr, receivingDeleteRes) {
                // Handle receiving error error
                if (receivingDeleteErr) {
                  return done(receivingDeleteErr);
                }

                // Set assertions
                (receivingDeleteRes.body._id).should.equal(receivingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Receiving if not signed in', function (done) {
    // Set Receiving user
    receiving.user = user;

    // Create new Receiving model instance
    var receivingObj = new Receiving(receiving);

    // Save the Receiving
    receivingObj.save(function () {
      // Try deleting Receiving
      request(app).delete('/api/receivings/' + receivingObj._id)
        .expect(403)
        .end(function (receivingDeleteErr, receivingDeleteRes) {
          // Set message assertion
          (receivingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Receiving error error
          done(receivingDeleteErr);
        });

    });
  });

  it('should be able to get a single Receiving that has an orphaned user reference', function (done) {
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

          // Save a new Receiving
          agent.post('/api/receivings')
            .send(receiving)
            .expect(200)
            .end(function (receivingSaveErr, receivingSaveRes) {
              // Handle Receiving save error
              if (receivingSaveErr) {
                return done(receivingSaveErr);
              }

              // Set assertions on new Receiving
              (receivingSaveRes.body.docno).should.equal(receiving.docno);
              should.exist(receivingSaveRes.body.user);
              should.equal(receivingSaveRes.body.user._id, orphanId);

              // force the Receiving to have an orphaned user reference
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

                    // Get the Receiving
                    agent.get('/api/receivings/' + receivingSaveRes.body._id)
                      .expect(200)
                      .end(function (receivingInfoErr, receivingInfoRes) {
                        // Handle Receiving error
                        if (receivingInfoErr) {
                          return done(receivingInfoErr);
                        }

                        // Set assertions
                        (receivingInfoRes.body._id).should.equal(receivingSaveRes.body._id);
                        (receivingInfoRes.body.docno).should.equal(receiving.docno);
                        should.equal(receivingInfoRes.body.user, undefined);

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
          Receiving.remove().exec(done);
        });
      });
    });
  });
});
