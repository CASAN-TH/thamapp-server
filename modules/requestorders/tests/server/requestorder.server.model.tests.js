'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Requestorder = mongoose.model('Requestorder');

/**
 * Globals
 */
var user,
  requestorder,
  requestorder2;

/**
 * Unit tests
 */
describe('Requestorder Model Unit Tests:', function () {
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
      requestorder = new Requestorder({
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

      requestorder2 = new Requestorder({
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
      return requestorder.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate docno', function (done) {

      return requestorder.save(function (err) {
        should.not.exist(err);
        requestorder2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });

    it('should be able to show an error when try to save without docno ', function (done) {
      requestorder.docno = '';

      return requestorder.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docdate ', function (done) {
      requestorder.docno = '20170210';
      requestorder.docdate = null;

      return requestorder.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without items ', function (done) {
      requestorder.docno = '20170210';
      requestorder.items = null;

      return requestorder.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without shipping ', function (done) {
      requestorder.items = [{
        product: 'pen',
        qty: 1,
        price: 100,
        amount: 100
      }];
      requestorder.shipping = null;
      return requestorder.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without accounting ', function (done) {
      requestorder.accounting = '';

      return requestorder.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function (done) {
    Requestorder.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
