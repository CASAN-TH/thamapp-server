'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Marketplan = mongoose.model('Marketplan');

/**
 * Globals
 */
var user,
  marketplan;

/**
 * Unit tests
 */
describe('Marketplan Model Unit Tests:', function() {
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
      marketplan = new Marketplan({
        name: 'Marketplan Name',
        year: 2560,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return marketplan.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      marketplan.name = '';

      return marketplan.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without year', function(done) {
      marketplan.year = null;

      return marketplan.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Marketplan.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
