'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  company;

/**
 * Company routes tests
 */
describe('Company CRUD tests', function () {

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

    // Save a user to the test db and create new Company
    user.save(function () {
      company = {
        name: 'Company Name',
        address: 'Company Address',
        taxid: 'Company TaxId',
        brunch: 'Company Brunch',
        telofficeno: 'Company TelOfficeNo',
        mobileno: 'Company Mobile',
        faxno: 'Company FaxNo',
        email: 'Company Email',
        contact: 'Company Contact',
        website: 'Company Website',
        note: 'Company Note',
        accountno: '1001'
      };

      done();
    });
  });

  it('should be able to save a Company if logged in', function (done) {
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

        // Save a new Company
        agent.post('/api/companies')
          .send(company)
          .expect(200)
          .end(function (companySaveErr, companySaveRes) {
            // Handle Company save error
            if (companySaveErr) {
              return done(companySaveErr);
            }

            // Get a list of Companies
            agent.get('/api/companies')
              .end(function (companiesGetErr, companiesGetRes) {
                // Handle Companies save error
                if (companiesGetErr) {
                  return done(companiesGetErr);
                }

                // Get Companies list
                var companies = companiesGetRes.body;

                // Set assertions
                (companies[0].user._id).should.equal(userId);
                (companies[0].name).should.match('Company Name');
                (companies[0].address).should.match('Company Address');
                (companies[0].taxid).should.match('Company TaxId');
                (companies[0].brunch).should.match('Company Brunch');
                (companies[0].telofficeno).should.match('Company TelOfficeNo');
                (companies[0].mobileno).should.match('Company Mobile');
                (companies[0].faxno).should.match('Company FaxNo');
                (companies[0].email).should.match('Company Email');
                (companies[0].contact).should.match('Company Contact');
                (companies[0].website).should.match('Company Website');
                (companies[0].creditday).should.match(0);
                (companies[0].note).should.match('Company Note');
                (companies[0].accountno).should.match('1001');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Company if not logged in', function (done) {
    agent.post('/api/companies')
      .send(company)
      .expect(403)
      .end(function (companySaveErr, companySaveRes) {
        // Call the assertion callback
        done(companySaveErr);
      });
  });

  it('should not be able to save an Company if name is duplicated', function (done) {

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
        // Save a new company
        agent.post('/api/companies')
          .send(company)
          .expect(200)
          .end(function (companySaveErr, companySaveRes) {
            // Handle company save error
            if (companySaveErr) {
              return done(companySaveErr);
            }
            // Save a new company
            agent.post('/api/companies')
              .send(company)
              .expect(400)
              .end(function (companySaveErr, companySaveRes) {
                // Set message assertion
                (companySaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.companies index: name already exists');

                // Handle company save error
                done(companySaveErr);
              });

          });

      });
  });

  it('should not be able to save an Company if no name is provided', function (done) {
    // Invalidate name field
    company.name = '';

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

        // Save a new Company
        agent.post('/api/companies')
          .send(company)
          .expect(400)
          .end(function (companySaveErr, companySaveRes) {
            // Set message assertion
            (companySaveRes.body.message).should.match('Please fill Company name');

            // Handle Company save error
            done(companySaveErr);
          });
      });
  });

  it('should not be able to save an Company if no address is provided', function (done) {
    // Invalidate name field
    company.address = '';

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

        // Save a new Company
        agent.post('/api/companies')
          .send(company)
          .expect(400)
          .end(function (companySaveErr, companySaveRes) {
            // Set message assertion
            (companySaveRes.body.message).should.match('Please fill Company address');

            // Handle Company save error
            done(companySaveErr);
          });
      });
  });

  it('should not be able to save an Company if no accountno is provided', function (done) {
    // Invalidate name field
    company.accountno = '';

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

        // Save a new Company
        agent.post('/api/companies')
          .send(company)
          .expect(400)
          .end(function (companySaveErr, companySaveRes) {
            // Set message assertion
            (companySaveRes.body.message).should.match('Please fill Company accountno');

            // Handle Company save error
            done(companySaveErr);
          });
      });
  });

  it('should not be able to save an Company if taxid is duplicated', function (done) {

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
        company.name = 'New Company';
        // Save a new company
        agent.post('/api/companies')
          .send(company)
          .expect(200)
          .end(function (companySaveErr, companySaveRes) {
            // Handle company save error
            if (companySaveErr) {
              return done(companySaveErr);
            }
            // Save a new company
            agent.post('/api/companies')
              .send(company)
              .expect(400)
              .end(function (companySaveErr, companySaveRes) {
                // Set message assertion
                (companySaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.companies index: name already exists');

                // Handle company save error
                done(companySaveErr);
              });

          });

      });
  });

  it('should not be able to save an Company if no taxid is provided', function (done) {
    // Invalidate name field
    company.taxid = '';

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

        // Save a new Company
        agent.post('/api/companies')
          .send(company)
          .expect(400)
          .end(function (companySaveErr, companySaveRes) {
            // Set message assertion
            (companySaveRes.body.message).should.match('Please fill Company taxid');

            // Handle Company save error
            done(companySaveErr);
          });
      });
  });

  it('should be able to update an Company if signed in', function (done) {
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

        // Save a new Company
        agent.post('/api/companies')
          .send(company)
          .expect(200)
          .end(function (companySaveErr, companySaveRes) {
            // Handle Company save error
            if (companySaveErr) {
              return done(companySaveErr);
            }

            // Update Company name
            company.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Company
            agent.put('/api/companies/' + companySaveRes.body._id)
              .send(company)
              .expect(200)
              .end(function (companyUpdateErr, companyUpdateRes) {
                // Handle Company update error
                if (companyUpdateErr) {
                  return done(companyUpdateErr);
                }

                // Set assertions
                (companyUpdateRes.body._id).should.equal(companySaveRes.body._id);
                (companyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Companies if not signed in', function (done) {
    // Create new Company model instance
    var companyObj = new Company(company);

    // Save the company
    companyObj.save(function () {
      // Request Companies
      request(app).get('/api/companies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Company if not signed in', function (done) {
    // Create new Company model instance
    var companyObj = new Company(company);

    // Save the Company
    companyObj.save(function () {
      request(app).get('/api/companies/' + companyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', company.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Company with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/companies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Company is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Company which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Company
    request(app).get('/api/companies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Company with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Company if signed in', function (done) {
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

        // Save a new Company
        agent.post('/api/companies')
          .send(company)
          .expect(200)
          .end(function (companySaveErr, companySaveRes) {
            // Handle Company save error
            if (companySaveErr) {
              return done(companySaveErr);
            }

            // Delete an existing Company
            agent.delete('/api/companies/' + companySaveRes.body._id)
              .send(company)
              .expect(200)
              .end(function (companyDeleteErr, companyDeleteRes) {
                // Handle company error error
                if (companyDeleteErr) {
                  return done(companyDeleteErr);
                }

                // Set assertions
                (companyDeleteRes.body._id).should.equal(companySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Company if not signed in', function (done) {
    // Set Company user
    company.user = user;

    // Create new Company model instance
    var companyObj = new Company(company);

    // Save the Company
    companyObj.save(function () {
      // Try deleting Company
      request(app).delete('/api/companies/' + companyObj._id)
        .expect(403)
        .end(function (companyDeleteErr, companyDeleteRes) {
          // Set message assertion
          (companyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Company error error
          done(companyDeleteErr);
        });

    });
  });

  it('should be able to get a single Company that has an orphaned user reference', function (done) {
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

          // Save a new Company
          agent.post('/api/companies')
            .send(company)
            .expect(200)
            .end(function (companySaveErr, companySaveRes) {
              // Handle Company save error
              if (companySaveErr) {
                return done(companySaveErr);
              }

              // Set assertions on new Company
              (companySaveRes.body.name).should.equal(company.name);
              should.exist(companySaveRes.body.user);
              should.equal(companySaveRes.body.user._id, orphanId);

              // force the Company to have an orphaned user reference
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

                    // Get the Company
                    agent.get('/api/companies/' + companySaveRes.body._id)
                      .expect(200)
                      .end(function (companyInfoErr, companyInfoRes) {
                        // Handle Company error
                        if (companyInfoErr) {
                          return done(companyInfoErr);
                        }

                        // Set assertions
                        (companyInfoRes.body._id).should.equal(companySaveRes.body._id);
                        (companyInfoRes.body.name).should.equal(company.name);
                        should.equal(companyInfoRes.body.user, undefined);

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
      Company.remove().exec(done);
    });
  });
});
