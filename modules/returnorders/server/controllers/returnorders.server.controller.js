'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Returnorder = mongoose.model('Returnorder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  Pushnotiuser = mongoose.model('Pushnotiuser'),
  request = require('request'),
  pushNotiUrl = 'https://api.ionic.io/push/notifications',
  pushNotiAuthenADM = { profile: 'prod', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZWM3YWNjZi1hYTNjLTQ2ZjUtYmMyNS1kODQ1MmQ2NDRlZmMifQ.Q3-2r2TL0Mq6Aq1JJSmUoTnh0LaoyMA-ZVuOylkJ7nI' },
  pushNotiAuthenDEL = { profile: 'prod', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMDYyYTMxMy1iYTdlLTQwYjYtOGM1Yy1jN2U5Y2M1N2QxZGIifQ.7jkqgdcB0kNUoQwCzH5AbCH1iIrjykMj2EyLHCx3rUs' },
  pushNotiAuthenTRA = { profile: 'prod', auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MTVkMjNlNS1mMzVkLTRmNjEtOTcyMy01ZWIxNGZjMzFjYjkifQ.8E_6neuDDdMz1cqVPxcFuk7RuwB0Tu-ksdBC2ZnCs8Y' };

/**
 * Create a Returnorder
 */
exports.create = function (req, res) {
  var returnorder = new Returnorder(req.body);
  returnorder.user = req.user;

  returnorder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      deliverCreateAllAdminStatusReturn();
      deliverCreateAllTransportStatusReturn();
      deliverCreateStatusReturn(returnorder);
      res.jsonp(returnorder);
    }
  });
};

/**
 * Show the current Returnorder
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var returnorder = req.returnorder ? req.returnorder.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  returnorder.isCurrentUserOwner = req.user && returnorder.user && returnorder.user._id.toString() === req.user._id.toString();

  res.jsonp(returnorder);
};

/**
 * Update a Returnorder
 */
exports.update = function (req, res) {
  var returnorder = req.returnorder;

  returnorder = _.extend(returnorder, req.body);
  returnorder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (returnorder.deliverystatus === 'return') {
        deliverCreateAllAdminStatusReturn();
        deliverCreateAllTransportStatusReturn();
        deliverUpdateStatusReturn(returnorder);
      } else if (returnorder.deliverystatus === 'response') {
        var nameTransport = req.body.transport.displayName;
        statusResponseAllAdmin(returnorder, nameTransport);
        statusResponseSingleDeliver(returnorder, nameTransport);
      } else if (returnorder.deliverystatus === 'received') {
        statusReceivedSingleTransport(returnorder);
        statusReceivedSingleDeliver(returnorder);
      }
      res.jsonp(returnorder);
    }
  });
};

/**
 * Delete an Returnorder
 */
exports.delete = function (req, res) {
  var returnorder = req.returnorder;

  returnorder.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(returnorder);
    }
  });
};

/**
 * List of Returnorders
 */
exports.list = function (req, res) {
  Returnorder.find().sort('-created').populate('user').populate('items.product').populate('namedeliver').populate('transport').exec(function (err, returnorders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(returnorders);
    }
  });
};

/**
 * Returnorder middleware
 */
exports.returnorderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Returnorder is invalid'
    });
  }

  Returnorder.findById(id).populate('user').populate('items.product').populate('namedeliver').populate('transport').exec(function (err, returnorder) {
    if (err) {
      return next(err);
    } else if (!returnorder) {
      return res.status(404).send({
        message: 'No Returnorder with that identifier has been found'
      });
    }
    req.returnorder = returnorder;
    next();
  });
};

exports.enddate = function (req, res, next, enddate) {
  req.enddate = enddate;
  next();
};
exports.reportreturnorderCooking = function (req, res, next) {

  Returnorder.find({ docdate: { $gte: new Date(req.startdate), $lte: new Date(req.enddate) } })
    .sort('-created')
    .populate('user')
    .populate('items.product')
    .populate('namedeliver')
    .populate('transport')
    .exec(function (err, returnorders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.data = returnorders;
        next();
      }
    });

};
exports.reportreturnorder = function (req, res) {
  res.jsonp({
    startdate: req.startdate,
    enddate: req.enddate,
    data: req.data
  });
};

