'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Postcode = mongoose.model('Postcode');

/**
 * Globals
 */
var user,
  postcode,
  postcode2;

/**
 * Unit tests
 */
describe('Postcode Model Unit Tests:', function () {
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
      postcode = new Postcode({
        locationcode: '104203',
        province: 'กทม',
        district: 'สายไหม',
        subdistrict: 'คลองถนน',
        postcode: '10220',
        user: user
      });

      postcode2 = new Postcode({
        locationcode: '104203',
        province: 'กทม',
        district: 'สายไหม',
        subdistrict: 'คลองถนน',
        postcode: '10220',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return postcode.save(function (err) {
        should.not.exist(err);
        done();
      });
    });


    //locationcode
    it('should be able to show an error when try to save duplicate locationcode', function (done) {

      return postcode.save(function (err) {
        should.not.exist(err);
        postcode2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });
    it('should be able to show an error when try to save without location', function (done) {
      postcode.locationcode = '';

      return postcode.save(function (err) {
        should.exist(err);
        done();
      });
    });
    //district
    it('should be able to show an error when try to save without district', function (done) {
      postcode.district = '';

      return postcode.save(function (err) {
        should.exist(err);
        done();
      });
    });
    //province
    it('should be able to show an error when try to save without province', function (done) {
      postcode.province = '';

      return postcode.save(function (err) {
        should.exist(err);
        done();
      });
    });
    //postcode
    it('should be able to show an error when try to save without postcode', function (done) {
      postcode.postcode = '';

      return postcode.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });
  afterEach(function (done) {
    Postcode.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
