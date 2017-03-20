'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  Pushnotiuser = mongoose.model('Pushnotiuser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  request = require('request'),
  pushNotiUrl = 'https://api.ionic.io/push/notifications',
  pushNotiAuthenADM = { profile: 'prod', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZWM3YWNjZi1hYTNjLTQ2ZjUtYmMyNS1kODQ1MmQ2NDRlZmMifQ.Q3-2r2TL0Mq6Aq1JJSmUoTnh0LaoyMA-ZVuOylkJ7nI' },
  pushNotiAuthenUSR = { profile: 'prod', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4MmRiMGFjNC1iNWU0LTRkZDUtOTdhMy1hZDEyNzc1ZGI3MzgifQ.zXo565twaedV97JzIZXAiLkGiXtoUIvkyMOUFS-tcms' },
  pushNotiAuthenDEL = { profile: 'prod', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMDYyYTMxMy1iYTdlLTQwYjYtOGM1Yy1jN2U5Y2M1N2QxZGIifQ.7jkqgdcB0kNUoQwCzH5AbCH1iIrjykMj2EyLHCx3rUs' };

/**
 * Create a Order
 */
exports.create = function (req, res) {
  var order = new Order(req.body);
  if (req.user) {
    order.user = req.user;
  }

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Order.findOne(order).populate('user', 'displayName').populate('items.product').populate('namedeliver').exec(function (err2, orders) {
        if (err2) {
          console.log('err');
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err2)
          });
        } else {
          sendNewOrder();
          res.jsonp(orders);
        }
      });
    }
  });
};

/**
 * Show the current Order
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var order = req.order ? req.order.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  order.isCurrentUserOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString();

  res.jsonp(order);
};

/**
 * Update a Order
 */
exports.update = function (req, res) {
  var order = req.order;

  order = _.extend(order, req.body);

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (order.deliverystatus === 'wait deliver') {
        sendNewOrder();
        sendNewDeliver(order.namedeliver);
        sendWaitDeliUser(order);
      } else if (order.deliverystatus === 'accept') {
        sendNewOrder();
        sendNewDeliver(order.namedeliver);
        sendAcceptUser(order);
      } else if (order.deliverystatus === 'reject') {
        //sendNewOrder();
        //sendNewDeliver(order.namedeliver);
      } else if (order.deliverystatus === 'complete') {
        sendCompleteDeliver(order.namedeliver);
        sendCompleteUser(order);
      }

      res.jsonp(order);
    }
  });
};

/**
 * Delete an Order
 */
exports.delete = function (req, res) {
  var order = req.order;

  order.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = function (req, res) {
  Order.find().sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orders);
    }
  });
};

/**
 * Order middleware
 */
exports.orderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    });
  }

  Order.findById(id).populate('user').populate('items.product').populate('namedeliver').exec(function (err, order) {
    if (err) {
      return next(err);
    } else if (!order) {
      return res.status(404).send({
        message: 'No Order with that identifier has been found'
      });
    }
    req.order = order;
    next();
  });
};

exports.startdate = function (req, res, next, enddate) {
  var end = new Date(enddate);
  var startdate = req.startdate;
  Order.find({ created: { $gte: startdate, $lte: end } }).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, orders) {
    if (err) {
      return next(err);
    } else if (!orders) {
      return res.status(404).send({
        message: 'No Order with that identifier has been found'
      });
    }
    req.orders = orders;
    next();
  });
};

exports.salereport = function (req, res, next) {
  var end = req.enddate;
  var startdate = new Date(req.startdate);
  var orderslist = req.orders ? req.orders : [];
  var saleday = saleDate(orderslist);
  var saleprod = []; ////saleProduct(orderslist);

  res.jsonp({ orders: orderslist, saleday: saleday, saleprod: saleprod });

};
Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('');
};
function saleProduct(orders) {
  var products = [];
  orders.forEach(function (order) {
    if (products.length > 0) {
      order.items.forEach(function (itm) {
        products.forEach(function (prod) {
          if (itm.product._id === prod.product._id) {
            prod.qty += itm.qty;
            prod.amount += itm.amount;
          } else {
            products.push(itm);
          }
        });
      });
    } else {
      order.items.forEach(function (itm) {
        products.push(itm);
      });
    }
  });
  return products;
}

