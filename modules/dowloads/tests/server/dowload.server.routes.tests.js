'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dowload = mongoose.model('Dowload'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  dowload;

/**
 * Dowload routes tests
 */
describe('Dowload CRUD tests', function () {

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

    // Save a user to the test db and create new Dowload
    user.save(function () {
      dowload = {
        name: 'Dowload name'
      };

      done();
    });
  });

  it('should be able to save a Dowload if logged in', function (done) {
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

        // Save a new Dowload
        agent.post('/api/dowloads')
          .send(dowload)
          .expect(200)
          .end(function (dowloadSaveErr, dowloadSaveRes) {
            // Handle Dowload save error
            if (dowloadSaveErr) {
              return done(dowloadSaveErr);
            }

            // Get a list of Dowloads
            agent.get('/api/dowloads')
              .end(function (dowloadsGetErr, dowloadsGetRes) {
                // Handle Dowloads save error
                if (dowloadsGetErr) {
                  return done(dowloadsGetErr);
                }

                // Get Dowloads list
                var dowloads = dowloadsGetRes.body;

                // Set assertions
                (dowloads[0].user._id).should.equal(userId);
                (dowloads[0].name).should.match('Dowload name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Dowload if not logged in', function (done) {
    agent.post('/api/dowloads')
      .send(dowload)
      .expect(403)
      .end(function (dowloadSaveErr, dowloadSaveRes) {
        // Call the assertion callback
        done(dowloadSaveErr);
      });
  });

  it('should not be able to save an Dowload if no name is provided', function (done) {
    // Invalidate name field
    dowload.name = '';

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

        // Save a new Dowload
        agent.post('/api/dowloads')
          .send(dowload)
          .expect(400)
          .end(function (dowloadSaveErr, dowloadSaveRes) {
            // Set message assertion
            (dowloadSaveRes.body.message).should.match('Please fill Dowload name');

            // Handle Dowload save error
            done(dowloadSaveErr);
          });
      });
  });

  it('should be able to update an Dowload if signed in', function (done) {
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

        // Save a new Dowload
        agent.post('/api/dowloads')
          .send(dowload)
          .expect(200)
          .end(function (dowloadSaveErr, dowloadSaveRes) {
            // Handle Dowload save error
            if (dowloadSaveErr) {
              return done(dowloadSaveErr);
            }

            // Update Dowload name
            dowload.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Dowload
            agent.put('/api/dowloads/' + dowloadSaveRes.body._id)
              .send(dowload)
              .expect(200)
              .end(function (dowloadUpdateErr, dowloadUpdateRes) {
                // Handle Dowload update error
                if (dowloadUpdateErr) {
                  return done(dowloadUpdateErr);
                }

                // Set assertions
                (dowloadUpdateRes.body._id).should.equal(dowloadSaveRes.body._id);
                (dowloadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Dowloads if not signed in', function (done) {
    // Create new Dowload model instance
    var dowloadObj = new Dowload(dowload);

    // Save the dowload
    dowloadObj.save(function () {
      // Request Dowloads
      request(app).get('/api/dowloads')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Dowload if not signed in', function (done) {
    // Create new Dowload model instance
    var dowloadObj = new Dowload(dowload);

    // Save the Dowload
    dowloadObj.save(function () {
      request(app).get('/api/dowloads/' + dowloadObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', dowload.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Dowload with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/dowloads/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Dowload is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Dowload which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Dowload
    request(app).get('/api/dowloads/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Dowload with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Dowload if signed in', function (done) {
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

        // Save a new Dowload
        agent.post('/api/dowloads')
          .send(dowload)
          .expect(200)
          .end(function (dowloadSaveErr, dowloadSaveRes) {
            // Handle Dowload save error
            if (dowloadSaveErr) {
              return done(dowloadSaveErr);
            }

            // Delete an existing Dowload
            agent.delete('/api/dowloads/' + dowloadSaveRes.body._id)
              .send(dowload)
              .expect(200)
              .end(function (dowloadDeleteErr, dowloadDeleteRes) {
                // Handle dowload error error
                if (dowloadDeleteErr) {
                  return done(dowloadDeleteErr);
                }

                // Set assertions
                (dowloadDeleteRes.body._id).should.equal(dowloadSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Dowload if not signed in', function (done) {
    // Set Dowload user
    dowload.user = user;

    // Create new Dowload model instance
    var dowloadObj = new Dowload(dowload);

    // Save the Dowload
    dowloadObj.save(function () {
      // Try deleting Dowload
      request(app).delete('/api/dowloads/' + dowloadObj._id)
        .expect(403)
        .end(function (dowloadDeleteErr, dowloadDeleteRes) {
          // Set message assertion
          (dowloadDeleteRes.body.message).should.match('User is not authorized');

          // Handle Dowload error error
          done(dowloadDeleteErr);
        });

    });
  });

  it('should be able to get a single Dowload that has an orphaned user reference', function (done) {
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

          // Save a new Dowload
          agent.post('/api/dowloads')
            .send(dowload)
            .expect(200)
            .end(function (dowloadSaveErr, dowloadSaveRes) {
              // Handle Dowload save error
              if (dowloadSaveErr) {
                return done(dowloadSaveErr);
              }

              // Set assertions on new Dowload
              (dowloadSaveRes.body.name).should.equal(dowload.name);
              should.exist(dowloadSaveRes.body.user);
              should.equal(dowloadSaveRes.body.user._id, orphanId);

              // force the Dowload to have an orphaned user reference
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

                    // Get the Dowload
                    agent.get('/api/dowloads/' + dowloadSaveRes.body._id)
                      .expect(200)
                      .end(function (dowloadInfoErr, dowloadInfoRes) {
                        // Handle Dowload error
                        if (dowloadInfoErr) {
                          return done(dowloadInfoErr);
                        }

                        // Set assertions
                        (dowloadInfoRes.body._id).should.equal(dowloadSaveRes.body._id);
                        (dowloadInfoRes.body.name).should.equal(dowload.name);
                        should.equal(dowloadInfoRes.body.user, undefined);

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
      Dowload.remove().exec(done);
    });
  });
});
