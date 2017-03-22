'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Receipt = mongoose.model('Receipt'),
  // Product = mongoose.model('Product'),
  Accountchart = mongoose.model('Accountchart');

/**
 * Globals
 */
var user,
  accountchart,
  receipt;

/**
 * Unit tests
 */
describe('Receipt Model Unit Tests:', function () {
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
      receipt = new Receipt({
        docno: 'Receipt Docno',
        client: accountchart,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return receipt.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docno', function (done) {
      receipt.docno = '';

      return receipt.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without client', function (done) {
      receipt.client = '';

      return receipt.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Receipt.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
