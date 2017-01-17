'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Managebank = mongoose.model('Managebank');

/**
 * Globals
 */
var user,
  managebank,
  managebank2;

/**
 * Unit tests
 */
describe('Managebank Model Unit Tests:', function () {
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
      managebank = new Managebank({
        bankname: 'String',
        accountname: 'String',
        accountnumber: 'String',
        branch: 'String',
        user: user

      });
      managebank2 = new Managebank({
        bankname: 'String',
        accountname: 'String',
        accountnumber: 'String',
        branch: 'String',
        user: user

      });

      done();
    });
  });


  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return managebank.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate accountnumber', function (done) {
      return managebank.save(function (err) {
        should.not.exist(err);
        managebank2.save(function (err) {
          should.exist(err);
          done();
        });
      });
    });

    it('should be able to show an error when try to save without bankname', function (done) {
      managebank.bankname = '';

      return managebank.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without accountname', function (done) {
      managebank.accountname = '';

      return managebank.save(function (err) {
        should.exist(err);
        done();
      });
    });


    it('should be able to show an error when try to save without accountnumber', function (done) {
      managebank.accountnumber = '';

      return managebank.save(function (err) {
        should.exist(err);
        done();
      });
    });


    it('should be able to show an error when try to save without branch', function (done) {
      managebank.branch = '';

      return managebank.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

    afterEach(function (done) {
      Managebank.remove().exec(function () {
        User.remove().exec(function () {
          done();
        });
      });
    });
  });
