'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Purchase = mongoose.model('Purchase'),
  Accountchart = mongoose.model('Accountchart'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  purchase,
  accountchart;

/**
 * Purchase routes tests
 */
describe('Purchase CRUD tests', function () {

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

    // Save a user to the test db and create new Purchase
    user.save(function () {
      accountchart.save(function () {
        purchase = {
          docno: 'Purchase docno',
          refno: 'Purchase refno',
          client: accountchart,
          user: user
        };
        done();
      });
    });
  });

  it('should be able to save a Purchase if logged in', function (done) {
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

        // Save a new Purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(200)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Handle Purchase save error
            if (purchaseSaveErr) {
              return done(purchaseSaveErr);
            }

            // Get a list of Purchases
            agent.get('/api/purchases')
              .end(function (purchasesGetErr, purchasesGetRes) {
                // Handle Purchases save error
                if (purchasesGetErr) {
                  return done(purchasesGetErr);
                }

                // Get Purchases list
                var purchases = purchasesGetRes.body;

                // Set assertions
                (purchases[0].user._id).should.equal(userId);
                (purchases[0].docno).should.match('Purchase docno');
                (purchases[0].refno).should.match('Purchase refno');
                (purchases[0].client.accountname).should.match('Account Name');
                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Purchase if not logged in', function (done) {
    agent.post('/api/purchases')
      .send(purchase)
      .expect(403)
      .end(function (purchaseSaveErr, purchaseSaveRes) {
        // Call the assertion callback
        done(purchaseSaveErr);
      });
  });

  it('should not be able to save an Purchase if docno is duplicated', function (done) {

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
        // Save a new purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(200)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Handle purchase save error
            if (purchaseSaveErr) {
              return done(purchaseSaveErr);
            }
            // Save a new purchase
            agent.post('/api/purchases')
              .send(purchase)
              .expect(400)
              .end(function (purchaseSaveErr, purchaseSaveRes) {
                // Set message assertion
                (purchaseSaveRes.body.message.toLowerCase()).should.endWith('docno already exists');

                // Handle company save error
                done(purchaseSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Purchase if no docno is provided', function (done) {
    // Invalidate name field
    purchase.docno = '';

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

        // Save a new Purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(400)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Set message assertion
            (purchaseSaveRes.body.message).should.match('Please fill Purchase docno');

            // Handle Purchase save error
            done(purchaseSaveErr);
          });
      });
  });

  it('should not be able to save an Purchase if no client is provided', function (done) {
    // Invalidate name field
    purchase.client = '';

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

        // Save a new Purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(400)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Set message assertion
            (purchaseSaveRes.body.message).should.match('Cast to ObjectID failed for value "" at path "client"');

            // Handle Purchase save error
            done(purchaseSaveErr);
          });
      });
  });

  it('should be able to update an Purchase if signed in', function (done) {
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

        // Save a new Purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(200)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Handle Purchase save error
            if (purchaseSaveErr) {
              return done(purchaseSaveErr);
            }

            // Update Purchase name
            purchase.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Purchase
            agent.put('/api/purchases/' + purchaseSaveRes.body._id)
              .send(purchase)
              .expect(200)
              .end(function (purchaseUpdateErr, purchaseUpdateRes) {
                // Handle Purchase update error
                if (purchaseUpdateErr) {
                  return done(purchaseUpdateErr);
                }

                // Set assertions
                (purchaseUpdateRes.body._id).should.equal(purchaseSaveRes.body._id);
                (purchaseUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Purchases if not signed in', function (done) {
    // Create new Purchase model instance
    var purchaseObj = new Purchase(purchase);

    // Save the purchase
    purchaseObj.save(function () {
      // Request Purchases
      request(app).get('/api/purchases')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Purchase if not signed in', function (done) {
    // Create new Purchase model instance
    var purchaseObj = new Purchase(purchase);

    // Save the Purchase
    purchaseObj.save(function () {
      request(app).get('/api/purchases/' + purchaseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', purchase.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Purchase with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/purchases/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Purchase is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Purchase which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Purchase
    request(app).get('/api/purchases/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Purchase with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Purchase if signed in', function (done) {
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

        // Save a new Purchase
        agent.post('/api/purchases')
          .send(purchase)
          .expect(200)
          .end(function (purchaseSaveErr, purchaseSaveRes) {
            // Handle Purchase save error
            if (purchaseSaveErr) {
              return done(purchaseSaveErr);
            }

            // Delete an existing Purchase
            agent.delete('/api/purchases/' + purchaseSaveRes.body._id)
              .send(purchase)
              .expect(200)
              .end(function (purchaseDeleteErr, purchaseDeleteRes) {
                // Handle purchase error error
                if (purchaseDeleteErr) {
                  return done(purchaseDeleteErr);
                }

                // Set assertions
                (purchaseDeleteRes.body._id).should.equal(purchaseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Purchase if not signed in', function (done) {
    // Set Purchase user
    purchase.user = user;

    // Create new Purchase model instance
    var purchaseObj = new Purchase(purchase);

    // Save the Purchase
    purchaseObj.save(function () {
      // Try deleting Purchase
      request(app).delete('/api/purchases/' + purchaseObj._id)
        .expect(403)
        .end(function (purchaseDeleteErr, purchaseDeleteRes) {
          // Set message assertion
          (purchaseDeleteRes.body.message).should.match('User is not authorized');

          // Handle Purchase error error
          done(purchaseDeleteErr);
        });

    });
  });

  it('should be able to get a single Purchase that has an orphaned user reference', function (done) {
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

          // Save a new Purchase
          agent.post('/api/purchases')
            .send(purchase)
            .expect(200)
            .end(function (purchaseSaveErr, purchaseSaveRes) {
              // Handle Purchase save error
              if (purchaseSaveErr) {
                return done(purchaseSaveErr);
              }

              // Set assertions on new Purchase
              (purchaseSaveRes.body.docno).should.equal(purchase.docno);
              should.exist(purchaseSaveRes.body.user);
              should.equal(purchaseSaveRes.body.user._id, orphanId);

              // force the Purchase to have an orphaned user reference
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

                    // Get the Purchase
                    agent.get('/api/purchases/' + purchaseSaveRes.body._id)
                      .expect(200)
                      .end(function (purchaseInfoErr, purchaseInfoRes) {
                        // Handle Purchase error
                        if (purchaseInfoErr) {
                          return done(purchaseInfoErr);
                        }

                        // Set assertions
                        (purchaseInfoRes.body._id).should.equal(purchaseSaveRes.body._id);
                        (purchaseInfoRes.body.docno).should.equal(purchase.docno);
                        should.equal(purchaseInfoRes.body.user, undefined);

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
      Accountchart.remove().exec(function () {
          Purchase.remove().exec(done);
      });
    });
  });
});