function saleDate(orders) {
  var results = [];
  orders.forEach(function (order) {
    if (results.length > 0) {
      results.forEach(function (resultorder) {
        if (order.created.yyyymmdd() === resultorder.date) {
          resultorder.amount += order.amount;
        } else {
          results.push({
            date: order.created.yyyymmdd(),
            amount: order.amount
          });
        }
      });
    } else {
      results.push({
        date: order.created.yyyymmdd(),
        amount: order.amount
      });
    }

  });
  return results;
}

function sendNewOrder() {
  Order.find().sort('-created').where('deliverystatus').equals('confirmed').exec(function (err, orders) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('admin').exec(function (err, admins) {
        if (err) {

        } else {
          var admtokens = [];
          admins.forEach(function (admin) {
            admtokens.push(admin.device_token);
          });

          request({
            url: pushNotiUrl,
            auth: {
              'bearer': pushNotiAuthenADM.auth
            },
            method: 'POST',
            json: {
              tokens: admtokens,
              profile: pushNotiAuthenADM.profile,
              notification: {
                message: 'คุณมีรายการสั่งซื้อข้าวใหม่ ' + orders.length + ' รายการ',
                ios: { badge: orders.length, sound: 'default' },
                android: { data: { badge: orders.length } }//{ badge: orders.length, sound: 'default' }
              }
            }
          }, function (error, response, body) {
            if (error) {
              console.log('Error sending messages: ', error);
            } else if (response.body.error) {
              console.log('Error: ', response.body.error);
            }
          });
        }
      });
    }
  });


}

function sendNewDeliver(deliver) {
  var me = '';
  if (deliver._id) {
    me = deliver._id;
  } else {
    me = deliver;
  }
  Order.find().sort('-created')
    .where('deliverystatus').equals('wait deliver')
    .where('namedeliver').equals(deliver)
    .exec(function (err, orders) {
      if (err) {

      } else {
        Pushnotiuser.find().sort('-created')
          .where('role').equals('deliver')
          .where('user_id').equals(me)
          .exec(function (err, delivers) {
            if (err) {

            } else {
              var admtokens = [];
              delivers.forEach(function (deliver) {
                admtokens.push(deliver.device_token);
              });
              console.log(admtokens);
              request({
                url: pushNotiUrl,
                auth: {
                  'bearer': pushNotiAuthenDEL.auth
                },
                method: 'POST',
                json: {
                  tokens: admtokens,
                  profile: pushNotiAuthenDEL.profile,
                  notification: {
                    message: 'คุณมีรายการส่งข้าวใหม่ ' + orders.length + ' รายการ',
                    ios: { badge: orders.length, sound: 'default' },
                    android: { data: { badge: orders.length } }
                    // android: { badge: orders.length, sound: 'default' }
                  }
                }
              }, function (error, response, body) {
                if (error) {
                  console.log('Error sending messages: ', error);
                } else if (response.body.error) {
                  console.log('Error: ', response.body.error);
                }
              });
            }
          });
      }
    });


}

function sendCompleteDeliver(deliver) {
  var me = '';
  if (deliver._id) {
    me = deliver._id;
  } else {
    me = deliver;
  }
  Order.find().sort('-created')
    .where('deliverystatus').equals('accept')
    .where('namedeliver').equals(deliver)
    .exec(function (err, orders) {
      if (err) {

      } else {
        Pushnotiuser.find().sort('-created')
          .where('role').equals('deliver')
          .where('user_id').equals(me)
          .exec(function (err, delivers) {
            if (err) {

            } else {
              var admtokens = [];
              delivers.forEach(function (deliver) {
                admtokens.push(deliver.device_token);
              });
              console.log(admtokens);
              request({
                url: pushNotiUrl,
                auth: {
                  'bearer': pushNotiAuthenDEL.auth
                },
                method: 'POST',
                json: {
                  tokens: admtokens,
                  profile: pushNotiAuthenDEL.profile,
                  notification: {
                    message: 'คุณมีรายการค้างส่งข้าวคงเหลือ ' + orders.length + ' รายการ',
                    //ios: { badge: orders.length, sound: 'default' },
                    //android: { data: { badge: orders.length } }
                    // android: { badge: orders.length, sound: 'default' }
                  }
                }
              }, function (error, response, body) {
                if (error) {
                  console.log('Error sending messages: ', error);
                } else if (response.body.error) {
                  console.log('Error: ', response.body.error);
                }
              });
            }
          });
      }
    });


}

