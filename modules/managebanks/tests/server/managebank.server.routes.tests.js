'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Managebank = mongoose.model('Managebank'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  managebank;

/**
 * Managebank routes tests
 */
describe('Managebank CRUD tests', function () {

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

    // Save a user to the test db and create new Managebank
    user.save(function () {
      managebank = {
        bankname: 'bankname',
        accountname: 'accountname',
        accountnumber: '12345',
        branch: 'branch'
      };

      done();
    });
  });

  it('should be able to save a Managebank if logged in', function (done) {
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

        // Save a new Managebank
        agent.post('/api/managebanks')
          .send(managebank)
          .expect(200)
          .end(function (managebankSaveErr, managebankSaveRes) {
            // Handle Managebank save error
            if (managebankSaveErr) {
              return done(managebankSaveErr);
            }

            // Get a list of Managebanks
            agent.get('/api/managebanks')
              .end(function (managebanksGetErr, managebanksGetRes) {
                // Handle Managebanks save error
                if (managebanksGetErr) {
                  return done(managebanksGetErr);
                }

                // Get Managebanks list
                var managebanks = managebanksGetRes.body;

                // Set assertions
                (managebanks[0].user._id).should.equal(userId);
                (managebanks[0].bankname).should.match('bankname');
                (managebanks[0].accountname).should.match('accountname');
                (managebanks[0].accountnumber).should.match('12345');
                (managebanks[0].branch).should.match('branch');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Managebank if not logged in', function (done) {
    agent.post('/api/managebanks')
      .send(managebank)
      .expect(403)
      .end(function (managebankSaveErr, managebankSaveRes) {
        // Call the assertion callback
        done(managebankSaveErr);
      });
  });

  // it('should not be able to save an Managebank if accountnumber is duplicated', function (done) {

  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }

  //       // Get the userId
  //       var userId = user.id;

  //       // Save a new managebank
  //       agent.post('/api/managebanks')
  //         .send(managebank)
  //         .expect(200)
  //         .end(function (managebankSaveErr, managebankSaveRes) {
  //           // Handle managebank save error
  //           if (managebankSaveErr) {
  //             return done(managebankSaveErr);
  //           }
  //           // Save a new managebank
  //           agent.post('/api/managebanks')
  //             .send(managebank)
  //             .expect(400)
  //             .end(function (managebankSaveErr, managebankSaveRes) {
  //               // Set message assertion
  //               (managebankSaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.managebanks index: accountnumber already exists');
  //               (managebankSaveRes.body.message.toLowerCase()).should.containEql('accountnumber already exists');

  //               // Handle order save error
  //               done(managebankSaveErr);
  //             });

  //         });

  //     });
  // });  

  it('should not be able to save an Managebank if no bankname is provided', function (done) {
    // Invalidate name field
    managebank.bankname = '';

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

        // Save a new Managebank
        agent.post('/api/managebanks')
          .send(managebank)
          .expect(400)
          .end(function (managebankSaveErr, managebankSaveRes) {
            // Set message assertion
            (managebankSaveRes.body.message).should.match('Please fill bankname');

            // Handle Managebank save error
            done(managebankSaveErr);
          });
      });
  });
  it('should not be able to save an Managebank if no accountname is provided', function (done) {
    // Invalidate name field
    managebank.accountname = '';

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

        // Save a new Managebank
        agent.post('/api/managebanks')
          .send(managebank)
          .expect(400)
          .end(function (managebankSaveErr, managebankSaveRes) {
            // Set message assertion
            (managebankSaveRes.body.message).should.match('Please fill accountname');

            // Handle Managebank save error
            done(managebankSaveErr);
          });
      });
  });
  it('should not be able to save an Managebank if no accountnumber is provided', function (done) {
    // Invalidate name field
    managebank.accountnumber = '';

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

        // Save a new Managebank
        agent.post('/api/managebanks')
          .send(managebank)
          .expect(400)
          .end(function (managebankSaveErr, managebankSaveRes) {
            // Set message assertion
            (managebankSaveRes.body.message).should.match('Please fill accountnumber');

            // Handle Managebank save error
            done(managebankSaveErr);
          });
      });
  });
  it('should not be able to save an Managebank if no branch is provided', function (done) {
    // Invalidate name field
    managebank.branch = '';

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

        // Save a new Managebank
        agent.post('/api/managebanks')
          .send(managebank)
          .expect(400)
          .end(function (managebankSaveErr, managebankSaveRes) {
            // Set message assertion
            (managebankSaveRes.body.message).should.match('Please fill branch');

            // Handle Managebank save error
            done(managebankSaveErr);
          });
      });
  });

  it('should be able to update an Managebank if signed in', function (done) {
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

        // Save a new Managebank
        agent.post('/api/managebanks')
          .send(managebank)
          .expect(200)
          .end(function (managebankSaveErr, managebankSaveRes) {
            // Handle Managebank save error
            if (managebankSaveErr) {
              return done(managebankSaveErr);
            }

            // Update Managebank name
            managebank.accountnumber = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Managebank
            agent.put('/api/managebanks/' + managebankSaveRes.body._id)
              .send(managebank)
              .expect(200)
              .end(function (managebankUpdateErr, managebankUpdateRes) {
                // Handle Managebank update error
                if (managebankUpdateErr) {
                  return done(managebankUpdateErr);
                }

                // Set assertions
                (managebankUpdateRes.body._id).should.equal(managebankSaveRes.body._id);
                (managebankUpdateRes.body.accountnumber).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Managebanks if not signed in', function (done) {
    // Create new Managebank model instance
    var managebankObj = new Managebank(managebank);

    // Save the managebank
    managebankObj.save(function () {
      // Request Managebanks
      request(app).get('/api/managebanks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Managebank if not signed in', function (done) {
    // Create new Managebank model instance
    var managebankObj = new Managebank(managebank);

    // Save the Managebank
    managebankObj.save(function () {
      request(app).get('/api/managebanks/' + managebankObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('accountnumber', managebank.accountnumber);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Managebank with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/managebanks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Managebank is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Managebank which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Managebank
    request(app).get('/api/managebanks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Managebank with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Managebank if signed in', function (done) {
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

        // Save a new Managebank
        agent.post('/api/managebanks')
          .send(managebank)
          .expect(200)
          .end(function (managebankSaveErr, managebankSaveRes) {
            // Handle Managebank save error
            if (managebankSaveErr) {
              return done(managebankSaveErr);
            }

            // Delete an existing Managebank
            agent.delete('/api/managebanks/' + managebankSaveRes.body._id)
              .send(managebank)
              .expect(200)
              .end(function (managebankDeleteErr, managebankDeleteRes) {
                // Handle managebank error error
                if (managebankDeleteErr) {
                  return done(managebankDeleteErr);
                }

                // Set assertions
                (managebankDeleteRes.body._id).should.equal(managebankSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Managebank if not signed in', function (done) {
    // Set Managebank user
    managebank.user = user;

    // Create new Managebank model instance
    var managebankObj = new Managebank(managebank);

    // Save the Managebank
    managebankObj.save(function () {
      // Try deleting Managebank
      request(app).delete('/api/managebanks/' + managebankObj._id)
        .expect(403)
        .end(function (managebankDeleteErr, managebankDeleteRes) {
          // Set message assertion
          (managebankDeleteRes.body.message).should.match('User is not authorized');

          // Handle Managebank error error
          done(managebankDeleteErr);
        });

    });
  });

  it('should be able to get a single Managebank that has an orphaned user reference', function (done) {
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

          // Save a new Managebank
          agent.post('/api/managebanks')
            .send(managebank)
            .expect(200)
            .end(function (managebankSaveErr, managebankSaveRes) {
              // Handle Managebank save error
              if (managebankSaveErr) {
                return done(managebankSaveErr);
              }

              // Set assertions on new Managebank
              (managebankSaveRes.body.accountnumber).should.equal(managebank.accountnumber);
              should.exist(managebankSaveRes.body.user);
              should.equal(managebankSaveRes.body.user._id, orphanId);

              // force the Managebank to have an orphaned user reference
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

                    // Get the Managebank
                    agent.get('/api/managebanks/' + managebankSaveRes.body._id)
                      .expect(200)
                      .end(function (managebankInfoErr, managebankInfoRes) {
                        // Handle Managebank error
                        if (managebankInfoErr) {
                          return done(managebankInfoErr);
                        }

                        // Set assertions
                        (managebankInfoRes.body._id).should.equal(managebankSaveRes.body._id);
                        (managebankInfoRes.body.accountnumber).should.equal(managebank.accountnumber);
                        should.equal(managebankInfoRes.body.user, undefined);

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
      Managebank.remove().exec(done);
    });
  });
});
