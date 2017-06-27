'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Freerice = mongoose.model('Freerice'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  freerice;

/**
 * Freerice routes tests
 */
describe('Freerice CRUD tests', function () {

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

    // Save a user to the test db and create new Freerice
    user.save(function () {
      freerice = {
        name: 'Freerice name'
      };

      done();
    });
  });

  it('should be able to save a Freerice if logged in', function (done) {
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

        // Save a new Freerice
        agent.post('/api/freerices')
          .send(freerice)
          .expect(200)
          .end(function (freericeSaveErr, freericeSaveRes) {
            // Handle Freerice save error
            if (freericeSaveErr) {
              return done(freericeSaveErr);
            }

            // Get a list of Freerices
            agent.get('/api/freerices')
              .end(function (freericesGetErr, freericesGetRes) {
                // Handle Freerices save error
                if (freericesGetErr) {
                  return done(freericesGetErr);
                }

                // Get Freerices list
                var freerices = freericesGetRes.body;

                // Set assertions
                (freerices[0].user._id).should.equal(userId);
                (freerices[0].name).should.match('Freerice name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Freerice if not logged in', function (done) {
    agent.post('/api/freerices')
      .send(freerice)
      .expect(403)
      .end(function (freericeSaveErr, freericeSaveRes) {
        // Call the assertion callback
        done(freericeSaveErr);
      });
  });

  it('should not be able to save an Freerice if no name is provided', function (done) {
    // Invalidate name field
    freerice.name = '';

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

        // Save a new Freerice
        agent.post('/api/freerices')
          .send(freerice)
          .expect(400)
          .end(function (freericeSaveErr, freericeSaveRes) {
            // Set message assertion
            (freericeSaveRes.body.message).should.match('Please fill Freerice name');

            // Handle Freerice save error
            done(freericeSaveErr);
          });
      });
  });

  it('should be able to update an Freerice if signed in', function (done) {
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

        // Save a new Freerice
        agent.post('/api/freerices')
          .send(freerice)
          .expect(200)
          .end(function (freericeSaveErr, freericeSaveRes) {
            // Handle Freerice save error
            if (freericeSaveErr) {
              return done(freericeSaveErr);
            }

            // Update Freerice name
            freerice.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Freerice
            agent.put('/api/freerices/' + freericeSaveRes.body._id)
              .send(freerice)
              .expect(200)
              .end(function (freericeUpdateErr, freericeUpdateRes) {
                // Handle Freerice update error
                if (freericeUpdateErr) {
                  return done(freericeUpdateErr);
                }

                // Set assertions
                (freericeUpdateRes.body._id).should.equal(freericeSaveRes.body._id);
                (freericeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Freerices if not signed in', function (done) {
    // Create new Freerice model instance
    var freericeObj = new Freerice(freerice);

    // Save the freerice
    freericeObj.save(function () {
      // Request Freerices
      request(app).get('/api/freerices')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Freerice if not signed in', function (done) {
    // Create new Freerice model instance
    var freericeObj = new Freerice(freerice);

    // Save the Freerice
    freericeObj.save(function () {
      request(app).get('/api/freerices/' + freericeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', freerice.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Freerice with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/freerices/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Freerice is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Freerice which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Freerice
    request(app).get('/api/freerices/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Freerice with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Freerice if signed in', function (done) {
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

        // Save a new Freerice
        agent.post('/api/freerices')
          .send(freerice)
          .expect(200)
          .end(function (freericeSaveErr, freericeSaveRes) {
            // Handle Freerice save error
            if (freericeSaveErr) {
              return done(freericeSaveErr);
            }

            // Delete an existing Freerice
            agent.delete('/api/freerices/' + freericeSaveRes.body._id)
              .send(freerice)
              .expect(200)
              .end(function (freericeDeleteErr, freericeDeleteRes) {
                // Handle freerice error error
                if (freericeDeleteErr) {
                  return done(freericeDeleteErr);
                }

                // Set assertions
                (freericeDeleteRes.body._id).should.equal(freericeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Freerice if not signed in', function (done) {
    // Set Freerice user
    freerice.user = user;

    // Create new Freerice model instance
    var freericeObj = new Freerice(freerice);

    // Save the Freerice
    freericeObj.save(function () {
      // Try deleting Freerice
      request(app).delete('/api/freerices/' + freericeObj._id)
        .expect(403)
        .end(function (freericeDeleteErr, freericeDeleteRes) {
          // Set message assertion
          (freericeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Freerice error error
          done(freericeDeleteErr);
        });

    });
  });

  it('should be able to get a single Freerice that has an orphaned user reference', function (done) {
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

          // Save a new Freerice
          agent.post('/api/freerices')
            .send(freerice)
            .expect(200)
            .end(function (freericeSaveErr, freericeSaveRes) {
              // Handle Freerice save error
              if (freericeSaveErr) {
                return done(freericeSaveErr);
              }

              // Set assertions on new Freerice
              (freericeSaveRes.body.name).should.equal(freerice.name);
              should.exist(freericeSaveRes.body.user);
              should.equal(freericeSaveRes.body.user._id, orphanId);

              // force the Freerice to have an orphaned user reference
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

                    // Get the Freerice
                    agent.get('/api/freerices/' + freericeSaveRes.body._id)
                      .expect(200)
                      .end(function (freericeInfoErr, freericeInfoRes) {
                        // Handle Freerice error
                        if (freericeInfoErr) {
                          return done(freericeInfoErr);
                        }

                        // Set assertions
                        (freericeInfoRes.body._id).should.equal(freericeSaveRes.body._id);
                        (freericeInfoRes.body.name).should.equal(freerice.name);
                        should.equal(freericeInfoRes.body.user, undefined);

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
      Freerice.remove().exec(done);
    });
  });
});
