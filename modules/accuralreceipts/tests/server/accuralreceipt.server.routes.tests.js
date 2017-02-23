'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Accuralreceipt = mongoose.model('Accuralreceipt'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  accuralreceipt;

var tomorrow = new Date();


/**
 * Accuralreceipt routes tests
 */
describe('Accuralreceipt CRUD tests', function () {

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

    // Save a user to the test db and create new Accuralreceipt
    user.save(function () {
      accuralreceipt = {
        docno: '1234',
        docdate: new Date(),
        items: [{
            _id: '58acffde1799e2e820610440',
            docdate: '2017-02-22T03:04:57.167Z',
            shipping: {
              firstname: 'deliver_12345',
              lastname: 'ver',
              address: '77/8',
              postcode: '12150',
              subdistrict: 'de',
              province: 'ver',
              district: 'li',
              tel: '0952225555',
              email: 'deli.ver@gmail.com'
            },
            namedeliver: {
              _id: '589471a5d28dee702d25d9dd',
              salt: 'HpiXwc1ijFq7oCtWincSaw==',
              displayName: 'deliver_12345 ver',
              provider: 'local',
              username: 'deliver1',
              __v: 0,
              updated: '2017-02-20T11:29:27.303Z',
              loginExpires: '2017-02-22T07:13:34.257Z',
              loginToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlbGl2ZXIxIiwibG9naW5FeHBpcmVzIjoxNDg3NzQ3NjE0MjU3fQ._ltu3r9cSkxccKdKoA426na-0ogPw25nnz4_NiEV0-w',
              created: '2017-02-03T12:03:49.140Z',
              roles: [
                'deliver'
              ],
              profileImageURL: 'modules/users/client/img/profile/default.png',
              address: {
                postcode: '12150',
                district: 'li',
                subdistrict: 'de',
                province: 'ver',
                address: '77/8',
                tel: '0952225555'
              },
              password: 'kBPpBDE5oyGuAA8hhb2w/JesBWs0p/UbTqOHb+uyAwRwCtCCgCGwr7CxaxoDeOlWESiJFEPF4SXnv4P2/ZVI7A==',
              email: 'deli.ver@gmail.com',
              lastName: 'ver',
              firstName: 'deliver_12345'
            },
            user: {
              _id: '589471a5d28dee702d25d9dd',
              salt: 'HpiXwc1ijFq7oCtWincSaw==',
              displayName: 'deliver_12345 ver',
              provider: 'local',
              username: 'deliver1',
              __v: 0,
              updated: '2017-02-20T11:29:27.303Z',
              loginExpires: '2017-02-22T07:13:34.257Z',
              loginToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlbGl2ZXIxIiwibG9naW5FeHBpcmVzIjoxNDg3NzQ3NjE0MjU3fQ._ltu3r9cSkxccKdKoA426na-0ogPw25nnz4_NiEV0-w',
              created: '2017-02-03T12:03:49.140Z',
              roles: [
                'deliver'
              ],
              profileImageURL: 'modules/users/client/img/profile/default.png',
              address: {
                postcode: '12150',
                district: 'li',
                subdistrict: 'de',
                province: 'ver',
                address: '77/8',
                tel: '0952225555'
              },
              password: 'kBPpBDE5oyGuAA8hhb2w/JesBWs0p/UbTqOHb+uyAwRwCtCCgCGwr7CxaxoDeOlWESiJFEPF4SXnv4P2/ZVI7A==',
              email: 'deli.ver@gmail.com',
              lastName: 'ver',
              firstName: 'deliver_12345'
            },
            discountpromotion: 0,
            totalamount: 150,
            amount: 150,
            __v: 0,
            created: '2017-02-22T03:05:02.277Z',
            historystatus: [
              {
                status: 'complete',
                datestatus: '2017-02-22T03:04:57.167Z',
                _id: '58acffde1799e2e820610441'
              }
            ],
            deliverylog: [],
            deliverystatus: 'complete',
            delivery: {
              deliveryid: '0',
              deliverylog: []
            },
            accounting: 'cash',
            items: [
              {
                product: {
                  _id: '58aac3c0d28b856c1ba8de3b',
                  user: '58941192223c50c40e268405',
                  images: 'http://res.cloudinary.com/hflvlav04/image/upload/v1487586105/vtvhxcihgfmvqa28qnrn.jpg',
                  category: 'ข้าว',
                  description: 'ข้าวหอม',
                  price: 150,
                  grossweight: 10,
                  maxstock: 10,
                  minstock: 1,
                  deliveryratetype: 2,
                  valuetype1: 2,
                  __v: 0,
                  created: '2017-02-20T10:24:00.942Z',
                  rangtype2: [
                    {
                      min: null,
                      max: null,
                      value: null,
                      _id: '58aac3c0d28b856c1ba8de3c'
                    }
                  ],
                  name: 'ข้าว 15 ก.'
                },
                qty: 1,
                amount: 150,
                _id: '58acffde1799e2e820610442'
              }
            ],
            docno: '1487732697167',
        }],
        user: user
      };

      done();
    });
  });

  it('should be able to save a Accuralreceipt if logged in', function (done) {
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

        // Save a new Accuralreceipt
        agent.post('/api/accuralreceipts')
          .send(accuralreceipt)
          .expect(200)
          .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
            // Handle Accuralreceipt save error
            if (accuralreceiptSaveErr) {
              return done(accuralreceiptSaveErr);
            }

            // Get a list of Accuralreceipts
            agent.get('/api/accuralreceipts')
              .end(function (accuralreceiptsGetErr, accuralreceiptsGetRes) {
                // Handle Accuralreceipts save error
                if (accuralreceiptsGetErr) {
                  return done(accuralreceiptsGetErr);
                }

                // Get Accuralreceipts list
                var accuralreceipts = accuralreceiptsGetRes.body;

                // Set assertions
                (accuralreceipts[0].user._id).should.equal(userId);
                (accuralreceipts[0].docno).should.match('1234');
                (accuralreceipts[0].docdate).should.match(new Date());

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to save a Accuralreceipt if logged in with token', function (done) {
    accuralreceipt.loginToken = user.loginToken;
    // Save a new Accuralreceipt
    agent.post('/api/accuralreceipts')
      .send(accuralreceipt)
      .expect(200)
      .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
        // Handle Accuralreceipt save error
        if (accuralreceiptSaveErr) {
          return done(accuralreceiptSaveErr);
        }

        // Get a list of Accuralreceipts
        agent.get('/api/accuralreceipts')
          .end(function (accuralreceiptsGetErr, accuralreceiptsGetRes) {
            // Handle Accuralreceipts save error
            if (accuralreceiptsGetErr) {
              return done(accuralreceiptsGetErr);
            }

            // Get Accuralreceipts list
            var accuralreceipts = accuralreceiptsGetRes.body;

            // Set assertions
            // (accuralreceipts[0].user._id).should.equal(userId);
            (accuralreceipts[0].docno).should.match('1234');
            (accuralreceipts[0].docdate).should.match(new Date());

            // Call the assertion callback
            done();
          });
      });
  });

  it('should not be able to save an Accuralreceipt if not logged in', function (done) {
    agent.post('/api/accuralreceipts')
      .send(accuralreceipt)
      .expect(403)
      .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
        // Call the assertion callback
        done(accuralreceiptSaveErr);
      });
  });

  it('should not be able to save an Accuralreceipt if docno is duplicated', function (done) {

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

        // Save a new Accuralreceipt
        agent.post('/api/accuralreceipts')
          .send(accuralreceipt)
          .expect(200)
          .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
            // Handle accuralreceipt save error
            if (accuralreceiptSaveErr) {
              return done(accuralreceiptSaveErr);
            }
            // Save a new accuralreceipt
            agent.post('/api/accuralreceipts')
              .send(accuralreceipt)
              .expect(400)
              .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
                // Set message assertion
                (accuralreceiptSaveRes.body.message.toLowerCase()).should.containEql('docno already exists');

                // Handle accuralreceipt save error
                done(accuralreceiptSaveErr);
              });

          });

      });
  });

  it('should not be able to save an Accuralreceipt if no docno is provided', function (done) {
    // Invalidate docno field
    accuralreceipt.docno = '';

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

        // Save a new Accuralreceipt
        agent.post('/api/accuralreceipts')
          .send(accuralreceipt)
          .expect(400)
          .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
            // Set message assertion
            (accuralreceiptSaveRes.body.message).should.match('Please fill Accuralreceipt docno');

            // Handle Accuralreceipt save error
            done(accuralreceiptSaveErr);
          });
      });
  });

  it('should not be able to save an Accuralreceipt if no docdate is provided', function (done) {
    // Invalidate docdate field
    accuralreceipt.docdate = '';

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

        // Save a new Rccuralreceipt
        agent.post('/api/accuralreceipts')
          .send(accuralreceipt)
          .expect(400)
          .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
            // Set message assertion
            (accuralreceiptSaveRes.body.message).should.match('Please fill Accuralreceipt docdate');

            // Handle Accuralreceipt save error
            done(accuralreceiptSaveErr);
          });
      });
  });

  it('should be able to update an Accuralreceipt if signed in', function (done) {
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

        // Save a new Accuralreceipt
        agent.post('/api/accuralreceipts')
          .send(accuralreceipt)
          .expect(200)
          .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
            // Handle Accuralreceipt save error
            if (accuralreceiptSaveErr) {
              return done(accuralreceiptSaveErr);
            }

            // Update Accuralreceipt docno
            accuralreceipt.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Accuralreceipt
            agent.put('/api/accuralreceipts/' + accuralreceiptSaveRes.body._id)
              .send(accuralreceipt)
              .expect(200)
              .end(function (accuralreceiptUpdateErr, accuralreceiptUpdateRes) {
                // Handle Accuralreceipt update error
                if (accuralreceiptUpdateErr) {
                  return done(accuralreceiptUpdateErr);
                }

                // Set assertions
                (accuralreceiptUpdateRes.body._id).should.equal(accuralreceiptSaveRes.body._id);
                (accuralreceiptUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Accuralreceipts if not signed in', function (done) {
    // Create new Accuralreceipt model instance
    var accuralreceiptObj = new Accuralreceipt(accuralreceipt);

    // Save the accuralreceipt
    accuralreceiptObj.save(function () {
      // Request Accuralreceipts
      request(app).get('/api/accuralreceipts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Accuralreceipt if not signed in', function (done) {
    // Create new Accuralreceipt model instance
    var accuralreceiptObj = new Accuralreceipt(accuralreceipt);

    // Save the Accuralreceipt
    accuralreceiptObj.save(function () {
      request(app).get('/api/accuralreceipts/' + accuralreceiptObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', accuralreceipt.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Accuralreceipt with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/accuralreceipts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Accuralreceipt is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Accuralreceipt which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Accuralreceipt
    request(app).get('/api/accuralreceipts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Accuralreceipt with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Accuralreceipt if signed in', function (done) {
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

        // Save a new Accuralreceipt
        agent.post('/api/accuralreceipts')
          .send(accuralreceipt)
          .expect(200)
          .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
            // Handle Accuralreceipt save error
            if (accuralreceiptSaveErr) {
              return done(accuralreceiptSaveErr);
            }

            // Delete an existing Accuralreceipt
            agent.delete('/api/accuralreceipts/' + accuralreceiptSaveRes.body._id)
              .send(accuralreceipt)
              .expect(200)
              .end(function (accuralreceiptDeleteErr, accuralreceiptDeleteRes) {
                // Handle accuralreceipt error error
                if (accuralreceiptDeleteErr) {
                  return done(accuralreceiptDeleteErr);
                }

                // Set assertions
                (accuralreceiptDeleteRes.body._id).should.equal(accuralreceiptSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Accuralreceipt if not signed in', function (done) {
    // Set Accuralreceipt user
    accuralreceipt.user = user;

    // Create new Accuralreceipt model instance
    var accuralreceiptObj = new Accuralreceipt(accuralreceipt);

    // Save the Accuralreceipt
    accuralreceiptObj.save(function () {
      // Try deleting Accuralreceipt
      request(app).delete('/api/accuralreceipts/' + accuralreceiptObj._id)
        .expect(403)
        .end(function (accuralreceiptDeleteErr, accuralreceiptDeleteRes) {
          // Set message assertion
          (accuralreceiptDeleteRes.body.message).should.match('User is not authorized');

          // Handle Accuralreceipt error error
          done(accuralreceiptDeleteErr);
        });

    });
  });

  it('should be able to get a single Accuralreceipt that has an orphaned user reference', function (done) {
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

          // Save a new Accuralreceipt
          agent.post('/api/accuralreceipts')
            .send(accuralreceipt)
            .expect(200)
            .end(function (accuralreceiptSaveErr, accuralreceiptSaveRes) {
              // Handle Accuralreceipt save error
              if (accuralreceiptSaveErr) {
                return done(accuralreceiptSaveErr);
              }

              // Set assertions on new Accuralreceipt
              (accuralreceiptSaveRes.body.docno).should.equal(accuralreceipt.docno);
              should.exist(accuralreceiptSaveRes.body.user);
              should.equal(accuralreceiptSaveRes.body.user._id, orphanId);

              // force the Accuralreceipt to have an orphaned user reference
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

                    // Get the Accuralreceipt
                    agent.get('/api/accuralreceipts/' + accuralreceiptSaveRes.body._id)
                      .expect(200)
                      .end(function (accuralreceiptInfoErr, accuralreceiptInfoRes) {
                        // Handle Accuralreceipt error
                        if (accuralreceiptInfoErr) {
                          return done(accuralreceiptInfoErr);
                        }

                        // Set assertions
                        (accuralreceiptInfoRes.body._id).should.equal(accuralreceiptSaveRes.body._id);
                        (accuralreceiptInfoRes.body.docno).should.equal(accuralreceipt.docno);
                        should.equal(accuralreceiptInfoRes.body.user, undefined);

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
      Accuralreceipt.remove().exec(done);
    });
  });
});