function sendWaitDeliUser(order) {
  var me = '';
  if (order.user) {
    me = order.user._id;
  } else {
    me = order;
  }
  Pushnotiuser.find().sort('-created').where('role').equals('user').where('user_id').equals(me).exec(function (err, users) {
    if (err) {

    } else {
      var usrtokens = [];
      users.forEach(function (user) {
        usrtokens.push(user.device_token);
      });

      request({
        url: pushNotiUrl,
        auth: {
          'bearer': pushNotiAuthenUSR.auth
        },
        method: 'POST',
        json: {
          tokens: usrtokens,
          profile: pushNotiAuthenUSR.profile,
          notification: {
            message: 'ทางเราได้รับรายการสั่งซื้อของคุณแล้ว',
            //ios: { badge: orders.length, sound: 'default' },
            //android: { data: { badge: orders.length } }//{ badge: orders.length, sound: 'default' }
          }
        }
      }, function (error, response, body) {
        if (error) {
          console.log('Error sending messages: ', error);
        } else if (response.body.error) {
          console.log('Error: ', response.body.error);
        }
      });
    }
  });


}

function sendAcceptUser(order) {
  var me = '';
  if (order.user) {
    me = order.user._id;
  } else {
    me = order;
  }
  Pushnotiuser.find().sort('-created').where('role').equals('user').where('user_id').equals(me).exec(function (err, users) {
    if (err) {

    } else {
      var usrtokens = [];
      users.forEach(function (user) {
        usrtokens.push(user.device_token);
      });

      request({
        url: pushNotiUrl,
        auth: {
          'bearer': pushNotiAuthenUSR.auth
        },
        method: 'POST',
        json: {
          tokens: usrtokens,
          profile: pushNotiAuthenUSR.profile,
          notification: {
            message: 'คำสั่งซื้อของคุณอยู่ระหว่างจัดส่ง',
            //ios: { badge: orders.length, sound: 'default' },
            //android: { data: { badge: orders.length } }//{ badge: orders.length, sound: 'default' }
          }
        }
      }, function (error, response, body) {
        if (error) {
          console.log('Error sending messages: ', error);
        } else if (response.body.error) {
          console.log('Error: ', response.body.error);
        }
      });
    }
  });


}

function sendCompleteUser(order) {
  var me = '';
  if (order.user) {
    me = order.user._id;
  } else {
    me = order;
  }
  Pushnotiuser.find().sort('-created').where('role').equals('user').where('user_id').equals(me).exec(function (err, users) {
    if (err) {

    } else {
      var usrtokens = [];
      users.forEach(function (user) {
        usrtokens.push(user.device_token);
      });

      request({
        url: pushNotiUrl,
        auth: {
          'bearer': pushNotiAuthenUSR.auth
        },
        method: 'POST',
        json: {
          tokens: usrtokens,
          profile: pushNotiAuthenUSR.profile,
          notification: {
            message: 'ขอขอบคุณที่ใช้บริการ ธรรมธุรกิจ',
            //ios: { badge: orders.length, sound: 'default' },
            //android: { data: { badge: orders.length } }//{ badge: orders.length, sound: 'default' }
          }
        }
      }, function (error, response, body) {
        if (error) {
          console.log('Error sending messages: ', error);
        } else if (response.body.error) {
          console.log('Error: ', response.body.error);
        }
      });
    }
  });

}