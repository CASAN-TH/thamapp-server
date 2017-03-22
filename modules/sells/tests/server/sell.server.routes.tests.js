'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sell = mongoose.model('Sell'),
  Accountchart = mongoose.model('Accountchart'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sell,
  accountchart;

/**
 * Sell routes tests
 */
describe('Sell CRUD tests', function () {

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

    // Save a user to the test db and create new Sell
    user.save(function () {
      accountchart.save(function () {
        sell = {
          docno: 'Sell docno',
          refno: 'Sell refno',
          client: accountchart,
          user: user
        };
        done();
      });
    });
  });

  it('should be able to save a Sell if logged in', function (done) {
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

        // Save a new Sell
        agent.post('/api/sells')
          .send(sell)
          .expect(200)
          .end(function (sellSaveErr, sellSaveRes) {
            // Handle Sell save error
            if (sellSaveErr) {
              return done(sellSaveErr);
            }

            // Get a list of Sells
            agent.get('/api/sells')
              .end(function (sellsGetErr, sellsGetRes) {
                // Handle Sells save error
                if (sellsGetErr) {
                  return done(sellsGetErr);
                }

                // Get Sells list
                var sells = sellsGetRes.body;

                // Set assertions
                (sells[0].user._id).should.equal(userId);
                (sells[0].docno).should.match('Sell docno');
                (sells[0].refno).should.match('Sell refno');
                (sells[0].client.accountname).should.match('Account Name');
                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sell if not logged in', function (done) {
    agent.post('/api/sells')
      .send(sell)
      .expect(403)
      .end(function (sellSaveErr, sellSaveRes) {
        // Call the assertion callback
        done(sellSaveErr);
      });
  });

  it('should not be able to save an Sell if docno is duplicated', function (done) {

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
        // Save a new sell
        agent.post('/api/sells')
          .send(sell)
          .expect(200)
          .end(function (sellSaveErr, sellSaveRes) {
            // Handle sell save error
            if (sellSaveErr) {
              return done(sellSaveErr);
            }
            // Save a new sell
            agent.post('/api/sells')
              .send(sell)
              .expect(400)
              .end(function (sellSaveErr, sellSaveRes) {
                // Set message assertion
                (sellSaveRes.body.message.toLowerCase()).should.endWith('docno already exists');

                // Handle company save error
                done(sellSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Sell if no docno is provided', function (done) {
    // Invalidate name field
    sell.docno = '';

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

        // Save a new Sell
        agent.post('/api/sells')
          .send(sell)
          .expect(400)
          .end(function (sellSaveErr, sellSaveRes) {
            // Set message assertion
            (sellSaveRes.body.message).should.match('Please fill Sell docno');

            // Handle Sell save error
            done(sellSaveErr);
          });
      });
  });

  it('should not be able to save an Sell if no client is provided', function (done) {
    // Invalidate name field
    sell.client = '';

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

        // Save a new Sell
        agent.post('/api/sells')
          .send(sell)
          .expect(400)
          .end(function (sellSaveErr, sellSaveRes) {
            // Set message assertion
            (sellSaveRes.body.message).should.match('Cast to ObjectID failed for value "" at path "client"');

            // Handle Sell save error
            done(sellSaveErr);
          });
      });
  });

  it('should be able to update an Sell if signed in', function (done) {
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

        // Save a new Sell
        agent.post('/api/sells')
          .send(sell)
          .expect(200)
          .end(function (sellSaveErr, sellSaveRes) {
            // Handle Sell save error
            if (sellSaveErr) {
              return done(sellSaveErr);
            }

            // Update Sell name
            sell.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sell
            agent.put('/api/sells/' + sellSaveRes.body._id)
              .send(sell)
              .expect(200)
              .end(function (sellUpdateErr, sellUpdateRes) {
                // Handle Sell update error
                if (sellUpdateErr) {
                  return done(sellUpdateErr);
                }

                // Set assertions
                (sellUpdateRes.body._id).should.equal(sellSaveRes.body._id);
                (sellUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sells if not signed in', function (done) {
    // Create new Sell model instance
    var sellObj = new Sell(sell);

    // Save the sell
    sellObj.save(function () {
      // Request Sells
      request(app).get('/api/sells')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sell if not signed in', function (done) {
    // Create new Sell model instance
    var sellObj = new Sell(sell);

    // Save the Sell
    sellObj.save(function () {
      request(app).get('/api/sells/' + sellObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', sell.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sell with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sells/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sell is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sell which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sell
    request(app).get('/api/sells/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sell with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sell if signed in', function (done) {
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

        // Save a new Sell
        agent.post('/api/sells')
          .send(sell)
          .expect(200)
          .end(function (sellSaveErr, sellSaveRes) {
            // Handle Sell save error
            if (sellSaveErr) {
              return done(sellSaveErr);
            }

            // Delete an existing Sell
            agent.delete('/api/sells/' + sellSaveRes.body._id)
              .send(sell)
              .expect(200)
              .end(function (sellDeleteErr, sellDeleteRes) {
                // Handle sell error error
                if (sellDeleteErr) {
                  return done(sellDeleteErr);
                }

                // Set assertions
                (sellDeleteRes.body._id).should.equal(sellSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sell if not signed in', function (done) {
    // Set Sell user
    sell.user = user;

    // Create new Sell model instance
    var sellObj = new Sell(sell);

    // Save the Sell
    sellObj.save(function () {
      // Try deleting Sell
      request(app).delete('/api/sells/' + sellObj._id)
        .expect(403)
        .end(function (sellDeleteErr, sellDeleteRes) {
          // Set message assertion
          (sellDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sell error error
          done(sellDeleteErr);
        });

    });
  });

  it('should be able to get a single Sell that has an orphaned user reference', function (done) {
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

          // Save a new Sell
          agent.post('/api/sells')
            .send(sell)
            .expect(200)
            .end(function (sellSaveErr, sellSaveRes) {
              // Handle Sell save error
              if (sellSaveErr) {
                return done(sellSaveErr);
              }

              // Set assertions on new Sell
              (sellSaveRes.body.docno).should.equal(sell.docno);
              should.exist(sellSaveRes.body.user);
              should.equal(sellSaveRes.body.user._id, orphanId);

              // force the Sell to have an orphaned user reference
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

                    // Get the Sell
                    agent.get('/api/sells/' + sellSaveRes.body._id)
                      .expect(200)
                      .end(function (sellInfoErr, sellInfoRes) {
                        // Handle Sell error
                        if (sellInfoErr) {
                          return done(sellInfoErr);
                        }

                        // Set assertions
                        (sellInfoRes.body._id).should.equal(sellSaveRes.body._id);
                        (sellInfoRes.body.docno).should.equal(sell.docno);
                        should.equal(sellInfoRes.body.user, undefined);

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
          Sell.remove().exec(done);
      });
    });
  });
});
