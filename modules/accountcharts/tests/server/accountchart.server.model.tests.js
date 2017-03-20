'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Accountchart = mongoose.model('Accountchart');

/**
 * Globals
 */
var user,
  accountchart,
  accountchart2;

/**
 * Unit tests
 */
describe('Accountchart Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      accountchart = new Accountchart({
        accountno: '1234567',
        accountname: 'Account Name',
        user: user
      });

      accountchart2 = new Accountchart({
        accountno: '1234567',
        accountname: 'Account Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return accountchart.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate accountno', function (done) {

      return accountchart.save(function (err) {
        should.not.exist(err);
        accountchart2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });

    it('should be able to show an error when try to save without accountno ', function (done) {
      accountchart.accountno = '';

      return accountchart.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without accountname ', function (done) {
      accountchart.accountname = '';

      return accountchart.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Accountchart.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
