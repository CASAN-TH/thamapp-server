'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Marketplan = mongoose.model('Marketplan'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  marketplan;

/**
 * Marketplan routes tests
 */
describe('Marketplan CRUD tests', function () {

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

    // Save a user to the test db and create new Marketplan
    user.save(function () {
      marketplan = {
        name: 'Marketplan name',
        year: 2560,
        place : '55/7'
      };

      done();
    });
  });

  it('should be able to save a Marketplan if logged in', function (done) {
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

        // Save a new Marketplan
        agent.post('/api/marketplans')
          .send(marketplan)
          .expect(200)
          .end(function (marketplanSaveErr, marketplanSaveRes) {
            // Handle Marketplan save error
            if (marketplanSaveErr) {
              return done(marketplanSaveErr);
            }

            // Get a list of Marketplans
            agent.get('/api/marketplans')
              .end(function (marketplansGetErr, marketplansGetRes) {
                // Handle Marketplans save error
                if (marketplansGetErr) {
                  return done(marketplansGetErr);
                }

                // Get Marketplans list
                var marketplans = marketplansGetRes.body;

                // Set assertions
                (marketplans[0].user._id).should.equal(userId);
                (marketplans[0].name).should.match('Marketplan name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Marketplan if not logged in', function (done) {
    agent.post('/api/marketplans')
      .send(marketplan)
      .expect(403)
      .end(function (marketplanSaveErr, marketplanSaveRes) {
        // Call the assertion callback
        done(marketplanSaveErr);
      });
  });

  it('should not be able to save an Marketplan if no name is provided', function (done) {
    // Invalidate name field
    marketplan.name = '';

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

        // Save a new Marketplan
        agent.post('/api/marketplans')
          .send(marketplan)
          .expect(400)
          .end(function (marketplanSaveErr, marketplanSaveRes) {
            // Set message assertion
            (marketplanSaveRes.body.message).should.match('Please fill Marketplan name');

            // Handle Marketplan save error
            done(marketplanSaveErr);
          });
      });
  });

//year
  it('should not be able to save an Marketplan if no year is provided', function (done) {
    // Invalidate year field
    marketplan.year = null;

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
        // Save a new Marketplan
        agent.post('/api/marketplans')
          .send(marketplan)
          .expect(400)
          .end(function (marketplanSaveErr, marketplanSaveRes) {
            // Set message assertion
            (marketplanSaveRes.body.message).should.match('Please fill Marketplan year');
            // Handle Marketplan save error
            done(marketplanSaveErr);
          });
      });
  });
  

  //marketplance
  it('should not be able to save an Marketplan if no place is provided', function (done) {
    // Invalidate marketplance field
    marketplan.place = '';

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
        // Save a new Marketplan
        agent.post('/api/marketplans')
          .send(marketplan)
          .expect(400)
          .end(function (marketplanSaveErr, marketplanSaveRes) {
            // Set message assertion
            (marketplanSaveRes.body.message).should.match('Please fill Marketplan place');
            // Handle Marketplan save error
            done(marketplanSaveErr);
          });
      });
  });

  it('should be able to update an Marketplan if signed in', function (done) {
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

        // Save a new Marketplan
        agent.post('/api/marketplans')
          .send(marketplan)
          .expect(200)
          .end(function (marketplanSaveErr, marketplanSaveRes) {
            // Handle Marketplan save error
            if (marketplanSaveErr) {
              return done(marketplanSaveErr);
            }

            // Update Marketplan name
            marketplan.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Marketplan
            agent.put('/api/marketplans/' + marketplanSaveRes.body._id)
              .send(marketplan)
              .expect(200)
              .end(function (marketplanUpdateErr, marketplanUpdateRes) {
                // Handle Marketplan update error
                if (marketplanUpdateErr) {
                  return done(marketplanUpdateErr);
                }

                // Set assertions
                (marketplanUpdateRes.body._id).should.equal(marketplanSaveRes.body._id);
                (marketplanUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Marketplans if not signed in', function (done) {
    // Create new Marketplan model instance
    var marketplanObj = new Marketplan(marketplan);

    // Save the marketplan
    marketplanObj.save(function () {
      // Request Marketplans
      request(app).get('/api/marketplans')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Marketplan if not signed in', function (done) {
    // Create new Marketplan model instance
    var marketplanObj = new Marketplan(marketplan);

    // Save the Marketplan
    marketplanObj.save(function () {
      request(app).get('/api/marketplans/' + marketplanObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', marketplan.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Marketplan with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/marketplans/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Marketplan is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Marketplan which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Marketplan
    request(app).get('/api/marketplans/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Marketplan with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Marketplan if signed in', function (done) {
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

        // Save a new Marketplan
        agent.post('/api/marketplans')
          .send(marketplan)
          .expect(200)
          .end(function (marketplanSaveErr, marketplanSaveRes) {
            // Handle Marketplan save error
            if (marketplanSaveErr) {
              return done(marketplanSaveErr);
            }

            // Delete an existing Marketplan
            agent.delete('/api/marketplans/' + marketplanSaveRes.body._id)
              .send(marketplan)
              .expect(200)
              .end(function (marketplanDeleteErr, marketplanDeleteRes) {
                // Handle marketplan error error
                if (marketplanDeleteErr) {
                  return done(marketplanDeleteErr);
                }

                // Set assertions
                (marketplanDeleteRes.body._id).should.equal(marketplanSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Marketplan if not signed in', function (done) {
    // Set Marketplan user
    marketplan.user = user;

    // Create new Marketplan model instance
    var marketplanObj = new Marketplan(marketplan);

    // Save the Marketplan
    marketplanObj.save(function () {
      // Try deleting Marketplan
      request(app).delete('/api/marketplans/' + marketplanObj._id)
        .expect(403)
        .end(function (marketplanDeleteErr, marketplanDeleteRes) {
          // Set message assertion
          (marketplanDeleteRes.body.message).should.match('User is not authorized');

          // Handle Marketplan error error
          done(marketplanDeleteErr);
        });

    });
  });

  it('should be able to get a single Marketplan that has an orphaned user reference', function (done) {
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

          // Save a new Marketplan
          agent.post('/api/marketplans')
            .send(marketplan)
            .expect(200)
            .end(function (marketplanSaveErr, marketplanSaveRes) {
              // Handle Marketplan save error
              if (marketplanSaveErr) {
                return done(marketplanSaveErr);
              }

              // Set assertions on new Marketplan
              (marketplanSaveRes.body.name).should.equal(marketplan.name);
              should.exist(marketplanSaveRes.body.user);
              should.equal(marketplanSaveRes.body.user._id, orphanId);

              // force the Marketplan to have an orphaned user reference
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

                    // Get the Marketplan
                    agent.get('/api/marketplans/' + marketplanSaveRes.body._id)
                      .expect(200)
                      .end(function (marketplanInfoErr, marketplanInfoRes) {
                        // Handle Marketplan error
                        if (marketplanInfoErr) {
                          return done(marketplanInfoErr);
                        }

                        // Set assertions
                        (marketplanInfoRes.body._id).should.equal(marketplanSaveRes.body._id);
                        (marketplanInfoRes.body.name).should.equal(marketplan.name);
                        should.equal(marketplanInfoRes.body.user, undefined);

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
      Marketplan.remove().exec(done);
    });
  });
});
