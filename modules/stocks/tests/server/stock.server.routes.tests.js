'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Stock = mongoose.model('Stock'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  stock;

/**
 * Stock routes tests
 */
describe('Stock CRUD tests', function () {

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

    // Save a user to the test db and create new Stock
    user.save(function () {
      stock = {
        name: 'Stock name'
      };

      done();
    });
  });

  
  // it('should be able to get a list of Stocks if not signed in', function (done) {
  //   // Create new Stock model instance
  //   var stockObj = new Stock(stock);

  //   // Save the stock
  //   stockObj.save(function () {
  //     // Request Stocks
  //     request(app).get('/api/stocks')
  //       .end(function (req, res) {
  //         // Set assertion
  //         res.body.should.be.instanceof(Array).and.have.lengthOf(1);

  //         // Call the assertion callback
  //         done();
  //       });

  //   });
  // });

  

  afterEach(function (done) {
    User.remove().exec(function () {
      Stock.remove().exec(done);
    });
  });
});