// status return
function deliverCreateAllAdminStatusReturn() {
  Returnorder.find().sort('-created').where('deliverystatus').equals('return').exec(function (err, reqReturs) {
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
                message: 'คุณมีรายการใบแจ้งคืนสินค้า ' + reqReturs.length + ' รายการ',
                // ios: { badge: reqReturs.length, sound: 'default' },
                //android: { data: { badge: reqReturs.length } }//{ badge: orders.length, sound: 'default' }
              }
            }
          }, function (error, response, body) {
            if (error) {
              //console.log('Error sending messages: ', error);
            } else if (response.body.error) {
              //console.log('Error: ', response.body.error);
            }
          });
        }
      });
    }
  });


}

function deliverCreateAllTransportStatusReturn() {
  Returnorder.find().sort('-created').where('deliverystatus').equals('return').exec(function (err, reqReturs) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('transporter').exec(function (err, trns) {
        if (err) {

        } else {
          var trntokens = [];
          trns.forEach(function (trn) {
            trntokens.push(trn.device_token);
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
                message: 'คุณมีรายการใบแจ้งคืนสินค้า ' + reqReturs.length + ' รายการ',
                // ios: { badge: reqReturs.length, sound: 'default' },
                //android: { data: { badge: reqReturs.length } }//{ badge: orders.length, sound: 'default' }
              }
            }
          }, function (error, response, body) {
            if (error) {
              //console.log('Error sending messages: ', error);
            } else if (response.body.error) {
              //console.log('Error: ', response.body.error);
            }
          });
        }
      });
    }
  });


}

function deliverCreateStatusReturn(data) {
  var me = '';
  if (data && data.namedeliver) {
    me = data.namedeliver;
  } else {
    me = data.data;
  }
  Returnorder.find().sort('-created').where('deliverystatus').equals('return').exec(function (err, reqReturs) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('deliver').where('user_id').equals(me).exec(function (err, delivers) {
        if (err) {

        } else {
          var dertokens = [];
          delivers.forEach(function (deliver) {
            dertokens.push(deliver.device_token);
          });

          request({
            url: pushNotiUrl,
            auth: {
              'bearer': pushNotiAuthenDEL.auth
            },
            method: 'POST',
            json: {
              tokens: dertokens,
              profile: pushNotiAuthenDEL.profile,
              notification: {
                message: 'คุณมีรายการใบแจ้งคืนสินค้า ' + reqReturs.length + ' รายการ',
                // ios: { badge: reqReturs.length, sound: 'default' },
                //android: { data: { badge: reqReturs.length } }//{ badge: orders.length, sound: 'default' }
              }
            }
          }, function (error, response, body) {
            if (error) {
              //console.log('Error sending messages: ', error);
            } else if (response.body.error) {
              //console.log('Error: ', response.body.error);
            }
          });
        }
      });
    }
  });


}
function deliverUpdateStatusReturn(data) {
  var me = '';
  if (data && data.namedeliver) {
    me = data.namedeliver._id;
  } else {
    me = data.data;
  }
  Returnorder.find().sort('-created').where('deliverystatus').equals('return').exec(function (err, reqReturs) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('deliver').where('user_id').equals(me).exec(function (err, delivers) {
        if (err) {

        } else {
          var dertokens = [];
          delivers.forEach(function (deliver) {
            dertokens.push(deliver.device_token);
          });

          request({
            url: pushNotiUrl,
            auth: {
              'bearer': pushNotiAuthenDEL.auth
            },
            method: 'POST',
            json: {
              tokens: dertokens,
              profile: pushNotiAuthenDEL.profile,
              notification: {
                message: 'คุณมีรายการใบแจ้งคืนสินค้า ' + reqReturs.length + ' รายการ',
                // ios: { badge: reqReturs.length, sound: 'default' },
                //android: { data: { badge: reqReturs.length } }//{ badge: orders.length, sound: 'default' }
              }
            }
          }, function (error, response, body) {
            if (error) {
              //console.log('Error sending messages: ', error);
            } else if (response.body.error) {
              //console.log('Error: ', response.body.error);
            }
          });
        }
      });
    }
  });


}

