'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pushnotiuser = mongoose.model('Pushnotiuser'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  pushnotiuser;

var tomorrow = new Date();


/**
 * Pushnotiuser routes tests
 */
describe('Pushnotiuser CRUD tests', function () {

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
      provider: 'local',
      loginToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwibG9naW5FeHBpcmVzIjoxNDg3NTk1NTcyMzcyfQ.vfDKENoQTmzQhoaBV35RJa02f_5GVvviJdhuPhfM1oU',
      loginExpires: tomorrow.setDate(tomorrow.getDate() + 1)
    });

    // Save a user to the test db and create new Pushnotiuser
    user.save(function () {
      pushnotiuser = {
        user_id: 'Pushnotiuser user id',
        user_name: 'Pushnotiuser user name',
        role: 'Pushnotiuser role',
        device_token: ' Pushnotiuser device token'
      };

      done();
    });
  });

  it('should be able to save a Pushnotiuser if logged in', function (done) {
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

        // Save a new Pushnotiuser
        agent.post('/api/pushnotiusers')
          .send(pushnotiuser)
          .expect(200)
          .end(function (pushnotiuserSaveErr, pushnotiuserSaveRes) {
            // Handle Pushnotiuser save error
            if (pushnotiuserSaveErr) {
              return done(pushnotiuserSaveErr);
            }

            // Get a list of Pushnotiusers
            agent.get('/api/pushnotiusers')
              .end(function (pushnotiusersGetErr, pushnotiusersGetRes) {
                // Handle Pushnotiusers save error
                if (pushnotiusersGetErr) {
                  return done(pushnotiusersGetErr);
                }

                // Get Pushnotiusers list
                var pushnotiusers = pushnotiusersGetRes.body;

                // Set assertions
                (pushnotiusers[0].user._id).should.equal(userId);
                (pushnotiusers[0].user_id).should.match('Pushnotiuser user id');
                (pushnotiusers[0].user_name).should.match('Pushnotiuser user name');
                (pushnotiusers[0].role).should.match('Pushnotiuser role');
                (pushnotiusers[0].device_token).should.match('Pushnotiuser device token');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to save a Pushnotiuser if logged in with token', function (done) {
    pushnotiuser.loginToken = user.loginToken;
    // Save a new Pushnotiuser
    agent.post('/api/pushnotiusers')
      .send(pushnotiuser)
      .expect(200)
      .end(function (pushnotiuserSaveErr, pushnotiuserSaveRes) {
        // Handle Pushnotiuser save error
        if (pushnotiuserSaveErr) {
          return done(pushnotiuserSaveErr);
        }

        // Get a list of Pushnotiusers
        agent.get('/api/pushnotiusers')
          .end(function (pushnotiusersGetErr, pushnotiusersGetRes) {
            // Handle Pushnotiusers save error
            if (pushnotiusersGetErr) {
              return done(pushnotiusersGetErr);
            }

            // Get Pushnotiusers list
            var pushnotiusers = pushnotiusersGetRes.body;

            // Set assertions
            // (pushnotiusers[0].user._id).should.equal(userId);
            (pushnotiusers[0].user_id).should.match('Pushnotiuser user id');
            (pushnotiusers[0].user_name).should.match('Pushnotiuser user name');
            (pushnotiusers[0].role).should.match('Pushnotiuser role');
            (pushnotiusers[0].device_token).should.match('Pushnotiuser device token');

            // Call the assertion callback
            done();
          });
      });
  });

  // it('should not be able to save an Pushnotiuser if not logged in', function (done) {
  //   agent.post('/api/pushnotiusers')
  //     .send(pushnotiuser)
  //     .expect(403)
  //     .end(function (pushnotiuserSaveErr, pushnotiuserSaveRes) {
  //       // Call the assertion callback
  //       done(pushnotiuserSaveErr);
  //     });
  // });

  it('should not be able to save an Pushnotiuser if no user id is provided', function (done) {
    // Invalidate name field
    pushnotiuser.user_id = '';

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

        // Save a new Pushnotiuser
        agent.post('/api/pushnotiusers')
          .send(pushnotiuser)
          .expect(400)
          .end(function (pushnotiuserSaveErr, pushnotiuserSaveRes) {
            // Set message assertion
            (pushnotiuserSaveRes.body.message).should.match('Please fill Pushnotiuser user id');

            // Handle Pushnotiuser save error
            done(pushnotiuserSaveErr);
          });
      });
  });

  it('should not be able to save an Pushnotiuser if no role is provided', function (done) {
    // Invalidate name field
    pushnotiuser.role = '';

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

        // Save a new Pushnotiuser
        agent.post('/api/pushnotiusers')
          .send(pushnotiuser)
          .expect(400)
          .end(function (pushnotiuserSaveErr, pushnotiuserSaveRes) {
            // Set message assertion
            (pushnotiuserSaveRes.body.message).should.match('Please fill Pushnotiuser role');

            // Handle Pushnotiuser save error
            done(pushnotiuserSaveErr);
          });
      });
  });

  it('should not be able to save an Pushnotiuser if no device token id is provided', function (done) {
    // Invalidate name field
    pushnotiuser.device_token = '';

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

        // Save a new Pushnotiuser
        agent.post('/api/pushnotiusers')
          .send(pushnotiuser)
          .expect(400)
          .end(function (pushnotiuserSaveErr, pushnotiuserSaveRes) {
            // Set message assertion
            (pushnotiuserSaveRes.body.message).should.match('Please fill Pushnotiuser device token');

            // Handle Pushnotiuser save error
            done(pushnotiuserSaveErr);
          });
      });
  });

  it('should be able to update an Pushnotiuser if signed in', function (done) {
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

        // Save a new Pushnotiuser
        agent.post('/api/pushnotiusers')
          .send(pushnotiuser)
          .expect(200)
          .end(function (pushnotiuserSaveErr, pushnotiuserSaveRes) {
            // Handle Pushnotiuser save error
            if (pushnotiuserSaveErr) {
              return done(pushnotiuserSaveErr);
            }

            // Update Pushnotiuser name
            pushnotiuser.user_id = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Pushnotiuser
            agent.put('/api/pushnotiusers/' + pushnotiuserSaveRes.body._id)
              .send(pushnotiuser)
              .expect(200)
              .end(function (pushnotiuserUpdateErr, pushnotiuserUpdateRes) {
                // Handle Pushnotiuser update error
                if (pushnotiuserUpdateErr) {
                  return done(pushnotiuserUpdateErr);
                }

                // Set assertions
                (pushnotiuserUpdateRes.body._id).should.equal(pushnotiuserSaveRes.body._id);
                (pushnotiuserUpdateRes.body.user_id).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pushnotiusers if not signed in', function (done) {
    // Create new Pushnotiuser model instance
    var pushnotiuserObj = new Pushnotiuser(pushnotiuser);

    // Save the pushnotiuser
    pushnotiuserObj.save(function () {
      // Request Pushnotiusers
      request(app).get('/api/pushnotiusers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Pushnotiuser if not signed in', function (done) {
    // Create new Pushnotiuser model instance
    var pushnotiuserObj = new Pushnotiuser(pushnotiuser);

    // Save the Pushnotiuser
    pushnotiuserObj.save(function () {
      request(app).get('/api/pushnotiusers/' + pushnotiuserObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('user_id', pushnotiuser.user_id);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Pushnotiuser with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pushnotiusers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Pushnotiuser is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Pushnotiuser which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Pushnotiuser
    request(app).get('/api/pushnotiusers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Pushnotiuser with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Pushnotiuser if signed in', function (done) {
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

        // Save a new Pushnotiuser
        agent.post('/api/pushnotiusers')
          .send(pushnotiuser)
          .expect(200)
          .end(function (pushnotiuserSaveErr, pushnotiuserSaveRes) {
            // Handle Pushnotiuser save error
            if (pushnotiuserSaveErr) {
              return done(pushnotiuserSaveErr);
            }

            // Delete an existing Pushnotiuser
            agent.delete('/api/pushnotiusers/' + pushnotiuserSaveRes.body._id)
              .send(pushnotiuser)
              .expect(200)
              .end(function (pushnotiuserDeleteErr, pushnotiuserDeleteRes) {
                // Handle pushnotiuser error error
                if (pushnotiuserDeleteErr) {
                  return done(pushnotiuserDeleteErr);
                }

                // Set assertions
                (pushnotiuserDeleteRes.body._id).should.equal(pushnotiuserSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  // it('should not be able to delete an Pushnotiuser if not signed in', function (done) {
  //   // Set Pushnotiuser user
  //   pushnotiuser.user = user;

  //   // Create new Pushnotiuser model instance
  //   var pushnotiuserObj = new Pushnotiuser(pushnotiuser);

  //   // Save the Pushnotiuser
  //   pushnotiuserObj.save(function () {
  //     // Try deleting Pushnotiuser
  //     request(app).delete('/api/pushnotiusers/' + pushnotiuserObj._id)
  //       .expect(403)
  //       .end(function (pushnotiuserDeleteErr, pushnotiuserDeleteRes) {
  //         // Set message assertion
  //         (pushnotiuserDeleteRes.body.message).should.match('User is not authorized');

  //         // Handle Pushnotiuser error error
  //         done(pushnotiuserDeleteErr);
  //       });

  //   });
  // });

  it('should be able to get a single Pushnotiuser that has an orphaned user reference', function (done) {
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

          // Save a new Pushnotiuser
          agent.post('/api/pushnotiusers')
            .send(pushnotiuser)
            .expect(200)
            .end(function (pushnotiuserSaveErr, pushnotiuserSaveRes) {
              // Handle Pushnotiuser save error
              if (pushnotiuserSaveErr) {
                return done(pushnotiuserSaveErr);
              }

              // Set assertions on new Pushnotiuser
              (pushnotiuserSaveRes.body.user_id).should.equal(pushnotiuser.user_id);
              should.exist(pushnotiuserSaveRes.body.user);
              should.equal(pushnotiuserSaveRes.body.user._id, orphanId);

              // force the Pushnotiuser to have an orphaned user reference
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

                    // Get the Pushnotiuser
                    agent.get('/api/pushnotiusers/' + pushnotiuserSaveRes.body._id)
                      .expect(200)
                      .end(function (pushnotiuserInfoErr, pushnotiuserInfoRes) {
                        // Handle Pushnotiuser error
                        if (pushnotiuserInfoErr) {
                          return done(pushnotiuserInfoErr);
                        }

                        // Set assertions
                        (pushnotiuserInfoRes.body._id).should.equal(pushnotiuserSaveRes.body._id);
                        (pushnotiuserInfoRes.body.user_id).should.equal(pushnotiuser.user_id);
                        should.equal(pushnotiuserInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  // it('get client IP-Address', function (done) {
  //   request(app).get('/api/getclientip')
  //     .end(function (req, res) {
  //       // Set assertion
  //       (res.body.clientIP).should.equal('');

  //       // Call the assertion callback
  //       done();
  //     });
  // });

  afterEach(function (done) {
    User.remove().exec(function () {
      Pushnotiuser.remove().exec(done);
    });
  });
});
