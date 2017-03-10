'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Requestorder = mongoose.model('Requestorder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  Pushnotiuser = mongoose.model('Pushnotiuser'),
  request = require('request'),
  pushNotiUrl = 'https://api.ionic.io/push/notifications',
  pushNotiAuthenADM = { profile: 'dev', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZWM3YWNjZi1hYTNjLTQ2ZjUtYmMyNS1kODQ1MmQ2NDRlZmMifQ.Q3-2r2TL0Mq6Aq1JJSmUoTnh0LaoyMA-ZVuOylkJ7nI' },
  pushNotiAuthenDEL = { profile: 'dev', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMDYyYTMxMy1iYTdlLTQwYjYtOGM1Yy1jN2U5Y2M1N2QxZGIifQ.7jkqgdcB0kNUoQwCzH5AbCH1iIrjykMj2EyLHCx3rUs' },
  pushNotiAuthenTRA = { profile: 'dev', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MTVkMjNlNS1mMzVkLTRmNjEtOTcyMy01ZWIxNGZjMzFjYjkifQ.8E_6neuDDdMz1cqVPxcFuk7RuwB0Tu-ksdBC2ZnCs8Y' };

/**
 * Create a Requestorder
 */
exports.create = function (req, res) {
  var requestorder = new Requestorder(req.body);
  requestorder.user = req.user;

  requestorder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //admin,transporter and deliver pushnotification
      sendReqAllAdmin();
      sendReqAllTransporter();
      sendReqDeliver(requestorder);
      res.jsonp(requestorder);
    }
  });
};

/**
 * Show the current Requestorder
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var requestorder = req.requestorder ? req.requestorder.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  requestorder.isCurrentUserOwner = req.user && requestorder.user && requestorder.user._id.toString() === req.user._id.toString();

  res.jsonp(requestorder);
};

/**
 * Update a Requestorder
 */
exports.update = function (req, res) {
  var requestorder = req.requestorder;

  requestorder = _.extend(requestorder, req.body);

  requestorder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (requestorder.deliverystatus === 'request') {
        //admin,transporter and deliver pushnotification
        // sendReqAllAdmin();
        sendReqAllTransporter();
        // sendReqDeliver(requestorder);
      } else if (requestorder.deliverystatus === 'response') {
        // sendResAllAdmin(requestorder);
        // sendResDeliver(requestorder);
      } else if (requestorder.deliverystatus === 'received') {
        // sendRecAllAdmin(requestorder);
        sendRecSingleTransporter(requestorder);
      }
      res.jsonp(requestorder);
    }
  });
};

/**
 * Delete an Requestorder
 */
exports.delete = function (req, res) {
  var requestorder = req.requestorder;

  requestorder.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(requestorder);
    }
  });
};

/**
 * List of Requestorders
 */
exports.list = function (req, res) {
  Requestorder.find().sort('-created').populate('user', 'displayName').populate('items.product').populate('namedeliver').populate('transport').exec(function (err, requestorders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(requestorders);
    }
  });
};

/**
 * Requestorder middleware
 */
exports.requestorderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Requestorder is invalid'
    });
  }

  Requestorder.findById(id).populate('user', 'displayName').populate('items.product').populate('namedeliver').populate('transport').exec(function (err, requestorder) {
    if (err) {
      return next(err);
    } else if (!requestorder) {
      return res.status(404).send({
        message: 'No Requestorder with that identifier has been found'
      });
    }
    req.requestorder = requestorder;
    next();
  });
};

