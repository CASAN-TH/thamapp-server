'use strict';

/**
 * Module dependencies. ccc
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  Pushnotiuser = mongoose.model('Pushnotiuser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  request = require('request'),
  pushNotiUrl = process.env.PUSH_NOTI_URL || 'https://api.ionic.io/push/notifications',
  pushNotiAuthenADM = {
    profile: process.env.PUSH_NOTI_PROFILE || 'dev',
    auth: process.env.PUSH_NOTI_ADM_AUTH || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZWM3YWNjZi1hYTNjLTQ2ZjUtYmMyNS1kODQ1MmQ2NDRlZmMifQ.Q3-2r2TL0Mq6Aq1JJSmUoTnh0LaoyMA-ZVuOylkJ7nI'
  },
  pushNotiAuthenUSR = {
    profile: process.env.PUSH_NOTI_PROFILE || 'dev',
    auth: process.env.PUSH_NOTI_USR_AUTH || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4MmRiMGFjNC1iNWU0LTRkZDUtOTdhMy1hZDEyNzc1ZGI3MzgifQ.zXo565twaedV97JzIZXAiLkGiXtoUIvkyMOUFS-tcms'
  },
  pushNotiAuthenDEL = {
    profile: process.env.PUSH_NOTI_PROFILE || 'dev',
    auth: process.env.PUSH_NOTI_DEL_AUTH || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMDYyYTMxMy1iYTdlLTQwYjYtOGM1Yy1jN2U5Y2M1N2QxZGIifQ.7jkqgdcB0kNUoQwCzH5AbCH1iIrjykMj2EyLHCx3rUs'
  };

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
          sendNewdeliverOrder();
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
  var filter = null;
  // jigkoh comment for get all order
  // if (req.user && req.user.roles.indexOf('deliver') !== -1) {

  //   filter = {
  //     'namedeliver': req.user._id
  //   };
  // }
  Order.find(filter).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orders);
    }
  });
};

exports.listorder = function (req, res) {
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
  Order.find({ created: { $gte: startdate, $lte: end }, deliverystatus: { $ne: 'cancel' } }).sort('created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, orders) {
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
  var saleprod = saleProduct(orderslist);
  var avgMaxMin = progressOfDate(saleday);
  var percenOfProd = percenProd(saleprod);

  res.jsonp({ orders: orderslist, saleday: saleday, saleprod: saleprod, avg: avgMaxMin, percens: percenOfProd });

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
  var productId = [];
  var items = [];
  orders.forEach(function (order) {
    order.items.forEach(function (itm) {
      if (productId.indexOf(itm.product._id) === -1) {
        productId.push(itm.product._id);
      }
      items.push(itm);
    });
  });
  productId.forEach(function (id) {
    var data = {
      qty: 0,
      amount: 0
    };
    items.forEach(function (itm) {
      var retailer = 0;
      retailer = itm.product.retailerprice;
      if (id === itm.product._id) {
        data.item = itm;
        data.qty += itm.qty;
        data.amount = (data.qty * retailer);
      }
    });
    products.push(data);
  });
  return products;
}

function saleDate(orders) {
  var results = [];
  var days = [];
  orders.forEach(function (order) {
    var orderDate = order.created.yyyymmdd();
    if (days.indexOf(orderDate) === -1) {
      days.push(orderDate);
    }
  });
  days.forEach(function (day) {
    var data = {
      date: day,
      amount: 0
    };
    var amoutRetailer = 0;
    orders.forEach(function (order) {
      if (day === order.created.yyyymmdd()) {
        var sum = 0;
        order.items.forEach(function (itm) {
          sum += (itm.qty * itm.product.retailerprice);
        });
        data.amount += sum;
      }
    });
    results.push(data);
  });
  return results;
}

function progressOfDate(data) {
  var min = [];
  var max = [];
  var mocData = {
    min: {},
    max: {}
  };
  var sumForAvg = 0;
  var countData = data.length;
  var results = [];
  data.forEach(function (itm) {
    sumForAvg += itm.amount;
    if (min.length > 0) {
      min.forEach(function (findmin) {
        if (findmin.amount > itm.amount) {
          min = [];
          min.push(itm);
        }
      });
    } else {
      min.push(itm);
    }

    if (max.length > 0) {
      max.forEach(function (findmin) {
        if (findmin.amount < itm.amount) {
          max = [];
          max.push(itm);
        }
      });
    } else {
      max.push(itm);
    }
    min.forEach(function (mn) {
      mocData.min.date = mn.date;
      mocData.min.min = mn.amount;
    });
    max.forEach(function (mx) {
      mocData.max.date = mx.date;
      mocData.max.max = mx.amount;
    });
    mocData.avg = sumForAvg / countData;
    results.push(mocData);
  });
  return results;
}

function percenProd(products) {
  var data = {};
  var results = [];
  var allProd = 0;
  products.forEach(function (prod) {
    allProd += prod.amount;
  });
  products.forEach(function (prod) {
    data = {};
    var percen = 0;
    percen = (prod.amount / allProd) * 100;
    data.product = prod;
    data.percen = percen;
    results.push(data);
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

function sendNewdeliverOrder() {
  Order.find().sort('-created').where('deliverystatus').equals('confirmed').exec(function (err, orders) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('deliver').exec(function (err, delivers) {
        if (err) {

        } else {
          var delivertokens = [];
          delivers.forEach(function (deliver) {
            delivertokens.push(deliver.device_token);
          });

          request({
            url: pushNotiUrl,
            auth: {
              'bearer': pushNotiAuthenDEL.auth
            },
            method: 'POST',
            json: {
              tokens: delivertokens,
              profile: pushNotiAuthenDEL.profile,
              notification: {
                message: 'คุณมีรายการสั่งซื้อข้าวใหม่ ' + orders.length + ' รายการ',
                // ios: { sound: 'default' },
                // android: { data: { badge: orders.length } }//{ badge: orders.length, sound: 'default' }
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