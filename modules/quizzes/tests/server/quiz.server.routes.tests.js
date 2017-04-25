'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Quiz = mongoose.model('Quiz'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  quiz,
  quiz2;

/**
 * Quiz routes tests
 */
describe('Quiz CRUD tests', function () {

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

    // Save a user to the test db and create new Quiz
    user.save(function () {
      quiz = {
        topic: 'Topic Name',
        quizs: [{
          question: 'Question Name',
          questiontype: 'choice',
          choices: [{
            choice: 'Choice'
          }]
        }]
      };

      quiz2 = {
        topic: 'Topic Name',
        quizs: [{
          question: 'Question Name',
          questiontype: 'choice',
          choices: [{
            choice: 'Choice'
          }]
        }]
      };

      done();
    });
  });

  it('should be able to save a Quiz if logged in', function (done) {
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

        // Save a new Quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(200)
          .end(function (quizSaveErr, quizSaveRes) {
            // Handle Quiz save error
            if (quizSaveErr) {
              return done(quizSaveErr);
            }

            // Get a list of Quizzes
            agent.get('/api/quizzes')
              .end(function (quizzesGetErr, quizzesGetRes) {
                // Handle Quizzes save error
                if (quizzesGetErr) {
                  return done(quizzesGetErr);
                }
                // Get Quizzes list
                var quizzes = quizzesGetRes.body;

                // Set assertions
                (quizzes[0].user._id).should.equal(userId);
                // (quizzes[0]).should.equal('');
                // done();
                (quizzes[0].topic).should.match('Topic Name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Quiz if not logged in', function (done) {
    agent.post('/api/quizzes')
      .send(quiz)
      .expect(403)
      .end(function (quizSaveErr, quizSaveRes) {
        // Call the assertion callback
        done(quizSaveErr);
      });
  });

  it('should not be able to save an Quiz if no topic is provided', function (done) {
    // Invalidate name field
    quiz.topic = '';

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

        // Save a new Quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(400)
          .end(function (quizSaveErr, quizSaveRes) {
            // Set message assertion
            (quizSaveRes.body.message).should.match('Please fill Topic name');

            // Handle Quiz save error
            done(quizSaveErr);
          });
      });
  });

  it('should not be able to save an Quiz if topic is duplicated', function (done) {

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
        // Save a new Quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(200)
          .end(function (quizSaveErr, quizSaveRes) {
            // Handle quiz save error
            if (quizSaveErr) {
              return done(quizSaveErr);
            }
            // Save a new quiz
            agent.post('/api/quizzes')
              .send(quiz)
              .expect(400)
              .end(function (quizSaveErr, quizSaveRes) {
                // Set message assertion
                (quizSaveRes.body.message.toLowerCase()).should.endWith('topic already exists');

                // Handle company save error
                done(quizSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Quiz if no question is provided', function (done) {
    // Invalidate name field
    quiz.question = '';

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

        // Save a new Quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(200)
          .end(function (quizSaveErr, quizSaveRes) {

            // Handle Payment save error
            done(quizSaveErr);
          });
      });
  });

  it('should not be able to save an Quiz if question is duplicated', function (done) {

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
        // Save a new Quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(200)
          .end(function (quizSaveErr, quizSaveRes) {
            // Handle quiz save error
            if (quizSaveErr) {
              return done(quizSaveErr);
            }
            // Save a new quiz
            agent.post('/api/quizzes')
              .send(quiz)
              .expect(400)
              .end(function (quizSaveErr, quizSaveRes) {
                // Set message assertion
                // (quizSaveRes.body.message.toLowerCase()).should.endWith('topic already exists');

                // Handle company save error
                done(quizSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Quiz if no quizs is provided', function (done) {
    // Invalidate name field
    quiz.quizs = null;

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

        // Save a new Quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(400)
          .end(function (quizSaveErr, quizSaveRes) {
            // Set message assertion
            (quizSaveRes.body.message).should.match('Please fill Quizs name');

            // Handle Quiz save error
            done(quizSaveErr);
          });
      });
  });

  it('should be able to update an Quiz if signed in', function (done) {
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

        // Save a new Quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(200)
          .end(function (quizSaveErr, quizSaveRes) {
            // Handle Quiz save error
            if (quizSaveErr) {
              return done(quizSaveErr);
            }

            // Update Quiz name
            quiz.topic = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Quiz
            agent.put('/api/quizzes/' + quizSaveRes.body._id)
              .send(quiz)
              .expect(200)
              .end(function (quizUpdateErr, quizUpdateRes) {
                // Handle Quiz update error
                if (quizUpdateErr) {
                  return done(quizUpdateErr);
                }

                // Set assertions
                (quizUpdateRes.body._id).should.equal(quizSaveRes.body._id);
                (quizUpdateRes.body.topic).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Quizzes if not signed in', function (done) {
    // Create new Quiz model instance
    var quizObj = new Quiz(quiz);

    // Save the quiz
    quizObj.save(function () {
      // Request Quizzes
      request(app).get('/api/quizzes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Quiz if not signed in', function (done) {
    // Create new Quiz model instance
    var quizObj = new Quiz(quiz);

    // Save the Quiz
    quizObj.save(function () {
      request(app).get('/api/quizzes/' + quizObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('topic', quiz.topic);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Quiz with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/quizzes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Quiz is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Quiz which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Quiz
    request(app).get('/api/quizzes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Quiz with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Quiz if signed in', function (done) {
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

        // Save a new Quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(200)
          .end(function (quizSaveErr, quizSaveRes) {
            // Handle Quiz save error
            if (quizSaveErr) {
              return done(quizSaveErr);
            }

            // Delete an existing Quiz
            agent.delete('/api/quizzes/' + quizSaveRes.body._id)
              .send(quiz)
              .expect(200)
              .end(function (quizDeleteErr, quizDeleteRes) {
                // Handle quiz error error
                if (quizDeleteErr) {
                  return done(quizDeleteErr);
                }

                // Set assertions
                (quizDeleteRes.body._id).should.equal(quizSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Quiz if not signed in', function (done) {
    // Set Quiz user
    quiz.user = user;

    // Create new Quiz model instance
    var quizObj = new Quiz(quiz);

    // Save the Quiz
    quizObj.save(function () {
      // Try deleting Quiz
      request(app).delete('/api/quizzes/' + quizObj._id)
        .expect(403)
        .end(function (quizDeleteErr, quizDeleteRes) {
          // Set message assertion
          (quizDeleteRes.body.message).should.match('User is not authorized');

          // Handle Quiz error error
          done(quizDeleteErr);
        });

    });
  });

  it('should be able to get a single Quiz that has an orphaned user reference', function (done) {
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

          // Save a new Quiz
          agent.post('/api/quizzes')
            .send(quiz)
            .expect(200)
            .end(function (quizSaveErr, quizSaveRes) {
              // Handle Quiz save error
              if (quizSaveErr) {
                return done(quizSaveErr);
              }

              // Set assertions on new Quiz
              (quizSaveRes.body.topic).should.equal(quiz.topic);
              should.exist(quizSaveRes.body.user);
              should.equal(quizSaveRes.body.user._id, orphanId);

              // force the Quiz to have an orphaned user reference
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

                    // Get the Quiz
                    agent.get('/api/quizzes/' + quizSaveRes.body._id)
                      .expect(200)
                      .end(function (quizInfoErr, quizInfoRes) {
                        // Handle Quiz error
                        if (quizInfoErr) {
                          return done(quizInfoErr);
                        }

                        // Set assertions
                        (quizInfoRes.body._id).should.equal(quizSaveRes.body._id);
                        (quizInfoRes.body.topic).should.equal(quiz.topic);
                        should.equal(quizInfoRes.body.user, undefined);

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
      Quiz.remove().exec(done);
    });
  });
});
