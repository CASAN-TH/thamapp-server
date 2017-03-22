'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adjust = mongoose.model('Adjust'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  adjust;

/**
 * Adjust routes tests
 */
describe('Adjust CRUD tests', function () {

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

    // Save a user to the test db and create new Adjust
    user.save(function () {
      adjust = {
        name: 'Adjust name'
      };

      done();
    });
  });

  it('should be able to save a Adjust if logged in', function (done) {
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

        // Save a new Adjust
        agent.post('/api/adjusts')
          .send(adjust)
          .expect(200)
          .end(function (adjustSaveErr, adjustSaveRes) {
            // Handle Adjust save error
            if (adjustSaveErr) {
              return done(adjustSaveErr);
            }

            // Get a list of Adjusts
            agent.get('/api/adjusts')
              .end(function (adjustsGetErr, adjustsGetRes) {
                // Handle Adjusts save error
                if (adjustsGetErr) {
                  return done(adjustsGetErr);
                }

                // Get Adjusts list
                var adjusts = adjustsGetRes.body;

                // Set assertions
                (adjusts[0].user._id).should.equal(userId);
                (adjusts[0].name).should.match('Adjust name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adjust if not logged in', function (done) {
    agent.post('/api/adjusts')
      .send(adjust)
      .expect(403)
      .end(function (adjustSaveErr, adjustSaveRes) {
        // Call the assertion callback
        done(adjustSaveErr);
      });
  });

  it('should not be able to save an Adjust if no name is provided', function (done) {
    // Invalidate name field
    adjust.name = '';

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

        // Save a new Adjust
        agent.post('/api/adjusts')
          .send(adjust)
          .expect(400)
          .end(function (adjustSaveErr, adjustSaveRes) {
            // Set message assertion
            (adjustSaveRes.body.message).should.match('Please fill Adjust name');

            // Handle Adjust save error
            done(adjustSaveErr);
          });
      });
  });

  it('should be able to update an Adjust if signed in', function (done) {
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

        // Save a new Adjust
        agent.post('/api/adjusts')
          .send(adjust)
          .expect(200)
          .end(function (adjustSaveErr, adjustSaveRes) {
            // Handle Adjust save error
            if (adjustSaveErr) {
              return done(adjustSaveErr);
            }

            // Update Adjust name
            adjust.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adjust
            agent.put('/api/adjusts/' + adjustSaveRes.body._id)
              .send(adjust)
              .expect(200)
              .end(function (adjustUpdateErr, adjustUpdateRes) {
                // Handle Adjust update error
                if (adjustUpdateErr) {
                  return done(adjustUpdateErr);
                }

                // Set assertions
                (adjustUpdateRes.body._id).should.equal(adjustSaveRes.body._id);
                (adjustUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Adjusts if not signed in', function (done) {
    // Create new Adjust model instance
    var adjustObj = new Adjust(adjust);

    // Save the adjust
    adjustObj.save(function () {
      // Request Adjusts
      request(app).get('/api/adjusts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adjust if not signed in', function (done) {
    // Create new Adjust model instance
    var adjustObj = new Adjust(adjust);

    // Save the Adjust
    adjustObj.save(function () {
      request(app).get('/api/adjusts/' + adjustObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', adjust.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adjust with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adjusts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adjust is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adjust which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adjust
    request(app).get('/api/adjusts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adjust with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adjust if signed in', function (done) {
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

        // Save a new Adjust
        agent.post('/api/adjusts')
          .send(adjust)
          .expect(200)
          .end(function (adjustSaveErr, adjustSaveRes) {
            // Handle Adjust save error
            if (adjustSaveErr) {
              return done(adjustSaveErr);
            }

            // Delete an existing Adjust
            agent.delete('/api/adjusts/' + adjustSaveRes.body._id)
              .send(adjust)
              .expect(200)
              .end(function (adjustDeleteErr, adjustDeleteRes) {
                // Handle adjust error error
                if (adjustDeleteErr) {
                  return done(adjustDeleteErr);
                }

                // Set assertions
                (adjustDeleteRes.body._id).should.equal(adjustSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adjust if not signed in', function (done) {
    // Set Adjust user
    adjust.user = user;

    // Create new Adjust model instance
    var adjustObj = new Adjust(adjust);

    // Save the Adjust
    adjustObj.save(function () {
      // Try deleting Adjust
      request(app).delete('/api/adjusts/' + adjustObj._id)
        .expect(403)
        .end(function (adjustDeleteErr, adjustDeleteRes) {
          // Set message assertion
          (adjustDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adjust error error
          done(adjustDeleteErr);
        });

    });
  });

  it('should be able to get a single Adjust that has an orphaned user reference', function (done) {
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

          // Save a new Adjust
          agent.post('/api/adjusts')
            .send(adjust)
            .expect(200)
            .end(function (adjustSaveErr, adjustSaveRes) {
              // Handle Adjust save error
              if (adjustSaveErr) {
                return done(adjustSaveErr);
              }

              // Set assertions on new Adjust
              (adjustSaveRes.body.name).should.equal(adjust.name);
              should.exist(adjustSaveRes.body.user);
              should.equal(adjustSaveRes.body.user._id, orphanId);

              // force the Adjust to have an orphaned user reference
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

                    // Get the Adjust
                    agent.get('/api/adjusts/' + adjustSaveRes.body._id)
                      .expect(200)
                      .end(function (adjustInfoErr, adjustInfoRes) {
                        // Handle Adjust error
                        if (adjustInfoErr) {
                          return done(adjustInfoErr);
                        }

                        // Set assertions
                        (adjustInfoRes.body._id).should.equal(adjustSaveRes.body._id);
                        (adjustInfoRes.body.name).should.equal(adjust.name);
                        should.equal(adjustInfoRes.body.user, undefined);

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
      Adjust.remove().exec(done);
    });
  });
});
