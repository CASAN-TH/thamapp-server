'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Returnorder = mongoose.model('Returnorder'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  returnorder;

var tomorrow = new Date();


/**
 * Returnorder routes tests
 */
describe('Returnorder CRUD tests', function () {

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

    // Save a user to the test db and create new Returnorder
    user.save(function () {
      returnorder = {
        docno: '20170210',
        docdate: new Date(),
        items: [{
          qty: 1,
          price: 100,
          amount: 100
        }],
        shipping: {
          postcode: 10220,
          subdistrict: 'คลองถนน',
          province: 'กรุงเทพฯ',
          district: 'สายไหม',
          tel: '0900077580',
          email: 'destinationpainbm@gmail.com'
        },
        accounting: 'bank',
        imgslip: 'picture',
        postcost: 10,
        discount: 10,
        comment: 'comment',
        trackingnumber: 'tracking Number',
        deliverystatus: 'return'
      };

      done();
    });
  });

  it('should be able to save a Returnorder if logged in', function (done) {
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

        // Save a new returnorder
        agent.post('/api/returnorders')
          .send(returnorder)
          .expect(200)
          .end(function (returnorderSaveErr, returnorderSaveRes) {
            // Handle returnorder save error
            if (returnorderSaveErr) {
              return done(returnorderSaveErr);
            }

            // Get a list of returnorders
            agent.get('/api/returnorders')
              .end(function (returnordersGetErr, returnordersGetRes) {
                // Handle returnorders save error
                if (returnordersGetErr) {
                  return done(returnordersGetErr);
                }

                // Get returnorders list
                var returnorders = returnordersGetRes.body;

                // Set assertions
                (returnorders[0].user._id).should.equal(userId);
                (returnorders[0].docno).should.match('20170210');
                (returnorders[0].docdate).should.match(new Date());
                (returnorders[0].accounting).should.match('bank');
                (returnorders[0].deliverystatus).should.match('return');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to save a Returnorder if logged in with token', function (done) {
    returnorder.loginToken = user.loginToken;
    // Save a new Returnorder
    agent.post('/api/returnorders')
      .send(returnorder)
      .expect(200)
      .end(function (returnorderSaveErr, returnorderSaveRes) {
        // Handle Returnorder save error
        if (returnorderSaveErr) {
          return done(returnorderSaveErr);
        }

        // Get a list of Returnorders
        agent.get('/api/returnorders')
          .end(function (returnordersGetErr, returnordersGetRes) {
            // Handle Returnorders save error
            if (returnordersGetErr) {
              return done(returnordersGetErr);
            }

            // Get Returnorders list
            var returnorders = returnordersGetRes.body;

            // Set assertions
            // (returnorders[0].user._id).should.equal(userId);
            (returnorders[0].docno).should.match('20170210');
            (returnorders[0].docdate).should.match(new Date());
            (returnorders[0].accounting).should.match('bank');
            (returnorders[0].deliverystatus).should.match('return');

            // Call the assertion callback
            done();
          });
      });
  });

  it('should not be able to save an Returnorder if not logged in', function (done) {
    agent.post('/api/returnorders')
      .send(returnorder)
      .expect(403)
      .end(function (returnorderSaveErr, returnorderSaveRes) {
        // Call the assertion callback
        done(returnorderSaveErr);
      });
  });

  it('should not be able to save an Returnorder if docno is duplicated', function (done) {

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

        // Save a new returnorder
        agent.post('/api/returnorders')
          .send(returnorder)
          .expect(200)
          .end(function (returnorderSaveErr, returnorderSaveRes) {
            // Handle returnorder save error
            if (returnorderSaveErr) {
              return done(returnorderSaveErr);
            }
            // Save a new returnorder
            agent.post('/api/returnorders')
              .send(returnorder)
              .expect(400)
              .end(function (returnorderSaveErr, returnorderSaveRes) {
                // Set message assertion
                //(requestorderSaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.requestorders index: docno already exists');
                (returnorderSaveRes.body.message.toLowerCase()).should.containEql('docno already exists');

                // Handle requestorder save error
                done(returnorderSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Returnorder if no docno is provided', function (done) {
    // Invalidate docno field
    returnorder.docno = '';

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

        // Save a new returnorder
        agent.post('/api/returnorders')
          .send(returnorder)
          .expect(400)
          .end(function (returnorderSaveErr, returnorderSaveRes) {
            // Set message assertion
            (returnorderSaveRes.body.message).should.match('Please fill Returnorder docno');

            // Handle returnorder save error
            done(returnorderSaveErr);
          });
      });
  });

  it('should not be able to save an Returnorder if no accounting is provided', function (done) {
    // Invalidate name field
    returnorder.accounting = '';

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

        // Save a new Returnorder
        agent.post('/api/returnorders')
          .send(returnorder)
          .expect(400)
          .end(function (returnorderSaveErr, returnorderSaveRes) {
            // Set message assertion
            (returnorderSaveRes.body.message).should.match('Please fill Returnorder accounting');

            // Handle Returnorder save error
            done(returnorderSaveErr);
          });
      });
  });

  it('should not be able to save an Returnorder if no docdate is provided', function (done) {
    // Invalidate docdate field
    returnorder.docdate = '';

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

        // Save a new returnorder
        agent.post('/api/returnorders')
          .send(returnorder)
          .expect(400)
          .end(function (returnorderSaveErr, returnorderSaveRes) {
            // Set message assertion
            (returnorderSaveRes.body.message).should.match('Please fill Returnorder docdate');

            // Handle requestorder save error
            done(returnorderSaveErr);
          });
      });
  });

  it('should be able to update an Returnorder if signed in', function (done) {
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

        // Save a new Returnorder
        agent.post('/api/returnorders')
          .send(returnorder)
          .expect(200)
          .end(function (returnorderSaveErr, returnorderSaveRes) {
            // Handle Returnorder save error
            if (returnorderSaveErr) {
              return done(returnorderSaveErr);
            }

            // Update Returnorder docno
            returnorder.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Returnorder
            agent.put('/api/returnorders/' + returnorderSaveRes.body._id)
              .send(returnorder)
              .expect(200)
              .end(function (returnorderUpdateErr, returnorderUpdateRes) {
                // Handle Returnorder update error
                if (returnorderUpdateErr) {
                  return done(returnorderUpdateErr);
                }

                // Set assertions
                (returnorderUpdateRes.body._id).should.equal(returnorderSaveRes.body._id);
                (returnorderUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Returnorders if not signed in', function (done) {
    // Create new Returnorder model instance
    var returnorderObj = new Returnorder(returnorder);

    // Save the returnorder
    returnorderObj.save(function () {
      // Request Returnorders
      request(app).get('/api/returnorders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Returnorder if not signed in', function (done) {
    // Create new Returnorder model instance
    var returnorderObj = new Returnorder(returnorder);

    // Save the Returnorder
    returnorderObj.save(function () {
      request(app).get('/api/returnorders/' + returnorderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', returnorder.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Returnorder with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/returnorders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Returnorder is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Returnorder which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Returnorder
    request(app).get('/api/returnorders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Returnorder with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Returnorder if signed in', function (done) {
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

        // Save a new Returnorder
        agent.post('/api/returnorders')
          .send(returnorder)
          .expect(200)
          .end(function (returnorderSaveErr, returnorderSaveRes) {
            // Handle Returnorder save error
            if (returnorderSaveErr) {
              return done(returnorderSaveErr);
            }

            // Delete an existing Returnorder
            agent.delete('/api/returnorders/' + returnorderSaveRes.body._id)
              .send(returnorder)
              .expect(200)
              .end(function (returnorderDeleteErr, returnorderDeleteRes) {
                // Handle returnorder error error
                if (returnorderDeleteErr) {
                  return done(returnorderDeleteErr);
                }

                // Set assertions
                (returnorderDeleteRes.body._id).should.equal(returnorderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Returnorder if not signed in', function (done) {
    // Set Returnorder user
    returnorder.user = user;

    // Create new Returnorder model instance
    var returnorderObj = new Returnorder(returnorder);

    // Save the Returnorder
    returnorderObj.save(function () {
      // Try deleting Returnorder
      request(app).delete('/api/returnorders/' + returnorderObj._id)
        .expect(403)
        .end(function (returnorderDeleteErr, returnorderDeleteRes) {
          // Set message assertion
          (returnorderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Returnorder error error
          done(returnorderDeleteErr);
        });

    });
  });

  it('should be able to get a single Returnorder that has an orphaned user reference', function (done) {
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

          // Save a new Returnorder
          agent.post('/api/returnorders')
            .send(returnorder)
            .expect(200)
            .end(function (returnorderSaveErr, returnorderSaveRes) {
              // Handle Returnorder save error
              if (returnorderSaveErr) {
                return done(returnorderSaveErr);
              }

              // Set assertions on new Returnorder
              (returnorderSaveRes.body.docno).should.equal(returnorder.docno);
              should.exist(returnorderSaveRes.body.user);
              should.equal(returnorderSaveRes.body.user._id, orphanId);

              // force the Returnorder to have an orphaned user reference
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

                    // Get the Returnorder
                    agent.get('/api/returnorders/' + returnorderSaveRes.body._id)
                      .expect(200)
                      .end(function (returnorderInfoErr, returnorderInfoRes) {
                        // Handle Returnorder error
                        if (returnorderInfoErr) {
                          return done(returnorderInfoErr);
                        }

                        // Set assertions
                        (returnorderInfoRes.body._id).should.equal(returnorderSaveRes.body._id);
                        (returnorderInfoRes.body.docno).should.equal(returnorder.docno);
                        should.equal(returnorderInfoRes.body.user, undefined);

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
      Returnorder.remove().exec(done);
    });
  });
});