// status response
function statusResponseAllAdmin(data, nameTransport) {
  Returnorder.find().sort('-created').where('deliverystatus').equals('response').exec(function (err, reqReturs) {
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
                message: 'คุณมีรายการส่งคืนสินค้าโดย ' + nameTransport,
                // ios: { badge: reqReturs.length, sound: 'default' },
                //android: { data: { badge: reqReturs.length } }//{ badge: orders.length, sound: 'default' }
              }
            }
          }, function (error, response, body) {
            if (error) {
              //console.log('Error sending messages: ', error);
            } else if (response.body.error) {
              //console.log('Error: ', response.body.error);
            }
          });
        }
      });
    }
  });


}

function statusResponseSingleDeliver(data, nameTransport) {
  var me = '';
  if (data && data.namedeliver) {
    me = data.namedeliver._id;
  } else {
    me = data;
  }
  Returnorder.find().sort('-created').where('deliverystatus').equals('response').exec(function (err, reqReturs) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('deliver').where('user_id').equals(me).exec(function (err, delivers) {
        if (err) {

        } else {
          var dlrtokens = [];
          delivers.forEach(function (deliver, nameTransport) {
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
                message: 'คุณมีรายการส่งคืนสินค้าโดย ' + nameTransport,
                // ios: { badge: reqReturs.length, sound: 'default' },
                //android: { data: { badge: reqReturs.length } }//{ badge: orders.length, sound: 'default' }
              }
            }
          }, function (error, response, body) {
            if (error) {
              //console.log('Error sending messages: ', error);
            } else if (response.body.error) {
              //console.log('Error: ', response.body.error);
            }
          });
        }
      });
    }
  });


}

// status received
function statusReceivedSingleTransport(data) {
  var me = '';
  if (data && data.transport) {
    me = data.transport._id;
  } else {
    me = data;
  }
  Returnorder.find().sort('-created').where('deliverystatus').equals('received').exec(function (err, reqReturs) {
    if (err) {

    } else {
      Pushnotiuser.find().sort('-created').where('role').equals('transporter').where('user_id').equals(me).exec(function (err, trans) {
        if (err) {

        } else {
          var trntokens = [];
          trans.forEach(function (tran) {
            trntokens.push(tran.device_token);
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
                message: 'รายการส่งคืนของคุณสำเร็จแล้ว',
                // ios: { badge: reqReturs.length, sound: 'default' },
                //android: { data: { badge: reqReturs.length } }//{ badge: orders.length, sound: 'default' }
              }
            }
          }, function (error, response, body) {
            if (error) {
              //console.log('Error sending messages: ', error);
            } else if (response.body.error) {
              //console.log('Error: ', response.body.error);
            }
          });
        }
      });
    }
  });


}

function statusReceivedSingleDeliver(data) {
  var me = '';
  if (data && data.namedeliver) {
    me = data.namedeliver._id;
  } else {
    me = data;
  }
  Returnorder.find().sort('-created').where('deliverystatus').equals('request').exec(function (err, reqReturs) {
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
                message: 'รายการส่งคืนสำเร็จแล้ว',
                // ios: { badge: reqReturs.length, sound: 'default' },
                //android: { data: { badge: reqReturs.length } }//{ badge: orders.length, sound: 'default' }
              }
            }
          }, function (error, response, body) {
            if (error) {
              //console.log('Error sending messages: ', error);
            } else if (response.body.error) {
              //console.log('Error: ', response.body.error);
            }
          });
        }
      });
    }
  });


}
