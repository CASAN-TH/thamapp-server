'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Promotion = mongoose.model('Promotion');

/**
 * Globals
 */
var user,
  promotion,
  promotion2;

/**
 * Unit tests
 */
describe('Promotion Model Unit Tests:', function () {
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
      promotion = new Promotion({
        productid: '11111',
        description: '11111',
        discount: {
          fixBath: 50,
          percen: 10,
        },
        freeitem: {
          product: '',
          qty: 1,
          price: 1,
          amount: 1
        },
        expdate: '',
        status: '11111',
        user: user
      });

      promotion2 = new Promotion({
        productid: '11111',
        description: '11111',
        discount: {
          fixBath: 50,
          percen: 10,
        },
        freeitem: {
          product: '',
          qty: 1,
          price: 1,
          amount: 1
        },
        expdate: '',
        status: '11111',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return promotion.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without productid', function (done) {
      promotion.productid = '';

      return promotion.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save dupplicate description', function (done) {

      return promotion.save(function (err) {
        should.not.exist(err);
        promotion2.save(function (err) {
          should.exist(err);
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    Promotion.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
