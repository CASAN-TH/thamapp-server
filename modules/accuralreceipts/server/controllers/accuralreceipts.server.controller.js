'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Accuralreceipt = mongoose.model('Accuralreceipt'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  Order = mongoose.model('Order'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  Pushnotiuser = mongoose.model('Pushnotiuser'),
  request = require('request'),
  pushNotiUrl = 'https://api.ionic.io/push/notifications',
  pushNotiAuthenADM = { profile: 'dev', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZWM3YWNjZi1hYTNjLTQ2ZjUtYmMyNS1kODQ1MmQ2NDRlZmMifQ.Q3-2r2TL0Mq6Aq1JJSmUoTnh0LaoyMA-ZVuOylkJ7nI' },
  pushNotiAuthenDEL = { profile: 'dev', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMDYyYTMxMy1iYTdlLTQwYjYtOGM1Yy1jN2U5Y2M1N2QxZGIifQ.7jkqgdcB0kNUoQwCzH5AbCH1iIrjykMj2EyLHCx3rUs' },
  pushNotiAuthenTRA = { profile: 'dev', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MTVkMjNlNS1mMzVkLTRmNjEtOTcyMy01ZWIxNGZjMzFjYjkifQ.8E_6neuDDdMz1cqVPxcFuk7RuwB0Tu-ksdBC2ZnCs8Y' };

/**
 * Create a Accuralreceipt
 */
exports.create = function (req, res) {
  var accuralreceipt = new Accuralreceipt(req.body);
  accuralreceipt.user = req.user;
  var ordcount = 0;
  accuralreceipt.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      allAdminStatusReview();

      req.body.items.forEach(function (order) {
        updateAP(order, accuralreceipt.docno, function (err, item) {
          if (err) {
            console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            ordcount++;
            if (ordcount === accuralreceipt.items.length) {
              res.jsonp(accuralreceipt);
            }
          }

        });
      });

      //res.jsonp(accuralreceipt);
    }
  });



};

/**
 * Show the current Accuralreceipt
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var accuralreceipts = req.accuralreceipt ? req.accuralreceipt.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  accuralreceipts.isCurrentUserOwner = req.user && accuralreceipts.user && accuralreceipts.user._id.toString() === req.user._id.toString();
  User.populate(accuralreceipts, { path: 'items.user' },
    function (err, user) {
      User.populate(accuralreceipts, { path: 'items.namedeliver' },
        function (err, deliver) {
          Product.populate(accuralreceipts, { path: 'items.items.product' },
            function (err, product) {
              res.jsonp(product);
            }
          );
        }
      );
    }
  );
  // res.jsonp(accuralreceipt);
};

/**
 * Update a Accuralreceipt
 */
exports.update = function (req, res) {
  var accuralreceipt = req.accuralreceipt;

  accuralreceipt = _.extend(accuralreceipt, req.body);
  var ordcount = 0;
  accuralreceipt.items.forEach(function (order) {
    Order.update({ refdoc: accuralreceipt.docno }, { $set: { deliverystatus: 'complete', refdoc: '' } }, { multi: true }, function () {
      updateAP(order, accuralreceipt.docno, function (err, item) {
        if (err) {
          console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          ordcount++;
          if (ordcount === accuralreceipt.items.length) {
            accuralreceipt.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                if (accuralreceipt.arstatus === 'wait for review') {
                  allAdminStatusReview();
                } else if (accuralreceipt.arstatus === 'wait for confirmed') {
                  allAdminStatusConfirm(accuralreceipt);
                } else if (accuralreceipt.arstatus === 'confirmed') {
                  var nameDeli = req.accuralreceipt.namedeliver.displayName;
                  allAdminStatusConfirmed(accuralreceipt, nameDeli);
                } else if (accuralreceipt.arstatus === 'receipt') {
                  var nameDeliver = req.accuralreceipt.namedeliver.displayName;                  
                  allAdminStatusReceipt(accuralreceipt, nameDeliver);
                  deliverStatusReceipt(accuralreceipt);
                }
                res.jsonp(accuralreceipt);
              }
            });
          }
        }

      });
    });
    /////////////////

  });



};



function updateAP(order, docno, callback) {
  order.deliverystatus = 'ap';
  order.refdoc = docno;
  Order.findById(order._id).exec(function (err, _order) {
    // console.log(_order);
    _order.deliverystatus = 'ap';
    _order.refdoc = docno;
    _order.save(function (err) {
      if (err) {
        return callback(err, null);
      } else {
        //order = _order;
        return callback(null, _order);
      }
    });
  });

}
/**
 * Delete an Accuralreceipt
 */
exports.delete = function (req, res) {
  var accuralreceipt = req.accuralreceipt;
  Order.update({ refdoc: accuralreceipt.docno }, { $set: { deliverystatus: 'complete', refdoc: '' } }, { multi: true }, function () {
    accuralreceipt.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(accuralreceipt);
        res.jsonp(accuralreceipt);
      }
    });
  });
};

/**
 * List of Accuralreceipts
 */
