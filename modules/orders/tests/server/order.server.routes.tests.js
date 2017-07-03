'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Order = mongoose.model('Order'),
  Product = mongoose.model('Product'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  delivercredentials,
  user,
  order,
  order2,
  order3,
  product,
  product2,
  deliver;

var tomorrow = new Date();


/**
 * Order routes tests
 */
describe('Order CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };
    delivercredentials = {
      username: 'deliver',
      password: 'M3@n.jsI$Aw3$0m3deliver'
    };
    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local',
      loginToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwibG9naW5FeHBpcmVzIjoxNDg3NTk1NTcyMzcyfQ.vfDKENoQTmzQhoaBV35RJa02f_5GVvviJdhuPhfM1oU',
      loginExpires: tomorrow.setDate(tomorrow.getDate() + 1),
      address: {
        tel: '0900077580'
      }
    });

    deliver = new User({
      firstName: 'deliver',
      lastName: 'deliver',
      displayName: 'deliver deliver',
      email: 'deliver@deliver.com',
      username: delivercredentials.username,
      password: delivercredentials.password,
      provider: 'local',
      roles: ['deliver'],
      loginToken: 'eyJ0sseXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwibG9naW5FeHBpcmVzIjoxNDg3NTk1NTcyMzcyfQ.vfDKENoQTmzQhoaBV35RJa02f_5GVvviJdhuPhfM1oU',
      loginExpires: tomorrow.setDate(tomorrow.getDate() + 1),
      address: {
        postcode: '12150',
        tel: '0900077580'
      }
    });

    product = new Product({
      _id: '5885e9bcea48c81000919ff8',
      user: '58631cf0043a1110007dcfd0',
      images: 'http://res.cloudinary.com/hrpqiager/image/upload/v1485171075/d7mt2yhjrwttxdllvnzr.jpg',
      category: 'ข้าวสาร',
      description: 'ข้าวธรรมชาติ ไร้สารเคมี ตั้งแต่กระบวนการเพาะปลูก ที่หมักดองดินด้วยสมุนไพรรสจืดก่อนจะปลูกข้าวพันธุ์สันป่าตอง ใส่ปุ๋ยธรรมชาติสูตรบำรุงดิน แห้งชามน้ำชาม (ปุ๋ยแห้งปุ๋ยน้ำจากการหมักสมุนไพรรสจืด) เพื่อล้างพิษสารเคมีที่สะสมอยู่ในดินในน้ำ และใส่ปุ๋ยธรรมชาติสูตรเร่งดอกผล (ปุ๋ยแห้งปุ๋ยน้ำจากการหมักสมุนไพรรสจืดผสมกับผลไม้สุกสีเหลือง) เพื่อบำรุงต้นข้าวให้ออกดอกข้าวเป็นเมล็ดข้าว',
      price: 50,
      __v: 1,
      deliveryratetype: 2,
      grossweight: 1,
      maxstock: 20,
      minstock: 5,
      valuetype1: 0,
      created: '2017-01-23T11:32:12.051Z',
      rangtype2: [
        {
          min: 1,
          max: 5,
          value: 50,
          _id: '58897fc811ac041000adaaa2'
        },
        {
          min: 6,
          max: 10,
          value: 100,
          _id: '58897fc811ac041000adaaa1'
        },
        {
          min: 11,
          max: 999999999,
          value: 150,
          _id: '58897fc811ac041000adaaa0'
        }
      ],
      retailerprice: 40,
      name: 'ข้าวกล้องมหัศจรรย์ ขันทอง ขนาด 1 กิโลกรัม'
    });

    product2 = new Product({
      _id: '586e06f5be44cc100062981b',
      user: '58631cf0043a1110007dcfd0',
      images: 'http://res.cloudinary.com/hrpqiager/image/upload/v1483959393/hvoopiqtn4shyk4itp6g.jpg',
      category: 'ข้าวสาร',
      description: 'ข้าวธรรมชาติ ไร้สารเคมี ตั้งแต่กระบวนการเพาะปลูก ที่หมักดองดินด้วยสมุนไพรรสจืดก่อนจะปลูกข้าวพันธุ์สันป่าตอง ใส่ปุ๋ยธรรมชาติสูตรบำรุงดิน แห้งชามน้ำชาม (ปุ๋ยแห้งปุ๋ยน้ำจากการหมักสมุนไพรรสจืด) เพื่อล้างพิษสารเคมีที่สะสมอยู่ในดินในน้ำ และใส่ปุ๋ยธรรมชาติสูตรเร่งดอกผล (ปุ๋ยแห้งปุ๋ยน้ำจากการหมักสมุนไพรรสจืดผสมกับผลไม้สุกสีเหลือง) เพื่อบำรุงต้นข้าวให้ออกดอกข้าวเป็นเมล็ดข้าวที่สมบูรณ์',
      price: 200,
      __v: 1,
      deliveryratetype: 1,
      grossweight: 5,
      maxstock: 20,
      minstock: 5,
      valuetype1: 50,
      created: '2017-01-05T08:42:29.760Z',
      rangtype2: [
        {
          min: null,
          max: null,
          value: null,
          _id: '5889f81759953210003f195f'
        }
      ],
      retailerprice: 180,
      name: 'ข้าวกล้องมหัศจรรย์ ขันทอง ขนาด 5 กิโลกรัม'
    });
    // Save a user to the test db and create new Order
    deliver.save(function () {
      user.save(function () {
        product.save(function () {
          product2.save(function () {
            order = {
              docno: '1234',
              docdate: new Date(),
              items: [{
                product: product2,
                qty: 1,
                retailerprice: 180,
                price: 100,
                amount: 200
              }],
              shipping: {
                firstname: 'asdf',
                lastname: 'String',
                address: 'adsf',
                postcode: 10220,
                subdistrict: 'คลองถนน',
                province: 'กรุงเทพฯ',
                district: 'สายไหม',
                tel: '0900077581',
                email: 'destinationpainbm@gmail.com'
              },
              accounting: 'bank',
              imgslip: 'picture',
              postcost: 10,
              amount: 200,
              discount: 10,
              src: '123123',
              comment: 'comment',
              trackingnumber: 'tracking Number',
              deliverystatus: 'confirmed',
              created: '2017-03-17T04:49:37.653Z'
            };

            order2 = {
              docno: '1235',
              docdate: new Date(),
              items: [{
                product: product,
                qty: 1,
                retailerprice: 40,
                price: 100,
                amount: 100
              }, {
                  product: product,
                  qty: 1,
                  retailerprice: 40,
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
              src: '123123',
              accounting: 'bank',
              imgslip: 'picture',
              postcost: 10,
              amount: 100,
              discount: 10,
              comment: 'comment',
              trackingnumber: 'tracking Number',
              deliverystatus: 'confirmed',
              created: '2016-12-21T10:51:33.512Z'
            };

            order3 = {
              docno: '1236',
              docdate: new Date(),
              items: [{
                product: product2,
                qty: 1,
                retailerprice: 0,
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
              src: 'ios',
              amount: 100,
              discount: 10,
              comment: 'comment',
              trackingnumber: 'tracking Number',
              deliverystatus: 'confirmed',
              created: '2017-03-17T04:49:37.653Z'
            };

            done();
          });
        });
      });
    });

  });

  it('should be able to save a Order if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Order
        agent.post('/api/orders')
          .send(order)
          .expect(200)
          .end(function (orderSaveErr, orderSaveRes) {
            // Handle Order save error
            if (orderSaveErr) {
              return done(orderSaveErr);
            }

            // Get a list of Orders
            agent.get('/api/orders')
              .end(function (ordersGetErr, ordersGetRes) {
                // Handle Orders save error
                if (ordersGetErr) {
                  return done(ordersGetErr);
                }

                // Get Orders list
                var orders = ordersGetRes.body;

                // Set assertions
                (orders[0].user._id).should.equal(userId);
                (orders[0].docno).should.match('1234');
                (orders[0].docdate).should.match(new Date());
                (orders[0].accounting).should.match('bank');
                (orders[0].deliverystatus).should.match('confirmed');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to save a Order if logged in with token', function (done) {
    order.loginToken = user.loginToken;
    // Save a new Order
    agent.post('/api/orders')
      .send(order)
      .expect(200)
      .end(function (orderSaveErr, orderSaveRes) {
        // Handle Order save error
        if (orderSaveErr) {
          return done(orderSaveErr);
        }

        // Get a list of Orders
        agent.get('/api/orders')
          .end(function (ordersGetErr, ordersGetRes) {
            // Handle Orders save error
            if (ordersGetErr) {
              return done(ordersGetErr);
            }

            // Get Orders list
            var orders = ordersGetRes.body;

            // Set assertions
            // (orders[0].user._id).should.equal(userId);
            (orders[0].docno).should.match('1234');
            (orders[0].docdate).should.match(new Date());
            (orders[0].accounting).should.match('bank');
            (orders[0].deliverystatus).should.match('confirmed');


            // Call the assertion callback
            done();
          });
      });
  });

  it('should not be able to save an Order if not logged in', function (done) {
    agent.post('/api/orders')
      .send(order)
      .expect(403)
      .end(function (orderSaveErr, orderSaveRes) {
        // Call the assertion callback
        done(orderSaveErr);
      });
  });

  // it('should not be able to save an Order if docno is duplicated', function (done) {

  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }

  //       // Get the userId
  //       var userId = user.id;

  //       // Save a new order
  //       agent.post('/api/orders')
  //         .send(order)
  //         .expect(200)
  //         .end(function (orderSaveErr, orderSaveRes) {
  //           // Handle order save error
  //           if (orderSaveErr) {
  //             return done(orderSaveErr);
  //           }
  //           // Save a new order
  //           agent.post('/api/orders')
  //             .send(order)
  //             .expect(400)
  //             .end(function (orderSaveErr, orderSaveRes) {
  //               // Set message assertion
  //               //(orderSaveRes.body.message).should.match('11000 duplicate key error collection: mean-test.orders index: docno already exists');
  //               (orderSaveRes.body.message.toLowerCase()).should.containEql('docno already exists');

  //               // Handle order save error
  //               done(orderSaveErr);
  //             });

  //         });

  //     });
  // });

  it('should not be able to save an Order if no docno is provided', function (done) {
    // Invalidate docno field
    order.docno = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Order
        agent.post('/api/orders')
          .send(order)
          .expect(400)
          .end(function (orderSaveErr, orderSaveRes) {
            // Set message assertion
            (orderSaveRes.body.message).should.match('Please fill Order docno');

            // Handle Order save error
            done(orderSaveErr);
          });
      });
  });

  it('should not be able to save an Order if no accounting is provided', function (done) {
    // Invalidate docno field
    order.accounting = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Order
        agent.post('/api/orders')
          .send(order)
          .expect(400)
          .end(function (orderSaveErr, orderSaveRes) {
            // Set message assertion
            (orderSaveRes.body.message).should.match('Please fill Order accounting');

            // Handle Order save error
            done(orderSaveErr);
          });
      });
  });

  it('should not be able to save an Order if no docdate is provided', function (done) {
    // Invalidate docdate field
    order.docdate = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Order
        agent.post('/api/orders')
          .send(order)
          .expect(400)
          .end(function (orderSaveErr, orderSaveRes) {
            // Set message assertion
            (orderSaveRes.body.message).should.match('Please fill Order docdate');

            // Handle Order save error
            done(orderSaveErr);
          });
      });
  });


  it('should be able to update an Order if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Order
        agent.post('/api/orders')
          .send(order)
          .expect(200)
          .end(function (orderSaveErr, orderSaveRes) {
            // Handle Order save error
            if (orderSaveErr) {
              return done(orderSaveErr);
            }

            // Update Order docno
            order.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Order
            agent.put('/api/orders/' + orderSaveRes.body._id)
              .send(order)
              .expect(200)
              .end(function (orderUpdateErr, orderUpdateRes) {
                // Handle Order update error
                if (orderUpdateErr) {
                  return done(orderUpdateErr);
                }

                // Set assertions
                (orderUpdateRes.body._id).should.equal(orderSaveRes.body._id);
                (orderUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Orders if not signed in', function (done) {
    // Create new Order model instance
    var orderObj = new Order(order);

    // Save the order
    orderObj.save(function () {
      // Request Orders
      request(app).get('/api/orders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Order if not signed in', function (done) {
    // Create new Order model instance
    var orderObj = new Order(order);

    // Save the Order
    orderObj.save(function () {
      request(app).get('/api/orders/' + orderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', order.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Order with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/orders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Order is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Order which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Order
    request(app).get('/api/orders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Order with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Order if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Order
        agent.post('/api/orders')
          .send(order)
          .expect(200)
          .end(function (orderSaveErr, orderSaveRes) {
            // Handle Order save error
            if (orderSaveErr) {
              return done(orderSaveErr);
            }

            // Delete an existing Order
            agent.delete('/api/orders/' + orderSaveRes.body._id)
              .send(order)
              .expect(200)
              .end(function (orderDeleteErr, orderDeleteRes) {
                // Handle order error error
                if (orderDeleteErr) {
                  return done(orderDeleteErr);
                }

                // Set assertions
                (orderDeleteRes.body._id).should.equal(orderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Order if not signed in', function (done) {
    // Set Order user
    order.user = user;

    // Create new Order model instance
    var orderObj = new Order(order);

    // Save the Order
    orderObj.save(function () {
      // Try deleting Order
      request(app).delete('/api/orders/' + orderObj._id)
        .expect(403)
        .end(function (orderDeleteErr, orderDeleteRes) {
          // Set message assertion
          (orderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Order error error
          done(orderDeleteErr);
        });

    });
  });

  it('should be able to get a single Order that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Order
          agent.post('/api/orders')
            .send(order)
            .expect(200)
            .end(function (orderSaveErr, orderSaveRes) {
              // Handle Order save error
              if (orderSaveErr) {
                return done(orderSaveErr);
              }

              // Set assertions on new Order
              (orderSaveRes.body.docno).should.equal(order.docno);
              should.exist(orderSaveRes.body.user);
              should.equal(orderSaveRes.body.user._id, orphanId);

              // force the Order to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Order
                    agent.get('/api/orders/' + orderSaveRes.body._id)
                      .expect(200)
                      .end(function (orderInfoErr, orderInfoRes) {
                        // Handle Order error
                        if (orderInfoErr) {
                          return done(orderInfoErr);
                        }

                        // Set assertions
                        (orderInfoRes.body._id).should.equal(orderSaveRes.body._id);
                        (orderInfoRes.body.docno).should.equal(order.docno);
                        should.equal(orderInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('sale report', function (done) {
    var orderObj = new Order(order);
    var orderObj2 = new Order(order2);
    var orderObj3 = new Order(order3);
    // This is a valid mongoose Id but a non-existent Order
    //var date = '2017-03-16';
    var startdate = '2017-03-16';
    //var end = '2017-03-18';
    var enddate = '2017-03-18';
    orderObj.save();
    orderObj2.save();
    orderObj3.save(function () {
      request(app).get('/api/salereports/' + startdate + '/' + enddate)
        .end(function (req, res) {
          // Set assertion
          // (res.body.freeitemunit).should.match(1);
          // console.log(res.body.orders);
          (res.body.orders.length).should.match(2);
          (res.body.saleday.length).should.match(1);
          (res.body.saleday[0].date).should.match('20170317');
          (res.body.saleday[0].amount).should.match(360);
          (res.body.saleprod.length).should.match(1);
          (res.body.saleprod[0].item.product.name).should.match('ข้าวกล้องมหัศจรรย์ ขันทอง ขนาด 5 กิโลกรัม');
          (res.body.saleprod[0].qty).should.match(2);
          (res.body.saleprod[0].amount).should.match(360);
          (res.body.avg[0].min.min).should.match(360);
          (res.body.avg[0].max.max).should.match(360);
          (res.body.percens[0].percen).should.match(100);
          // Call the assertion callback
          done();
        });
    });
  });

  it('sale report 3 orders', function (done) {
    var orderObj = new Order(order);
    var orderObj2 = new Order(order2);
    var orderObj3 = new Order(order3);
    // This is a valid mongoose Id but a non-existent Order
    //var date = '2017-03-16';
    var startdate = '2016-12-01';
    //var end = '2017-03-18';
    var enddate = '2017-03-18';
    orderObj.save();
    orderObj2.save();
    orderObj3.save(function () {
      request(app).get('/api/salereports/' + startdate + '/' + enddate)
        .end(function (req, res) {
          // Set assertion
          // (res.body.freeitemunit).should.match(1);
          // console.log(res.body.orders);
          (res.body.orders.length).should.match(3);
          (res.body.saleday.length).should.match(2);
          (res.body.saleday[1].date).should.match('20170317');
          (res.body.saleday[1].amount).should.match(360);
          (res.body.saleday[0].date).should.match('20161221');
          (res.body.saleday[0].amount).should.match(80);
          (res.body.saleprod.length).should.match(2);
          (res.body.saleprod[1].item.product.name).should.match('ข้าวกล้องมหัศจรรย์ ขันทอง ขนาด 5 กิโลกรัม');
          (res.body.saleprod[1].qty).should.match(2);
          (res.body.saleprod[1].amount).should.match(360);
          (res.body.saleprod[0].item.product.name).should.match('ข้าวกล้องมหัศจรรย์ ขันทอง ขนาด 1 กิโลกรัม');
          (res.body.saleprod[0].qty).should.match(2);
          (res.body.saleprod[0].amount).should.match(80);
          (res.body.avg[0].min.min).should.match(80);
          (res.body.avg[0].max.max).should.match(360);
          // Call the assertion callback
          done();
        });
    });
  });

  it('get order split status for admin', function (done) {
    var orderObj = new Order(order); //confirmed
    var orderObj2 = new Order(order); //wait
    var orderObj3 = new Order(order); //accept
    var orderObj4 = new Order(order); //reject
    var orderObj5 = new Order(order); //complete
    var orderObj6 = new Order(order); //cancel

    // Save the order
    orderObj2.docno = '1235';
    orderObj2.deliverystatus = 'wait deliver';

    orderObj3.docno = '1236';
    orderObj3.deliverystatus = 'accept';

    orderObj4.docno = '1237';
    orderObj4.deliverystatus = 'reject';

    orderObj5.docno = '1238';
    orderObj5.deliverystatus = 'complete';

    orderObj6.docno = '1239';
    orderObj6.deliverystatus = 'cancel';

    orderObj2.save();
    orderObj3.save();
    orderObj4.save();
    orderObj5.save();
    orderObj6.save();
    orderObj.save(function () {
      // Request Orders
      request(app).get('/api/listorder/v2')
        .end(function (req, res) {
          // Set assertion
          // (res.body.confirmed.deliverystatus).should.match('confirmed');

          res.body.confirmed.should.be.instanceof(Array).and.have.lengthOf(1);
          (res.body.confirmed[0].deliverystatus).should.match('confirmed');

          res.body.wait.should.be.instanceof(Array).and.have.lengthOf(1);
          (res.body.wait[0].deliverystatus).should.match('wait deliver');

          res.body.accept.should.be.instanceof(Array).and.have.lengthOf(1);
          (res.body.accept[0].deliverystatus).should.match('accept');

          res.body.reject.should.be.instanceof(Array).and.have.lengthOf(1);
          (res.body.reject[0].deliverystatus).should.match('reject');

          res.body.complete.should.be.instanceof(Array).and.have.lengthOf(1);
          (res.body.complete[0].deliverystatus).should.match('complete');

          res.body.cancel.should.be.instanceof(Array).and.have.lengthOf(1);
          (res.body.cancel[0].deliverystatus).should.match('cancel');



          // Call the assertion callback
          done();
        });

    });
  });

  it('check postcode from deliver', function (done) {

    request(app).get('/api/checkPostcode/12150')
      .end(function (req, res) {
        // Set assertion
        // (res.body.freeitemunit).should.match(1);
        // console.log(res.body.orders);
        (res.body.postcode).should.match('12150');
        (res.body.area).should.match(true);
        // Call the assertion callback
        done();
      });
  });

  it('find order update investor', function (done) {
    var orderObj = new Order(order); //src คนลงขัน
    var orderObj2 = new Order(order); //src ios
    var orderObj3 = new Order(order); //src android
    var orderObj4 = new Order(order); //src คนลงขัน   

    orderObj.docno = '12312321323';
    orderObj.src = 'คนลงขัน';
    orderObj.user = user;

    orderObj2.docno = '321321321321';
    orderObj2.src = 'ios';
    orderObj2.user = user;

    orderObj3.docno = '111111111112';
    orderObj3.src = 'android';
    orderObj3.user = user;

    orderObj4.docno = '123123123121111';
    orderObj4.src = 'คนลงขัน';
    orderObj4.user = deliver;

    orderObj2.save();
    orderObj3.save();
    orderObj4.save();

    orderObj.save(function () {
      request(app).get('/api/updateinvestors')
        .end(function (req, res) {
          (res.body.orders.length).should.match(2);
          (res.body.isinvestor.length).should.match(2);
          request(app).get('/api/users/' + res.body.isinvestor[0])
            .end(function (req, user) {
              (user.body.isinvestor).should.match(true);
              request(app).get('/api/users/' + res.body.isinvestor[1])
                .end(function (req, user) {
                  (user.body.isinvestor).should.match(true);
                  done();
                });
            });
        });
    });

  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Product.remove().exec(function () {
        Order.remove().exec(done);
      });
    });
  });
});
