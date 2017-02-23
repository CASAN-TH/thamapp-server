'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Accuralreceipt = mongoose.model('Accuralreceipt');

/**
 * Globals
 */
var user,
  accuralreceipt,
  accuralreceipt2;

/**
 * Unit tests
 */
describe('Accuralreceipt Model Unit Tests:', function () {
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
      accuralreceipt = new Accuralreceipt({
        docno: '1234',
        docdate: new Date(),
        items: [{
            _id: '58acffde1799e2e820610440',
            docdate: '2017-02-22T03:04:57.167Z',
            shipping: {
              firstname: 'deliver_12345',
              lastname: 'ver',
              address: '77/8',
              postcode: '12150',
              subdistrict: 'de',
              province: 'ver',
              district: 'li',
              tel: '0952225555',
              email: 'deli.ver@gmail.com'
            },
            namedeliver: {
              _id: '589471a5d28dee702d25d9dd',
              salt: 'HpiXwc1ijFq7oCtWincSaw==',
              displayName: 'deliver_12345 ver',
              provider: 'local',
              username: 'deliver1',
              __v: 0,
              updated: '2017-02-20T11:29:27.303Z',
              loginExpires: '2017-02-22T07:13:34.257Z',
              loginToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlbGl2ZXIxIiwibG9naW5FeHBpcmVzIjoxNDg3NzQ3NjE0MjU3fQ._ltu3r9cSkxccKdKoA426na-0ogPw25nnz4_NiEV0-w',
              created: '2017-02-03T12:03:49.140Z',
              roles: [
                'deliver'
              ],
              profileImageURL: 'modules/users/client/img/profile/default.png',
              address: {
                postcode: '12150',
                district: 'li',
                subdistrict: 'de',
                province: 'ver',
                address: '77/8',
                tel: '0952225555'
              },
              password: 'kBPpBDE5oyGuAA8hhb2w/JesBWs0p/UbTqOHb+uyAwRwCtCCgCGwr7CxaxoDeOlWESiJFEPF4SXnv4P2/ZVI7A==',
              email: 'deli.ver@gmail.com',
              lastName: 'ver',
              firstName: 'deliver_12345'
            },
            user: {
              _id: '589471a5d28dee702d25d9dd',
              salt: 'HpiXwc1ijFq7oCtWincSaw==',
              displayName: 'deliver_12345 ver',
              provider: 'local',
              username: 'deliver1',
              __v: 0,
              updated: '2017-02-20T11:29:27.303Z',
              loginExpires: '2017-02-22T07:13:34.257Z',
              loginToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlbGl2ZXIxIiwibG9naW5FeHBpcmVzIjoxNDg3NzQ3NjE0MjU3fQ._ltu3r9cSkxccKdKoA426na-0ogPw25nnz4_NiEV0-w',
              created: '2017-02-03T12:03:49.140Z',
              roles: [
                'deliver'
              ],
              profileImageURL: 'modules/users/client/img/profile/default.png',
              address: {
                postcode: '12150',
                district: 'li',
                subdistrict: 'de',
                province: 'ver',
                address: '77/8',
                tel: '0952225555'
              },
              password: 'kBPpBDE5oyGuAA8hhb2w/JesBWs0p/UbTqOHb+uyAwRwCtCCgCGwr7CxaxoDeOlWESiJFEPF4SXnv4P2/ZVI7A==',
              email: 'deli.ver@gmail.com',
              lastName: 'ver',
              firstName: 'deliver_12345'
            },
            discountpromotion: 0,
            totalamount: 150,
            amount: 150,
            __v: 0,
            created: '2017-02-22T03:05:02.277Z',
            historystatus: [
              {
                status: 'complete',
                datestatus: '2017-02-22T03:04:57.167Z',
                _id: '58acffde1799e2e820610441'
              }
            ],
            deliverylog: [],
            deliverystatus: 'complete',
            delivery: {
              deliveryid: '0',
              deliverylog: []
            },
            accounting: 'cash',
            items: [
              {
                product: {
                  _id: '58aac3c0d28b856c1ba8de3b',
                  user: '58941192223c50c40e268405',
                  images: 'http://res.cloudinary.com/hflvlav04/image/upload/v1487586105/vtvhxcihgfmvqa28qnrn.jpg',
                  category: 'ข้าว',
                  description: 'ข้าวหอม',
                  price: 150,
                  grossweight: 10,
                  maxstock: 10,
                  minstock: 1,
                  deliveryratetype: 2,
                  valuetype1: 2,
                  __v: 0,
                  created: '2017-02-20T10:24:00.942Z',
                  rangtype2: [
                    {
                      min: null,
                      max: null,
                      value: null,
                      _id: '58aac3c0d28b856c1ba8de3c'
                    }
                  ],
                  name: 'ข้าว 15 ก.'
                },
                qty: 1,
                amount: 150,
                _id: '58acffde1799e2e820610442'
              }
            ],
            docno: '1487732697167',
          
        }],
        user: user
      });

      //for check dupplicate docno
      accuralreceipt2 = new Accuralreceipt({
        docno: '1234',
        docdate: new Date(),
        items: [{
            _id: '58acffde1799e2e820610440',
            docdate: '2017-02-22T03:04:57.167Z',
            shipping: {
              firstname: 'deliver_12345',
              lastname: 'ver',
              address: '77/8',
              postcode: '12150',
              subdistrict: 'de',
              province: 'ver',
              district: 'li',
              tel: '0952225555',
              email: 'deli.ver@gmail.com'
            },
            namedeliver: {
              _id: '589471a5d28dee702d25d9dd',
              salt: 'HpiXwc1ijFq7oCtWincSaw==',
              displayName: 'deliver_12345 ver',
              provider: 'local',
              username: 'deliver1',
              __v: 0,
              updated: '2017-02-20T11:29:27.303Z',
              loginExpires: '2017-02-22T07:13:34.257Z',
              loginToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlbGl2ZXIxIiwibG9naW5FeHBpcmVzIjoxNDg3NzQ3NjE0MjU3fQ._ltu3r9cSkxccKdKoA426na-0ogPw25nnz4_NiEV0-w',
              created: '2017-02-03T12:03:49.140Z',
              roles: [
                'deliver'
              ],
              profileImageURL: 'modules/users/client/img/profile/default.png',
              address: {
                postcode: '12150',
                district: 'li',
                subdistrict: 'de',
                province: 'ver',
                address: '77/8',
                tel: '0952225555'
              },
              password: 'kBPpBDE5oyGuAA8hhb2w/JesBWs0p/UbTqOHb+uyAwRwCtCCgCGwr7CxaxoDeOlWESiJFEPF4SXnv4P2/ZVI7A==',
              email: 'deli.ver@gmail.com',
              lastName: 'ver',
              firstName: 'deliver_12345'
            },
            user: {
              _id: '589471a5d28dee702d25d9dd',
              salt: 'HpiXwc1ijFq7oCtWincSaw==',
              displayName: 'deliver_12345 ver',
              provider: 'local',
              username: 'deliver1',
              __v: 0,
              updated: '2017-02-20T11:29:27.303Z',
              loginExpires: '2017-02-22T07:13:34.257Z',
              loginToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlbGl2ZXIxIiwibG9naW5FeHBpcmVzIjoxNDg3NzQ3NjE0MjU3fQ._ltu3r9cSkxccKdKoA426na-0ogPw25nnz4_NiEV0-w',
              created: '2017-02-03T12:03:49.140Z',
              roles: [
                'deliver'
              ],
              profileImageURL: 'modules/users/client/img/profile/default.png',
              address: {
                postcode: '12150',
                district: 'li',
                subdistrict: 'de',
                province: 'ver',
                address: '77/8',
                tel: '0952225555'
              },
              password: 'kBPpBDE5oyGuAA8hhb2w/JesBWs0p/UbTqOHb+uyAwRwCtCCgCGwr7CxaxoDeOlWESiJFEPF4SXnv4P2/ZVI7A==',
              email: 'deli.ver@gmail.com',
              lastName: 'ver',
              firstName: 'deliver_12345'
            },
            discountpromotion: 0,
            totalamount: 150,
            amount: 150,
            __v: 0,
            created: '2017-02-22T03:05:02.277Z',
            historystatus: [
              {
                status: 'complete',
                datestatus: '2017-02-22T03:04:57.167Z',
                _id: '58acffde1799e2e820610441'
              }
            ],
            deliverylog: [],
            deliverystatus: 'complete',
            delivery: {
              deliveryid: '0',
              deliverylog: []
            },
            accounting: 'cash',
            items: [
              {
                product: {
                  _id: '58aac3c0d28b856c1ba8de3b',
                  user: '58941192223c50c40e268405',
                  images: 'http://res.cloudinary.com/hflvlav04/image/upload/v1487586105/vtvhxcihgfmvqa28qnrn.jpg',
                  category: 'ข้าว',
                  description: 'ข้าวหอม',
                  price: 150,
                  grossweight: 10,
                  maxstock: 10,
                  minstock: 1,
                  deliveryratetype: 2,
                  valuetype1: 2,
                  __v: 0,
                  created: '2017-02-20T10:24:00.942Z',
                  rangtype2: [
                    {
                      min: null,
                      max: null,
                      value: null,
                      _id: '58aac3c0d28b856c1ba8de3c'
                    }
                  ],
                  name: 'ข้าว 15 ก.'
                },
                qty: 1,
                amount: 150,
                _id: '58acffde1799e2e820610442'
              }
            ],
            docno: '1487732697167',
          
        }],
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return accuralreceipt.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save duplicate docno', function (done) {

      return accuralreceipt.save(function (err) {
        should.not.exist(err);
        accuralreceipt2.save(function (err) {
          should.exist(err);
          done();
        });

      });
    });

    it('should be able to show an error when try to save without docno ', function (done) {
      accuralreceipt.docno = '';

      return accuralreceipt.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docdate ', function (done) {
      accuralreceipt.docno = '1234';
      accuralreceipt.docdate = null;

      return accuralreceipt.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without items ', function (done) {
      accuralreceipt.docno = '1234';
      accuralreceipt.items = null;

      return accuralreceipt.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Accuralreceipt.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
