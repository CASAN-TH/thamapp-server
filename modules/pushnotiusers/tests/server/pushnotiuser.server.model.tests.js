'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pushnotiuser = mongoose.model('Pushnotiuser');

/**
 * Globals
 */
var user,
  pushnotiuser;

/**
 * Unit tests
 */
describe('Pushnotiuser Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      pushnotiuser = new Pushnotiuser({
        user_id: 'Pushnotiuser user id',
        user_name: 'Pushnotiuser user name',
        role: 'Pushnotiuser role',
        device_token: 'Pushnotiuser device token',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return pushnotiuser.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without user id ', function (done) {
      pushnotiuser.user_id = '';

      return pushnotiuser.save(function (err) {
        should.exist(err);
        done();
      });
    });

     it('should be able to show an error when try to save without role ', function (done) {
      pushnotiuser.role = '';

      return pushnotiuser.save(function (err) {
        should.exist(err);
        done();
      });
    });

     it('should be able to show an error when try to save without device token ', function (done) {
      pushnotiuser.device_token = '';

      return pushnotiuser.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function(done) {
    Pushnotiuser.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
