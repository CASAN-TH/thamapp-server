'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product');

/**
 * Globals
 */
var user,
  product,
  product2;

/**
 * Unit tests
 */
describe('Product Model Unit Tests:', function () {
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
      product = new Product({
        name: 'Product Name',
        description: 'Product Description',
        category: 'Product Category',
        price: 100,
        images:'img1',
        user: user
      });

      // for check duplicate name
      product2 = new Product({
        name: 'Product Name',
        description: 'Product Description',
        category: 'Product Category',
        price: 100,
         images:'img1',
        user: user
      });
      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return product.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save dupplicate name', function (done) {

      return product.save(function (err) {
        should.not.exist(err);
        product2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      product.name = '';

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });



    it('should be able to show an error when try to save without category', function (done) {
      product.name = 'Product Name';
      product.category = '';

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without price', function (done) {
      product.name = 'Product Name';
      product.category = 'Product Category';
      product.price = null;

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Product.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
