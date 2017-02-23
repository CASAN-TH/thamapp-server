'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Requestorder = mongoose.model('Requestorder'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  requestorder;

var tomorrow = new Date();


/**
 * Requestorder routes tests
 */
describe('Requestorder CRUD tests', function () {

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

    // Save a user to the test db and create new Requestorder
    user.save(function () {
      requestorder = {
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
        deliverystatus: 'confirmed'
      };

      done();
    });
  });

  it('should be able to save a Requestorder if logged in', function (done) {
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

        // Save a new requestorder
        agent.post('/api/requestorders')
          .send(requestorder)
          .expect(200)
          .end(function (requestorderSaveErr, requestorderSaveRes) {
            // Handle requestorder save error
            if (requestorderSaveErr) {
              return done(requestorderSaveErr);
            }

            // Get a list of requestorders
            agent.get('/api/requestorders')
              .end(function (requestordersGetErr, requestordersGetRes) {
                // Handle requestorders save error
                if (requestordersGetErr) {
                  return done(requestordersGetErr);
                }

                // Get requestorders list
                var requestorders = requestordersGetRes.body;

                // Set assertions
                (requestorders[0].user._id).should.equal(userId);
                (requestorders[0].docno).should.match('20170210');
                (requestorders[0].docdate).should.match(new Date());
                (requestorders[0].accounting).should.match('bank');
                (requestorders[0].deliverystatus).should.match('confirmed');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to save a Requestorder if logged in with token', function (done) {
    requestorder.loginToken = user.loginToken;
    // Save a new Requestorder
    agent.post('/api/requestorders')
      .send(requestorder)
      .expect(200)
      .end(function (requestorderSaveErr, requestorderSaveRes) {
        // Handle Requestorder save error
        if (requestorderSaveErr) {
          return done(requestorderSaveErr);
        }

        // Get a list of Requestorders
        agent.get('/api/requestorders')
          .end(function (requestordersGetErr, requestordersGetRes) {
            // Handle Requestorders save error
            if (requestordersGetErr) {
              return done(requestordersGetErr);
            }

            // Get Requestorders list
            var requestorders = requestordersGetRes.body;

            // Set assertions
            // (requestorders[0].user._id).should.equal(userId);
            (requestorders[0].docno).should.match('20170210');
            (requestorders[0].docdate).should.match(new Date());
            (requestorders[0].accounting).should.match('bank');
            (requestorders[0].deliverystatus).should.match('confirmed');

            // Call the assertion callback
            done();
          });
      });
  });

  it('should not be able to save an Requestorder if not logged in', function (done) {
    agent.post('/api/requestorders')
      .send(requestorder)
      .expect(403)
      .end(function (requestorderSaveErr, requestorderSaveRes) {
        // Call the assertion callback
        done(requestorderSaveErr);
      });
  });

  it('should not be able to save an Requestorder if docno is duplicated', function (done) {

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

        // Save a new requestorder
        agent.post('/api/requestorders')
          .send(requestorder)
          .expect(200)
          .end(function (requestorderSaveErr, requestorderSaveRes) {
            // Handle requestorder save error
            if (requestorderSaveErr) {
              return done(requestorderSaveErr);
            }
            // Save a new requestorder
            agent.post('/api/requestorders')
              .send(requestorder)
              .expect(400)
              .end(function (requestorderSaveErr, requestorderSaveRes) {
                // Set message assertion
                //(requestorderSaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.requestorders index: docno already exists');
                (requestorderSaveRes.body.message.toLowerCase()).should.containEql('docno already exists');

                // Handle requestorder save error
                done(requestorderSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Requestorder if no docno is provided', function (done) {
    // Invalidate docno field
    requestorder.docno = '';

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

        // Save a new requestorder
        agent.post('/api/requestorders')
          .send(requestorder)
          .expect(400)
          .end(function (requestorderSaveErr, requestorderSaveRes) {
            // Set message assertion
            (requestorderSaveRes.body.message).should.match('Please fill Requestorder docno');

            // Handle requestorder save error
            done(requestorderSaveErr);
          });
      });
  });

  it('should not be able to save an Requestorder if no accounting is provided', function (done) {
    // Invalidate docno field
    requestorder.accounting = '';

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

        // Save a new requestorder
        agent.post('/api/requestorders')
          .send(requestorder)
          .expect(400)
          .end(function (requestorderSaveErr, requestorderSaveRes) {
            // Set message assertion
            (requestorderSaveRes.body.message).should.match('Please fill Requestorder accounting');

            // Handle Order save error
            done(requestorderSaveErr);
          });
      });
  });

  it('should not be able to save an Requestorder if no docdate is provided', function (done) {
    // Invalidate docdate field
    requestorder.docdate = '';

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

        // Save a new requestorder
        agent.post('/api/requestorders')
          .send(requestorder)
          .expect(400)
          .end(function (requestorderSaveErr, requestorderSaveRes) {
            // Set message assertion
            (requestorderSaveRes.body.message).should.match('Please fill Requestorder docdate');

            // Handle requestorder save error
            done(requestorderSaveErr);
          });
      });
  });

  it('should be able to update an Requestorder if signed in', function (done) {
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

        // Save a new requestorder
        agent.post('/api/requestorders')
          .send(requestorder)
          .expect(200)
          .end(function (requestorderSaveErr, requestorderSaveRes) {
            // Handle requestorder save error
            if (requestorderSaveErr) {
              return done(requestorderSaveErr);
            }

            // Update requestorder docno
            requestorder.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing requestorder
            agent.put('/api/requestorders/' + requestorderSaveRes.body._id)
              .send(requestorder)
              .expect(200)
              .end(function (requestorderUpdateErr, requestorderUpdateRes) {
                // Handle Order update error
                if (requestorderUpdateErr) {
                  return done(requestorderUpdateErr);
                }

                // Set assertions
                (requestorderUpdateRes.body._id).should.equal(requestorderSaveRes.body._id);
                (requestorderUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Requestorders if not signed in', function (done) {
    // Create new Requestorder model instance
    var requestorderObj = new Requestorder(requestorder);

    // Save the requestorder
    requestorderObj.save(function () {
      // Request Requestorders
      request(app).get('/api/requestorders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Requestorder if not signed in', function (done) {
    // Create new Requestorder model instance
    var requestorderObj = new Requestorder(requestorder);

    // Save the Requestorder
    requestorderObj.save(function () {
      request(app).get('/api/requestorders/' + requestorderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', requestorder.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Requestorder with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/requestorders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Requestorder is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Requestorder which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Requestorder
    request(app).get('/api/requestorders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Requestorder with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Requestorder if signed in', function (done) {
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

        // Save a new Requestorder
        agent.post('/api/requestorders')
          .send(requestorder)
          .expect(200)
          .end(function (requestorderSaveErr, requestorderSaveRes) {
            // Handle Requestorder save error
            if (requestorderSaveErr) {
              return done(requestorderSaveErr);
            }

            // Delete an existing Requestorder
            agent.delete('/api/requestorders/' + requestorderSaveRes.body._id)
              .send(requestorder)
              .expect(200)
              .end(function (requestorderDeleteErr, requestorderDeleteRes) {
                // Handle requestorder error error
                if (requestorderDeleteErr) {
                  return done(requestorderDeleteErr);
                }

                // Set assertions
                (requestorderDeleteRes.body._id).should.equal(requestorderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Requestorder if not signed in', function (done) {
    // Set Requestorder user
    requestorder.user = user;

    // Create new Requestorder model instance
    var requestorderObj = new Requestorder(requestorder);

    // Save the Requestorder
    requestorderObj.save(function () {
      // Try deleting Requestorder
      request(app).delete('/api/requestorders/' + requestorderObj._id)
        .expect(403)
        .end(function (requestorderDeleteErr, requestorderDeleteRes) {
          // Set message assertion
          (requestorderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Requestorder error error
          done(requestorderDeleteErr);
        });

    });
  });

  it('should be able to get a single Requestorder that has an orphaned user reference', function (done) {
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

          // Save a new Requestorder
          agent.post('/api/requestorders')
            .send(requestorder)
            .expect(200)
            .end(function (requestorderSaveErr, requestorderSaveRes) {
              // Handle Requestorder save error
              if (requestorderSaveErr) {
                return done(requestorderSaveErr);
              }

              // Set assertions on new Requestorder
              (requestorderSaveRes.body.docno).should.equal(requestorder.docno);
              should.exist(requestorderSaveRes.body.user);
              should.equal(requestorderSaveRes.body.user._id, orphanId);

              // force the Requestorder to have an orphaned user reference
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

                    // Get the Requestorder
                    agent.get('/api/requestorders/' + requestorderSaveRes.body._id)
                      .expect(200)
                      .end(function (requestorderInfoErr, requestorderInfoRes) {
                        // Handle Requestorder error
                        if (requestorderInfoErr) {
                          return done(requestorderInfoErr);
                        }

                        // Set assertions
                        (requestorderInfoRes.body._id).should.equal(requestorderSaveRes.body._id);
                        (requestorderInfoRes.body.docno).should.equal(requestorder.docno);
                        should.equal(requestorderInfoRes.body.user, undefined);

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
      Requestorder.remove().exec(done);
    });
  });
});
