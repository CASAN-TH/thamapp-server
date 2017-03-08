'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Returnorder = mongoose.model('Returnorder');

/**
 * Globals
 */
var user,
  returnorder,
  returnorder2;

/**
 * Unit tests
 */
describe('Returnorder Model Unit Tests:', function () {
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
      returnorder = new Returnorder({
        docno: '20170210',
        docdate: new Date(),
        items: [{
          qty: 1,
          price: 100,
          amount: 100
        }],
        shipping: {
          postcode: 10220,
          subdistrict: 'คลองถนน',
          province: 'กรุงเทพฯ',
          district: 'สายไหม',
          tel: '0900077580',
          email: 'destinationpainbm@gmail.com'
        },
        accounting: 'bank',
        imgslip: 'picture',
        postcost: 10,
        discount: 10,
        comment: 'comment',
        trackingnumber: 'tracking Number',
        user: user
      });

      returnorder2 = new Returnorder({
        docno: '20170210',
        docdate: new Date(),
        items: [{
          qty: 1,
          price: 100,
          amount: 100
        }],
        shipping: [{
          postcode: 10220,
          subdistrict: 'คลองถนน',
          province: 'กรุงเทพฯ',
          district: 'สายไหม',
          tel: '0900077580',
          email: 'destinationpainbm@gmail.com'
        }],
        accounting: 'cash',
        postcost: 10,
        discount: 10,
        comment: 'comment',
        user: user
      });
      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return returnorder.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate docno', function (done) {

      return returnorder.save(function (err) {
        should.not.exist(err);
        returnorder2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });

    it('should be able to show an error when try to save without docno ', function (done) {
      returnorder.docno = '';

      return returnorder.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docdate ', function (done) {
      returnorder.docno = '20170210';
      returnorder.docdate = null;

      return returnorder.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without items ', function (done) {
      returnorder.docno = '20170210';
      returnorder.items = null;

      return returnorder.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without shipping ', function (done) {
      returnorder.items = [{
        product: 'pen',
        qty: 1,
        price: 100,
        amount: 100
      }];
      returnorder.shipping = null;
      return returnorder.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without accounting ', function (done) {
      returnorder.accounting = '';

      return returnorder.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Returnorder.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