exports.list = function (req, res) {
  Accuralreceipt.find().sort('-created').populate('user').populate('items').populate('namedeliver').exec(function (err, accuralreceipts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      User.populate(accuralreceipts, { path: 'items.user' },
        function (err, user) {
          User.populate(accuralreceipts, { path: 'items.namedeliver' },
            function (err, deliver) {
              Product.populate(accuralreceipts, { path: 'items.items.product' },
                function (err, product) {
                  res.jsonp(product);
                }
              );
            }
          );
        }
      );

    }
  });
};

/**
 * Accuralreceipt middleware
 */
exports.accuralreceiptByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Accuralreceipt is invalid'
    });
  }

  Accuralreceipt.findById(id).populate('user').populate('items').populate('namedeliver').exec(function (err, accuralreceipt) {
    if (err) {
      return next(err);
    } else if (!accuralreceipt) {
      return res.status(404).send({
        message: 'No Accuralreceipt with that identifier has been found'
      });
    }
    req.accuralreceipt = accuralreceipt;
    next();
  });
};

// status wait for review
function allAdminStatusReview() {
  Accuralreceipt.find().sort('-created').where('arstatus').equals('wait for review').exec(function (err, reqAccs) {
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
                message: 'คุณมีรายการใบแจ้งหนี้ใหม่ ' + reqAccs.length + ' รายการ',
                // ios: { badge: reqAccs.length, sound: 'default' },
                //android: { data: { badge: reqAccs.length } }//{ badge: orders.length, sound: 'default' }
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

// status wait form confirmed
function allAdminStatusConfirm(data) {
  var me = '';
  if (data && data.namedeliver) {
    me = data.namedeliver._id;
  } else {
    me = data;
  }
  Accuralreceipt.find().sort('-created').where('arstatus').equals('wait for confirmed').exec(function (err, reqAccs) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('deliver').where('user_id').equals(me).exec(function (err, delivers) {
        if (err) {

        } else {
          var dlrtokens = [];
          delivers.forEach(function (deliver) {
            dlrtokens.push(deliver.device_token);
          });

          request({
            url: pushNotiUrl,
            auth: {
              'bearer': pushNotiAuthenDEL.auth
            },
            method: 'POST',
            json: {
              tokens: dlrtokens,
              profile: pushNotiAuthenDEL.profile,
              notification: {
                message: 'คุณมีรายการใบแจ้งหนี้ใหม่ ' + reqAccs.length + ' รายการ',
                // ios: { badge: reqAccs.length, sound: 'default' },
                //android: { data: { badge: reqAccs.length } }//{ badge: orders.length, sound: 'default' }
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

// status confirmed
function allAdminStatusConfirmed(data, nameDeli) {
  Accuralreceipt.find().sort('-created').where('arstatus').equals('confirmed').exec(function (err, reqAccs) {
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
                message: nameDeli + ' ยืนยันใบแจ้งหนี้แล้ว',
                // ios: { badge: 1, sound: 'default' },
                //android: { data: { badge: 1 } }//{ badge: orders.length, sound: 'default' }
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

// status receipt
function allAdminStatusReceipt(data, nameDeli) {
  Accuralreceipt.find().sort('-created').where('arstatus').equals('receipt').exec(function (err, reqAccs) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('admin').exec(function (err, delivers) {
        if (err) {

        } else {
          var dlrtokens = [];
          delivers.forEach(function (deliver) {
            dlrtokens.push(deliver.device_token);
          });

          request({
            url: pushNotiUrl,
            auth: {
              'bearer': pushNotiAuthenADM.auth
            },
            method: 'POST',
            json: {
              tokens: dlrtokens,
              profile: pushNotiAuthenADM.profile,
              notification: {
                message: 'ใบแจ้งหนี้ ' + nameDeli + ' รับเงินแล้ว',
                // ios: { badge: 1, sound: 'default' },
                //android: { data: { badge: 1 } }//{ badge: orders.length, sound: 'default' }
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

function deliverStatusReceipt(data) {
  var me = '';
  if (data && data.namedeliver) {
    me = data.namedeliver._id;
  } else {
    me = data;
  }
  Accuralreceipt.find().sort('-created').where('arstatus').equals('receipt').exec(function (err, reqAccs) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('deliver').where('user_id').equals(me).exec(function (err, delivers) {
        if (err) {

        } else {
          var dlrtokens = [];
          delivers.forEach(function (deliver) {
            dlrtokens.push(deliver.device_token);
          });

          request({
            url: pushNotiUrl,
            auth: {
              'bearer': pushNotiAuthenDEL.auth
            },
            method: 'POST',
            json: {
              tokens: dlrtokens,
              profile: pushNotiAuthenDEL.profile,
              notification: {
                message: 'รายการแจ้งหนี้ของคุณสำเร็จแล้ว 1 รายการ',
                // ios: { badge: 1, sound: 'default' },
                //android: { data: { badge: 1 } }//{ badge: orders.length, sound: 'default' }
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