'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Order = mongoose.model('Order');

/**
 * Globals
 */
var user,
  order,
  order2;

/**
 * Unit tests
 */
describe('Order Model Unit Tests:', function () {
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
      order = new Order({
        docno: '1234',
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
        user: user
      });

      //for check dupplicate docno
      order2 = new Order({
        docno: '1234',
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
      return order.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate docno', function (done) {

      return order.save(function (err) {
        should.not.exist(err);
        order2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });
    it('should be able to show an error when try to save without docno ', function (done) {
      order.docno = '';

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without docdate ', function (done) {
      order.docno = '1234';
      order.docdate = null;

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without items ', function (done) {
      order.docno = '1234';
      order.items = null;

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without shipping ', function (done) {
      order.items = [{
        product: 'pen',
        qty: 1,
        price: 100,
        amount: 100
      }];
      order.shipping = null;
      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without accounting ', function (done) {
      order.accounting = '';

      return order.save(function (err) {
        should.exist(err);
        done();
      });
    });




  });

  afterEach(function (done) {
    Order.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
