'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Payment = mongoose.model('Payment'),
  // Product = mongoose.model('Product'),
  Accountchart = mongoose.model('Accountchart');

/**
 * Globals
 */
var user,
  accountchart,
  payment;

/**
 * Unit tests
 */
describe('Payment Model Unit Tests:', function () {
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
      payment = new Payment({
        docno: 'Payment Docno',
        debits: accountchart,
        credits: accountchart,
        gltype: 'AR',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return payment.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docno', function (done) {
      payment.docno = '';

      return payment.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save valid enum value for gltype', function (done) {
      payment.gltype = 'AV';

      return payment.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Payment.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
