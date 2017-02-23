'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Postcode = mongoose.model('Postcode'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  postcode;

var tomorrow = new Date();


/**
 * Postcode routes tests
 */
describe('Postcode CRUD tests', function () {

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

    // Save a user to the test db and create new Postcode
    user.save(function () {
      postcode = {
        locationcode: '104203',
        province: 'กทม',
        district: 'สายไหม',
        subdistrict: 'คลองถนน',
        postcode: '10220'
      };

      done();
    });
  });

  it('should be able to save a Postcode if logged in', function (done) {
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

        // Save a new Postcode
        agent.post('/api/postcodes')
          .send(postcode)
          .expect(200)
          .end(function (postcodeSaveErr, postcodeSaveRes) {
            // Handle Postcode save error
            if (postcodeSaveErr) {
              return done(postcodeSaveErr);
            }

            // Get a list of Postcodes
            agent.get('/api/postcodes')
              .end(function (postcodesGetErr, postcodesGetRes) {
                // Handle Postcodes save error
                if (postcodesGetErr) {
                  return done(postcodesGetErr);
                }

                // Get Postcodes list
                var postcodes = postcodesGetRes.body;

                // Set assertions
                (postcodes[0].user._id).should.equal(userId);
                (postcodes[0].locationcode).should.match('104203');
                (postcodes[0].province).should.match('กทม');
                (postcodes[0].subdistrict).should.match('คลองถนน');
                (postcodes[0].postcode).should.match('10220');
                (postcodes[0].district).should.match('สายไหม');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to save a Postcode if logged in with token', function (done) {
    postcode.loginToken = user.loginToken;
    // Save a new Postcode
    agent.post('/api/postcodes')
      .send(postcode)
      .expect(200)
      .end(function (postcodeSaveErr, postcodeSaveRes) {
        // Handle Postcode save error
        if (postcodeSaveErr) {
          return done(postcodeSaveErr);
        }

        // Get a list of Postcodes
        agent.get('/api/postcodes')
          .end(function (postcodesGetErr, postcodesGetRes) {
            // Handle Postcodes save error
            if (postcodesGetErr) {
              return done(postcodesGetErr);
            }

            // Get Postcodes list
            var postcodes = postcodesGetRes.body;

            // Set assertions
            // (postcodes[0].user._id).should.equal(userId);
            (postcodes[0].locationcode).should.match('104203');
            (postcodes[0].province).should.match('กทม');
            (postcodes[0].subdistrict).should.match('คลองถนน');
            (postcodes[0].postcode).should.match('10220');
            (postcodes[0].district).should.match('สายไหม');


            // Call the assertion callback
            done();
          });
      });
  });

  it('should not be able to save an Postcode if not logged in', function (done) {
    agent.post('/api/postcodes')
      .send(postcode)
      .expect(403)
      .end(function (postcodeSaveErr, postcodeSaveRes) {
        // Call the assertion callback
        done(postcodeSaveErr);
      });
  });

  it('should not be able to save an Postcode if locationcode is duplicated', function (done) {

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

        // Save a new order
        agent.post('/api/postcodes')
          .send(postcode)
          .expect(200)
          .end(function (postcodeSaveErr, postcodeSaveRes) {
            // Handle order save error
            if (postcodeSaveErr) {
              return done(postcodeSaveErr);
            }
            // Save a new order
            agent.post('/api/postcodes')
              .send(postcode)
              .expect(400)
              .end(function (postcodeSaveErr, postcodeSaveRes) {
                // Set message assertion
                //(postcodeSaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.postcodes index: locationcode already exists');
                (postcodeSaveRes.body.message.toLowerCase()).should.containEql('locationcode already exists');

                // Handle order save error
                done(postcodeSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Postcode if no locationcode is provided', function (done) {
    // Invalidate docno field
    postcode.locationcode = '';

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

        // Save a new Order
        agent.post('/api/postcodes')
          .send(postcode)
          .expect(400)
          .end(function (postcodeSaveErr, postcodeSaveRes) {
            // Set message assertion
            (postcodeSaveRes.body.message).should.match('Please fill Postcode locationcode');

            // Handle Order save error
            done(postcodeSaveErr);
          });
      });
  });

  it('should not be able to save an Postcode if no province is provided', function (done) {
    // Invalidate docno field
    postcode.province = '';

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

        // Save a new Order
        agent.post('/api/postcodes')
          .send(postcode)
          .expect(400)
          .end(function (postcodeSaveErr, postcodeSaveRes) {
            // Set message assertion
            (postcodeSaveRes.body.message).should.match('Please fill Postcode province');

            // Handle Order save error
            done(postcodeSaveErr);
          });
      });
  });

  it('should not be able to save an Postcode if no district is provided', function (done) {
    // Invalidate docno field
    postcode.district = '';

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

        // Save a new Order
        agent.post('/api/postcodes')
          .send(postcode)
          .expect(400)
          .end(function (postcodeSaveErr, postcodeSaveRes) {
            // Set message assertion
            (postcodeSaveRes.body.message).should.match('Please fill Postcode district');

            // Handle Order save error
            done(postcodeSaveErr);
          });
      });
  });

  it('should not be able to save an Postcode if no postcode is provided', function (done) {
    // Invalidate docno field
    postcode.postcode = '';

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

        // Save a new Order
        agent.post('/api/postcodes')
          .send(postcode)
          .expect(400)
          .end(function (postcodeSaveErr, postcodeSaveRes) {
            // Set message assertion
            (postcodeSaveRes.body.message).should.match('Please fill Postcode postcode');

            // Handle Order save error
            done(postcodeSaveErr);
          });
      });
  });

  it('should be able to update an Postcode if signed in', function (done) {
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

        // Save a new Postcode
        agent.post('/api/postcodes')
          .send(postcode)
          .expect(200)
          .end(function (postcodeSaveErr, postcodeSaveRes) {
            // Handle Postcode save error
            if (postcodeSaveErr) {
              return done(postcodeSaveErr);
            }

            // Update Postcode name
            postcode.locationcode = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Postcode
            agent.put('/api/postcodes/' + postcodeSaveRes.body._id)
              .send(postcode)
              .expect(200)
              .end(function (postcodeUpdateErr, postcodeUpdateRes) {
                // Handle Postcode update error
                if (postcodeUpdateErr) {
                  return done(postcodeUpdateErr);
                }

                // Set assertions
                (postcodeUpdateRes.body._id).should.equal(postcodeSaveRes.body._id);
                (postcodeUpdateRes.body.locationcode).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Postcodes if not signed in', function (done) {
    // Create new Postcode model instance
    var postcodeObj = new Postcode(postcode);

    // Save the postcode
    postcodeObj.save(function () {
      // Request Postcodes
      request(app).get('/api/postcodes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Postcode if not signed in', function (done) {
    // Create new Postcode model instance
    var postcodeObj = new Postcode(postcode);

    // Save the Postcode
    postcodeObj.save(function () {
      request(app).get('/api/postcodes/' + postcodeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('locationcode', postcode.locationcode);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Postcode with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/postcodes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Postcode is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Postcode which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Postcode
    request(app).get('/api/postcodes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Postcode with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Postcode if signed in', function (done) {
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

        // Save a new Postcode
        agent.post('/api/postcodes')
          .send(postcode)
          .expect(200)
          .end(function (postcodeSaveErr, postcodeSaveRes) {
            // Handle Postcode save error
            if (postcodeSaveErr) {
              return done(postcodeSaveErr);
            }

            // Delete an existing Postcode
            agent.delete('/api/postcodes/' + postcodeSaveRes.body._id)
              .send(postcode)
              .expect(200)
              .end(function (postcodeDeleteErr, postcodeDeleteRes) {
                // Handle postcode error error
                if (postcodeDeleteErr) {
                  return done(postcodeDeleteErr);
                }

                // Set assertions
                (postcodeDeleteRes.body._id).should.equal(postcodeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Postcode if not signed in', function (done) {
    // Set Postcode user
    postcode.user = user;

    // Create new Postcode model instance
    var postcodeObj = new Postcode(postcode);

    // Save the Postcode
    postcodeObj.save(function () {
      // Try deleting Postcode
      request(app).delete('/api/postcodes/' + postcodeObj._id)
        .expect(403)
        .end(function (postcodeDeleteErr, postcodeDeleteRes) {
          // Set message assertion
          (postcodeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Postcode error error
          done(postcodeDeleteErr);
        });

    });
  });

  it('should be able to get a single Postcode that has an orphaned user reference', function (done) {
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

          // Save a new Postcode
          agent.post('/api/postcodes')
            .send(postcode)
            .expect(200)
            .end(function (postcodeSaveErr, postcodeSaveRes) {
              // Handle Postcode save error
              if (postcodeSaveErr) {
                return done(postcodeSaveErr);
              }

              // Set assertions on new Postcode
              (postcodeSaveRes.body.locationcode).should.equal(postcode.locationcode);
              should.exist(postcodeSaveRes.body.user);
              should.equal(postcodeSaveRes.body.user._id, orphanId);

              // force the Postcode to have an orphaned user reference
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

                    // Get the Postcode
                    agent.get('/api/postcodes/' + postcodeSaveRes.body._id)
                      .expect(200)
                      .end(function (postcodeInfoErr, postcodeInfoRes) {
                        // Handle Postcode error
                        if (postcodeInfoErr) {
                          return done(postcodeInfoErr);
                        }

                        // Set assertions
                        (postcodeInfoRes.body._id).should.equal(postcodeSaveRes.body._id);
                        (postcodeInfoRes.body.locationcode).should.equal(postcode.locationcode);
                        should.equal(postcodeInfoRes.body.user, undefined);

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
      Postcode.remove().exec(done);
    });
  });
});
