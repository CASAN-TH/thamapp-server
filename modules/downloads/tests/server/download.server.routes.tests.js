'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Download = mongoose.model('Download'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  download;

/**
 * Download routes tests
 */
describe('Download CRUD tests', function () {

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

    // Save a user to the test db and create new Download
    user.save(function () {
      download = {
        name: 'Download name'
      };

      done();
    });
  });

  it('should be able to save a Download if logged in', function (done) {
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

        // Save a new Download
        agent.post('/api/downloads')
          .send(download)
          .expect(200)
          .end(function (downloadSaveErr, downloadSaveRes) {
            // Handle Download save error
            if (downloadSaveErr) {
              return done(downloadSaveErr);
            }

            // Get a list of Downloads
            agent.get('/api/downloads')
              .end(function (downloadsGetErr, downloadsGetRes) {
                // Handle Downloads save error
                if (downloadsGetErr) {
                  return done(downloadsGetErr);
                }

                // Get Downloads list
                var downloads = downloadsGetRes.body;

                // Set assertions
                (downloads[0].user._id).should.equal(userId);
                (downloads[0].name).should.match('Download name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Download if not logged in', function (done) {
    agent.post('/api/downloads')
      .send(download)
      .expect(403)
      .end(function (downloadSaveErr, downloadSaveRes) {
        // Call the assertion callback
        done(downloadSaveErr);
      });
  });

  it('should not be able to save an Download if no name is provided', function (done) {
    // Invalidate name field
    download.name = '';

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

        // Save a new Download
        agent.post('/api/downloads')
          .send(download)
          .expect(400)
          .end(function (downloadSaveErr, downloadSaveRes) {
            // Set message assertion
            (downloadSaveRes.body.message).should.match('Please fill Download name');

            // Handle Download save error
            done(downloadSaveErr);
          });
      });
  });

  it('should be able to update an Download if signed in', function (done) {
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

        // Save a new Download
        agent.post('/api/downloads')
          .send(download)
          .expect(200)
          .end(function (downloadSaveErr, downloadSaveRes) {
            // Handle Download save error
            if (downloadSaveErr) {
              return done(downloadSaveErr);
            }

            // Update Download name
            download.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Download
            agent.put('/api/downloads/' + downloadSaveRes.body._id)
              .send(download)
              .expect(200)
              .end(function (downloadUpdateErr, downloadUpdateRes) {
                // Handle Download update error
                if (downloadUpdateErr) {
                  return done(downloadUpdateErr);
                }

                // Set assertions
                (downloadUpdateRes.body._id).should.equal(downloadSaveRes.body._id);
                (downloadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Downloads if not signed in', function (done) {
    // Create new Download model instance
    var downloadObj = new Download(download);

    // Save the download
    downloadObj.save(function () {
      // Request Downloads
      request(app).get('/api/downloads')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Download if not signed in', function (done) {
    // Create new Download model instance
    var downloadObj = new Download(download);

    // Save the Download
    downloadObj.save(function () {
      request(app).get('/api/downloads/' + downloadObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', download.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Download with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/downloads/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Download is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Download which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Download
    request(app).get('/api/downloads/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Download with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Download if signed in', function (done) {
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

        // Save a new Download
        agent.post('/api/downloads')
          .send(download)
          .expect(200)
          .end(function (downloadSaveErr, downloadSaveRes) {
            // Handle Download save error
            if (downloadSaveErr) {
              return done(downloadSaveErr);
            }

            // Delete an existing Download
            agent.delete('/api/downloads/' + downloadSaveRes.body._id)
              .send(download)
              .expect(200)
              .end(function (downloadDeleteErr, downloadDeleteRes) {
                // Handle download error error
                if (downloadDeleteErr) {
                  return done(downloadDeleteErr);
                }

                // Set assertions
                (downloadDeleteRes.body._id).should.equal(downloadSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Download if not signed in', function (done) {
    // Set Download user
    download.user = user;

    // Create new Download model instance
    var downloadObj = new Download(download);

    // Save the Download
    downloadObj.save(function () {
      // Try deleting Download
      request(app).delete('/api/downloads/' + downloadObj._id)
        .expect(403)
        .end(function (downloadDeleteErr, downloadDeleteRes) {
          // Set message assertion
          (downloadDeleteRes.body.message).should.match('User is not authorized');

          // Handle Download error error
          done(downloadDeleteErr);
        });

    });
  });

  it('should be able to get a single Download that has an orphaned user reference', function (done) {
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

          // Save a new Download
          agent.post('/api/downloads')
            .send(download)
            .expect(200)
            .end(function (downloadSaveErr, downloadSaveRes) {
              // Handle Download save error
              if (downloadSaveErr) {
                return done(downloadSaveErr);
              }

              // Set assertions on new Download
              (downloadSaveRes.body.name).should.equal(download.name);
              should.exist(downloadSaveRes.body.user);
              should.equal(downloadSaveRes.body.user._id, orphanId);

              // force the Download to have an orphaned user reference
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

                    // Get the Download
                    agent.get('/api/downloads/' + downloadSaveRes.body._id)
                      .expect(200)
                      .end(function (downloadInfoErr, downloadInfoRes) {
                        // Handle Download error
                        if (downloadInfoErr) {
                          return done(downloadInfoErr);
                        }

                        // Set assertions
                        (downloadInfoRes.body._id).should.equal(downloadSaveRes.body._id);
                        (downloadInfoRes.body.name).should.equal(download.name);
                        should.equal(downloadInfoRes.body.user, undefined);

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
      Download.remove().exec(done);
    });
  });
});
