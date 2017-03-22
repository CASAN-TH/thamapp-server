'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Purchase = mongoose.model('Purchase'),
  // Product = mongoose.model('Product'),
  Accountchart = mongoose.model('Accountchart');

/**
 * Globals
 */
var user,
  accountchart,
  purchase;

/**
 * Unit tests
 */
describe('Purchase Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    accountchart = new Accountchart({
        accountno: '1234567',
        accountname: 'Account Name',
        user: user
    });

    user.save(function () {
      purchase = new Purchase({
        docno: 'Purchase Docno',
        client: accountchart,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return purchase.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docno', function (done) {
      purchase.docno = '';

      return purchase.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without client', function (done) {
      purchase.client = '';

      return purchase.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Purchase.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
