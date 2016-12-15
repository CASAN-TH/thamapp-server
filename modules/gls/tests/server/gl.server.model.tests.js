'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Gl = mongoose.model('Gl');

/**
 * Globals
 */
var user,
  gl;

/**
 * Unit tests
 */
describe('Gl Model Unit Tests:', function() {
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
      gl = new Gl({
        batchno: '201612',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return gl.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without batchno', function(done) {
      gl.batchno = '';

      return gl.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Gl.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