function sendReqAllAdmin() {
  Requestorder.find().sort('-created').where('deliverystatus').equals('request').exec(function (err, reqOrders) {
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
                message: 'คุณมีรายการขนส่งข้าวใหม่ ' + reqOrders.length + ' รายการ',
                ios: { badge: reqOrders.length, sound: 'default' },
                android: { data: { badge: reqOrders.length } }//{ badge: orders.length, sound: 'default' }
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

function sendReqAllTransporter() {
  Requestorder.find().sort('-created').where('deliverystatus').equals('request').exec(function (err, reqOrders) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('transporter').exec(function (err, trans) {
        if (err) {

        } else {
          var trntokens = [];
          trans.forEach(function (transporter) {
            trntokens.push(transporter.device_token);
          });

          request({
            url: pushNotiUrl,
            auth: {
              'bearer': pushNotiAuthenTRA.auth
            },
            method: 'POST',
            json: {
              tokens: trntokens,
              profile: pushNotiAuthenTRA.profile,
              notification: {
                message: 'คุณมีรายการขนส่งข้าวใหม่ ' + reqOrders.length + ' รายการ',
                ios: { badge: reqOrders.length, sound: 'default' },
                android: { data: { badge: reqOrders.length } }//{ badge: orders.length, sound: 'default' }
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

function sendReqDeliver(reqorder) {
  var me = '';
  if (reqorder && reqorder.namedeliver) {
    me = reqorder.namedeliver;
  } else {
    me = reqorder;
  }
  Pushnotiuser.find().sort('-created').where('role').equals('deliver').where('user_id').equals(me).exec(function (err, trans) {
    if (err) {

    } else {
      var trntokens = [];
      trans.forEach(function (transporter) {
        trntokens.push(transporter.device_token);
      });

      request({
        url: pushNotiUrl,
        auth: {
          'bearer': pushNotiAuthenDEL.auth
        },
        method: 'POST',
        json: {
          tokens: trntokens,
          profile: pushNotiAuthenDEL.profile,
          notification: {
            message: 'คุณมีรายการรับข้าวใหม่ ' + reqorder.docno,
            ios: { badge: 1, sound: 'default' },
            android: { data: { badge: 1 } }//{ badge: orders.length, sound: 'default' }
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

function sendResAllAdmin(reqorder) {
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
            message: 'รายการ ' + reqorder.docno + ' ถูกเลือกโดย ' + reqorder.transport.displayName,
            ios: { badge: 1, sound: 'default' },
            android: { data: { badge: 1 } }//{ badge: orders.length, sound: 'default' }
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

function sendResDeliver(reqorder) {
  var me = '';
  if (reqorder && reqorder.namedeliver) {
    me = reqorder.namedeliver._id;
  } else {
    me = reqorder;
  }
  Pushnotiuser.find().sort('-created').where('role').equals('deliver').where('user_id').equals(me).exec(function (err, trans) {
    if (err) {

    } else {
      var trntokens = [];
      trans.forEach(function (transporter) {
        trntokens.push(transporter.device_token);
      });

      request({
        url: pushNotiUrl,
        auth: {
          'bearer': pushNotiAuthenDEL.auth
        },
        method: 'POST',
        json: {
          tokens: trntokens,
          profile: pushNotiAuthenDEL.profile,
          notification: {
            message: 'รายการ ' + reqorder.docno + ' จัดส่งโดย' + reqorder.transport.displayName,
            ios: { badge: 1, sound: 'default' },
            android: { data: { badge: 1 } }//{ badge: orders.length, sound: 'default' }
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

function sendRecAllAdmin(reqorder) {
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
            message: 'รายการ ' + reqorder.docno + ' ส่งเรียบร้อยแล้ว',
            ios: { badge: 1, sound: 'default' },
            android: { data: { badge: 1 } }//{ badge: orders.length, sound: 'default' }
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

function sendRecSingleTransporter(reqorder) {
  var me = '';
  if (reqorder && reqorder.transport) {
    me = reqorder.transport._id;
  } else {
    me = reqorder;
  }
  Pushnotiuser.find().sort('-created').where('role').equals('transporter').where('user_id').equals(me).exec(function (err, trans) {
    if (err) {

    } else {
      var trntokens = [];
      trans.forEach(function (transporter) {
        trntokens.push(transporter.device_token);
      });
      console.log(trntokens);
      request({
        url: pushNotiUrl,
        auth: {
          'bearer': pushNotiAuthenTRA.auth
        },
        method: 'POST',
        json: {
          tokens: trntokens,
          profile: pushNotiAuthenTRA.profile,
          notification: {
            message: 'รายการ ' + reqorder.docno + ' สำเร็จแล้ว',
            ios: { badge: 1, sound: 'default' },
            android: { data: { badge: 1 } }//{ badge: orders.length, sound: 'default' }
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