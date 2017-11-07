'use strict';

/**
 * Module dependencies. ccc
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  User = mongoose.model('User'),
  Postcode = mongoose.model('Postcode'),
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
  },
  ProvinceInarea = process.env.ProvinceInarea || ['กรุงเทพมหานคร', 'ปทุมธานี', 'นนทบุรี'],
  minDistance = process.env.MIN_DISTANCE || 10;

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
  (mm > 9 ? '' : '0') + mm,
  (dd > 9 ? '' : '0') + dd
  ].join('');
};
/**
 * Create a Order
 */
// indexOf ถ้า === -1 คือไม่มี
exports.postcode = function (req, res, next, postcode) {
  req.postcode = postcode;
  next();
  // Postcode.find({ postcode: postcode }).sort('-created').exec(function (err, postcode) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     if (postcode.length > 0) {
  //       if (ProvinceInarea.indexOf(postcode[0].province) !== -1) {
  //         req.area = true;
  //         next();
  //       } else {
  //         User.find().sort('-created').exec(function (err, users) {
  //           if (err) {
  //             return res.status(400).send({
  //               message: errorHandler.getErrorMessage(err)
  //             });
  //           } else {
  //             var userPostcodes = users.filter(function (obj) { return obj.address.postcode === postcode; });
  //             var delivers = userPostcodes.filter(function (obj) { return obj.roles[0] === 'deliver'; });
  //             if (delivers.length > 0) {
  //               req.area = true;
  //               next();
  //             } else {
  //               req.area = false;
  //               next();
  //             }
  //           }
  //         });
  //       }
  //     } else {
  //       User.find().sort('-created').exec(function (err, users) {
  //         if (err) {
  //           return res.status(400).send({
  //             message: errorHandler.getErrorMessage(err)
  //           });
  //         } else {
  //           var userPostcodes = users.filter(function (obj) { return obj.address.postcode === postcode; });
  //           var delivers = userPostcodes.filter(function (obj) { return obj.roles[0] === 'deliver'; });
  //           if (delivers.length > 0) {
  //             req.area = true;
  //             next();
  //           } else {
  //             req.area = false;
  //             next();
  //           }
  //         }
  //       });
  //     }
  //   }
  // });
};

exports.resultpostcode = function (req, res) {
  res.jsonp({ postcode: req.postcode, area: true });
};

exports.adminCreate = function (req, res, next) {
  var order = new Order(req.body);
  if (req.user && req.user.roles[0] === 'admin') {
    User.find({ username: order.shipping.tel }).sort('-created').exec(function (err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (users.length > 0) {
          req.usercreate = users[0];
          next();
        } else {
          var firstname = order.shipping.firstname ? order.shipping.firstname : order.shipping.firstName;
          var lastname = order.shipping.lastname ? order.shipping.lastname : order.shipping.lastName;
          var newUser = new User({
            firstName: firstname,
            lastName: lastname,
            displayName: firstname + ' ' + lastname,
            email: order.shipping.tel + '@thamturakit.com',
            username: order.shipping.tel,
            password: 'Usr#Pass1234',
            address: {
              address: order.shipping.address,
              postcode: order.shipping.postcode,
              subdistrict: order.shipping.subdistrict,
              province: order.shipping.province,
              district: order.shipping.district,
              tel: order.shipping.tel,
              email: order.shipping.tel + '@thamturakit.com'
            },
            provider: 'local'
          });
          newUser.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              req.usercreate = newUser;
              next();
            }
          });
        }
      }
    });
  } else {
    next();
  }

  // console.log(order);
};

exports.checkDeliver = function (req, res, next) {
  var order = new Order(req.body);
  if (order.deliverystatus === 'complete') {
    next();
  } else {
    if (req.usercreate && req.usercreate !== undefined) {
      Order.find({ user: { _id: req.usercreate._id } }).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, orders) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var deliver2 = [];
          if (orders.length > 0) {
            orders.forEach(function (order) {
              if (order.deliverystatus === 'complete') {
                if (order.namedeliver && order.namedeliver !== undefined) {
                  deliver2.push(order.namedeliver);
                }
              }
            });
            if (deliver2.length > 0) {
              req.olddeliver = deliver2[0];
              next();
            } else {
              next();
            }
          } else {
            next();
          }
        }
      });
    } else {
      Order.find({ user: { _id: req.user._id } }).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, orders) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var deliver = [];
          if (orders.length > 0) {
            orders.forEach(function (order) {
              if (order.deliverystatus === 'complete') {
                if (order.namedeliver && order.namedeliver !== undefined) {
                  deliver.push(order.namedeliver);
                }
              }
            });
            if (deliver.length > 0) {
              req.olddeliver = deliver[0];
              next();
            } else {
              next();
            }
          } else {
            next();
          }

        }
      });
    }
  }
};

exports.findOldDeliver = function (req, res, next) {
  var order = new Order(req.body);

  if (order.deliverystatus === 'complete') {
    next();
  } else {
    if (req.olddeliver && req.olddeliver !== undefined) {
      Pushnotiuser.find().sort('-created').where('role').equals('deliver').populate('user').exec(function (err, delivers) {
        if (err) {

        } else {
          var delivertokens = [];
          var usernearby = [];
          // var delivertokens2 = [];
          // var delivertokensOther = [];
          if (delivers.length > 0) {

            delivers.forEach(function (deliver) {
              if (deliver.user && deliver.user._id.toString() === req.olddeliver._id.toString()) {


                //console.log(deliver.user.address);

                if (usernearby.indexOf(deliver.user._id) === -1) {
                  usernearby.push(deliver.user._id);
                }
                if (delivertokens.indexOf(deliver.device_token) === -1) {
                  delivertokens.push(deliver.device_token);
                }
              }

              //delivertokens.push(deliver.device_token);
            });
            req.tokens = delivertokens;
            req.usernearby = usernearby;
            next();
          } else {
            next();
          }
        }
      });
    } else {
      next();
    }
  }

};

exports.nearByKm = function (req, res, next) {
  var order = new Order(req.body);

  if (order.deliverystatus === 'complete') {
    next();
  } else {
    if (!req.olddeliver) {
      req.usernearby = [];
      req.tokens = [];
      if (order && order.shipping && order.shipping.sharelocation) {
        Pushnotiuser.find().sort('-created').where('role').equals('deliver').populate('user').exec(function (err, delivers) {
          if (err) {

          } else {
            var delivertokens = [];
            var usernearby = [];
            // var delivertokens2 = [];
            // var delivertokensOther = [];
            if (delivers.length > 0) {

              delivers.forEach(function (deliver) {

                //console.log(deliver.user.address);
                if (deliver.user && deliver.user.address && deliver.user.address.sharelocation) {
                  var dist = getDistanceFromLatLonInKm(order.shipping.sharelocation.latitude, order.shipping.sharelocation.longitude, deliver.user.address.sharelocation.latitude, deliver.user.address.sharelocation.longitude);
                  //console.log('------------- ' + dist + ' km. -------------')
                  if (dist <= minDistance) {
                    if (usernearby.indexOf(deliver.user._id) === -1) {
                      usernearby.push(deliver.user._id);
                    }
                    if (delivertokens.indexOf(deliver.device_token) === -1) {
                      delivertokens.push(deliver.device_token);
                    }
                  }
                }
                //delivertokens.push(deliver.device_token);
              });
              req.tokens = delivertokens;
              req.usernearby = usernearby;
              next();
            } else {
              next();
            }
          }
        });
      }

    } else {
      next();
    }
  }
};

exports.nearByPostCode = function (req, res, next) {
  var order = new Order(req.body);
  if (order.deliverystatus === 'complete') {
    next();
  } else {
    if (!req.olddeliver) {

      if (req.usernearby && req.usernearby.length === 0) {
        if (order && order.shipping && order.shipping.sharelocation) {
          Pushnotiuser.find().sort('-created').where('role').equals('deliver').populate('user').exec(function (err, delivers) {
            if (err) {

            } else {
              if (delivers.length > 0) {

                var delivertokens = [];
                var usernearby = [];
                // var delivertokens2 = [];
                // var delivertokensOther = [];
                delivers.forEach(function (deliver) {

                  //console.log(deliver.user.address);
                  if (deliver.user && deliver.user.address) {
                    if (deliver.user.address.postcode === order.shipping.postcode) {
                      if (usernearby.indexOf(deliver.user._id) === -1) {
                        usernearby.push(deliver.user._id);
                      }
                      if (delivertokens.indexOf(deliver.device_token) === -1) {
                        delivertokens.push(deliver.device_token);
                      }
                    }
                  }
                  //delivertokens.push(deliver.device_token);
                });
                req.tokens = delivertokens;
                req.usernearby = usernearby;
                next();
              } else {
                next();
              }
            }
          });
        }

      } else {
        next();
      }
    } else {
      next();
    }

  }
};

exports.nearByDistrict = function (req, res, next) {
  var order = new Order(req.body);
  if (order.deliverystatus === 'complete') {
    next();
  } else {
    if (!req.olddeliver) {

      if (req.usernearby && req.usernearby.length === 0) {
        if (order && order.shipping && order.shipping.sharelocation) {
          Pushnotiuser.find().sort('-created').where('role').equals('deliver').populate('user').exec(function (err, delivers) {
            if (err) {

            } else {
              if (delivers.length > 0) {

                var delivertokens = [];
                var usernearby = [];
                // var delivertokens2 = [];
                // var delivertokensOther = [];
                delivers.forEach(function (deliver) {

                  //console.log(deliver.user.address);
                  if (deliver.user && deliver.user.address) {
                    if (deliver.user.address.district === order.shipping.district) {
                      if (usernearby.indexOf(deliver.user._id) === -1) {
                        usernearby.push(deliver.user._id);
                      }
                      if (delivertokens.indexOf(deliver.device_token) === -1) {
                        delivertokens.push(deliver.device_token);
                      }
                    }
                  }
                  //delivertokens.push(deliver.device_token);
                });
                req.tokens = delivertokens;
                req.usernearby = usernearby;
                next();
              } else {
                next();
              }
            }
          });
        }

      } else {
        next();
      }
    } else {
      next();
    }

  }
};

exports.create = function (req, res) {
  var order = new Order(req.body);
  // console.log(order);
  if (req.user && req.user.roles[0] === 'admin') {
    order.user = req.usercreate;
  } else {
    order.user = req.user;
  }
  if (req.olddeliver && req.olddeliver !== undefined) {
    order.namedeliver = req.olddeliver;
    order.deliverystatus = 'wait deliver';
  }
  if (req.usernearby && req.usernearby.length > 0) {
    order.usernearby = req.usernearby;
  }
  // console.log(req.usercreate);
  // if (req.user) {
  //   order.user = req.usercreate;
  // }

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
          // sendNewOrder();
          subCreateOrder(orders._id, req.user);
          // if (orders && orders.usernearby.length > 0) {
          //   sendNewdeliverOrder(req.tokens);
          // }
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
  if (order.deliverystatus === 'accept') {
    Order.find({ _id: order._id }).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, orders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (orders.length > 0 && orders[0].deliverystatus === 'accept') {
          return res.status(400).send({
            message: 'order is already accept'
          });
        } else {
          updateOrder(order, req.body.namedeliver, function (err, data) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            res.jsonp(data);
          });
        }
      }
    });
  } else {
    updateOrder(order, req.body.namedeliver, function (err, data) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.jsonp(data);
    });
  }
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
  filter = { deliverystatus: { $ne: 'ap' } };
  //example or { $or:[ {'_id':objId}, {'name':param}, {'nickname':param} ]}


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

exports.confirmed = function (req, res, next) {
  Order.find({ deliverystatus: 'confirmed' }).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, confirmed) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(orders);
      req.confirmed = confirmed;
      next();
    }
  });
};

exports.confirmedNearBy = function (req, res, next) {
  var confirmedNearBies = [];
  // -1 คือไม่มี
  if (req.user && req.user.roles.indexOf('deliver') !== -1) {
    req.confirmed.forEach(function (order) {
      if (order.usernearby && order.usernearby.length > 0) {
        if (order.usernearby.indexOf(req.user._id) !== -1) {
          confirmedNearBies.push(order);
        }
      } else {
        if (req.user.address.sharelocation && order.shipping.sharelocation) {
          // nearByDeliver(req.user.address.sharelocation, order.shipping.sharelocation, function (error, data) {
          //   if (data && data <= 5) {
          //     confirmedNearBies.push(order);
          //   }
          // });
          var dist = getDistanceFromLatLonInKm(req.user.address.sharelocation.latitude, req.user.address.sharelocation.longitude, order.shipping.sharelocation.latitude, order.shipping.sharelocation.longitude);
          if (dist <= minDistance) {
            confirmedNearBies.push(order);
          }
        }
      }
    });
    // confirmedNearBies = array.filter(function (obj) { return obj.user.address.province === shipping.province; });
    req.confirmed = confirmedNearBies;
  }
  next();
};

exports.wait = function (req, res, next) {
  var filter = {};
  if (req.user && req.user.roles.indexOf('deliver') !== -1) {
    filter = {
      'namedeliver': req.user,
      'deliverystatus': 'wait deliver'
    };
  } else {
    filter = {
      'deliverystatus': 'wait deliver'
    };
  }
  Order.find(filter).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, waits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(orders);

      req.wait = waits;
      next();
    }
  });
};

exports.accept = function (req, res, next) {
  var filter = {};
  if (req.user && req.user.roles.indexOf('deliver') !== -1) {
    filter = {
      'namedeliver': req.user,
      'deliverystatus': 'accept'
    };
  } else {
    filter = {
      'deliverystatus': 'accept'
    };
  }
  Order.find(filter).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, accepts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(orders);
      req.accept = accepts;
      next();
    }
  });
};

exports.reject = function (req, res, next) {
  Order.find({ deliverystatus: 'reject' }).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, rejects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(orders);
      req.reject = rejects;
      next();
    }
  });
};

exports.rejectNearBy = function (req, res, next) {
  var rejectNearBies = [];
  if (req.user && req.user.roles.indexOf('deliver') !== -1) {
    req.reject.forEach(function (order) {
      if (order.usernearby && order.usernearby.length > 0) {
        if (order.usernearby.indexOf(req.user._id) !== -1) {
          rejectNearBies.push(order);
        }
      } else {
        if (req.user.address.sharelocation && order.shipping.sharelocation) {
          var dist = getDistanceFromLatLonInKm(req.user.address.sharelocation.latitude, req.user.address.sharelocation.longitude, order.shipping.sharelocation.latitude, order.shipping.sharelocation.longitude);
          if (dist <= minDistance) {
            rejectNearBies.push(order);
          }
        }
      }
    });
    req.reject = rejectNearBies;
  }
  next();
};

exports.complete = function (req, res, next) {
  var filter = {};
  if (req.user && req.user.roles.indexOf('deliver') !== -1) {
    filter = {
      'namedeliver': req.user,
      'deliverystatus': 'complete'
    };
  } else {
    filter = {
      'deliverystatus': 'complete'
    };
  }
  Order.find(filter).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, completes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(orders);
      req.complete = completes;
      next();
    }
  });
};
exports.complete2 = function (req, res, next) {
  var filter = {};
  if (req.user && req.user.roles.indexOf('deliver') !== -1) {
    filter = {
      'namedeliver': req.user,
      'deliverystatus': 'complete',
      'user': req.user
    };
  } else {
    filter = {
      'deliverystatus': 'complete'
    };
  }
  Order.find(filter).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, completes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(orders);
      req.complete = completes;
      next();
    }
  });
};

exports.cancel = function (req, res, next) {
  if (req.user && req.user.roles.indexOf('deliver') !== -1) {
    req.cancel = [];
    next();
  } else {
    Order.find({ deliverystatus: 'cancel' }).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, cancels) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(orders);
        req.cancel = cancels;
        next();
      }
    });
  }
};


exports.listorderv2 = function (req, res) {
  res.jsonp({
    confirmed: req.confirmed,
    wait: req.wait,
    accept: req.accept,
    reject: req.reject,
    complete: req.complete,
    cancel: req.cancel
  });
};

exports.lng = function (req, res, next, lng) {
  var lat = req.lat;
  req.lng = lng;
  next();
};

exports.checkNearBy = function (req, res, next) {
  var confirmed = [];
  var wait = [];
  var accept = [];
  var reject = [];
  req.nearConfirmed = [];
  req.confirmed.forEach(function (dataconf) {
    if (req.lat && req.lng && dataconf.shipping.sharelocation) {
      var dist = getDistanceFromLatLonInKm(req.lat, req.lng, dataconf.shipping.sharelocation.latitude, dataconf.shipping.sharelocation.longitude);
      if (dist <= minDistance) {
        confirmed.push(dataconf);
      }
    }
  });
  req.nearConfirmed = confirmed;

  req.wait.forEach(function (datawait) {
    if (datawait.shipping && datawait.shipping.sharelocation) {
      wait.push(datawait);
    }
  });
  req.wait = wait;

  req.accept.forEach(function (dataact) {
    if (dataact.shipping && dataact.shipping.sharelocation) {
      accept.push(dataact);
    }
  });
  req.accept = accept;

  req.reject.forEach(function (datarej) {
    if (req.lat && req.lng && datarej.shipping.sharelocation) {
      var dist2 = getDistanceFromLatLonInKm(req.lat, req.lng, datarej.shipping.sharelocation.latitude, datarej.shipping.sharelocation.longitude);
      if (dist2 <= minDistance) {
        reject.push(datarej);
      }
    }
  });
  req.nearReject = reject;
  next();
};

exports.listorderv3 = function (req, res) {
  res.jsonp({
    confirmed: req.nearConfirmed,
    wait: req.wait,
    accept: req.accept,
    reject: req.nearReject,
    lat: req.lat,
    lng: req.lng
  });
};
exports.listorderweb = function (req, res) {
  res.jsonp([{
    confirmed: req.confirmed,
    wait: req.wait,
    accept: req.accept,
    reject: req.reject,
    complete: req.complete,
    cancel: req.cancel
  }]);
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

exports.findinvestor = function (req, res, next) {
  var users = [];
  Order.find({ $and: [{ src: { $ne: 'ios' } }, { src: { $ne: 'android' } }, { src: { $ne: 'web' } }] }).sort('-created').populate('user').populate('items.product').populate('namedeliver').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var datas = orders.filter(function (obj) { return obj.docno.length > 13; });
      req.findinvestororder = datas;
      datas.forEach(function (order) {
        if (order.user && order.user._id) {
          var user_id = order.user._id;
          if (users.indexOf(user_id) === -1) {
            users.push(user_id);
          }
        }
      });
      req.isinvestor = users;
      next();
    }
  });
};
exports.updateusertoinvestor = function (req, res, next) {
  // console.log(req.isinvestor);
  // var users = req.findinvestororder.filter(function (obj) { return obj.user; });
  User.update({ _id: { '$in': req.isinvestor } }, { isinvestor: true }, { multi: true }, function (err, docs) {
    next();
  });
};




exports.updateinvestor = function (req, res) {
  res.jsonp({ orders: req.findinvestororder, isinvestor: req.isinvestor });
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


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function sendNewdeliverOrder(tokens) {
  // Pushnotiuser.find().sort('-created').where('role').equals('deliver').populate('user').exec(function (err, delivers) {
  //   if (err) {

  //   } else {
  //     var delivertokens = [];
  //     // var delivertokens2 = [];
  //     // var delivertokensOther = [];
  //     delivers.forEach(function (deliver) {

  //       //console.log(deliver.user.address);
  //       if (order_location && deliver.user && deliver.user.address && deliver.user.address.sharelocation) {
  //         var dist = getDistanceFromLatLonInKm(order_location.latitude, order_location.longitude, deliver.user.address.sharelocation.latitude, deliver.user.address.sharelocation.longitude);
  //         //console.log('------------- ' + dist + ' km. -------------')
  //         if (dist <= minDistance) {
  //           delivertokens.push(deliver.device_token);
  //         }
  //       }
  //       //delivertokens.push(deliver.device_token);
  //     });
  //     // console.log(delivertokens);
  //     // if (delivertokens.length === 0) {
  //     //   delivertokens2 = checkNotiUser(delivers, shipping);
  //     //   if (delivertokens2.data.length > 0) {
  //     //     delivertokens2.data.forEach(function (deliver) {
  //     //       delivertokensOther.push(deliver.device_token);
  //     //     });
  //     //   }
  //     // }
  //     // var sendTokens = delivertokens.length > 0 ? delivertokens : delivertokensOther;
  //     // var detailTokens = delivertokens.length > 0 ? 'คุณมีรายการสั่งซื้อข้าวใหม่ ในรัศมี ' + minDistance + ' กม.' : delivertokens2.notiMessage;

  //   }
  // });
  request({
    url: pushNotiUrl,
    auth: {
      'bearer': pushNotiAuthenDEL.auth
    },
    method: 'POST',
    json: {
      tokens: tokens,
      profile: pushNotiAuthenDEL.profile,
      notification: {
        message: 'คุณมีรายการสั่งซื้อข้าวใหม่',
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

function checkNotiUser(delivers, shipping) {
  var array = [];
  delivers.forEach(function (deliver) {
    if (deliver.user && deliver.user.address) {
      array.push(deliver);
    }
  });
  if (array.length > 0) {
    var postcodes = array.filter(function (obj) {
      var postcode = obj.user.address;
      return postcode.postcode === shipping.postcode;
    });
    if (postcodes.length > 0) {
      return {
        data: postcodes,
        notiMessage: 'คุณมีรายการสั่งซื้อข้าวใหม่ในเขตรหัสไปรษณีย์ของคุณ'
      };
    } else {
      var district = array.filter(function (obj) {
        var dis = obj.user.address;
        return dis.district === shipping.district;
      });
      if (district.length > 0) {
        return {
          data: district,
          notiMessage: 'คุณมีรายการสั่งซื้อข้าวใหม่ในเขตอำเภอของคุณ'
        };
      } else {
        var province = array.filter(function (obj) {
          var pro = obj.user.address;
          return pro.province === shipping.province;
        });
        return {
          data: province,
          notiMessage: 'คุณมีรายการสั่งซื้อข้าวใหม่ในเขตจังหวัดของคุณ'
        };
      }
    }
  }
}

function sendAcceptedDeliverOrder(order, deliver) {
  Pushnotiuser.find({ user_id: { $ne: order.namedeliver } }).sort('-created').where('role').equals('deliver').exec(function (err, delivers) {
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
            message: deliver.displayName + ' รับงานเลขที่ ' + order.docno
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

function sendNewDeliver(deliver) {
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
              //console.log(admtokens);
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
                    message: 'คุณมีรายการค้างส่งข้าว ' + orders.length + ' รายการ',
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
              //console.log(admtokens);
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

function updateOrder(order, deliver, callback) {
  // var _order = order;
  order.save(function (err) {
    if (err) {
      callback(err, null);
      // return res.status(400).send({
      //   message: errorHandler.getErrorMessage(err)
      // });
    } else {
      if (order.deliverystatus === 'wait deliver') {
        sendNewOrder();
        sendNewDeliver(order.namedeliver);
        sendWaitDeliUser(order);
      } else if (order.deliverystatus === 'accept') {
        sendNewOrder();
        sendAcceptedDeliverOrder(order, deliver);
        sendNewDeliver(order.namedeliver);
        sendAcceptUser(order);
      } else if (order.deliverystatus === 'reject') {
        //sendNewOrder();
        //sendNewDeliver(order.namedeliver);
      } else if (order.deliverystatus === 'complete') {
        sendCompleteDeliver(order.namedeliver);
        sendCompleteUser(order);
      }
      callback(null, order);
      //res.jsonp(order);
    }
  });
}

function subCreateOrder(orderId, user) {
  // var urlSubServer = 'https://thamapptest-sub.herokuapp.com/api/suborders/' + orderId; //test
  var urlSubServer = 'https://thamapp-sub.herokuapp.com/api/suborders/' + orderId; //prod
  request({
    url: urlSubServer,
    method: 'POST',
    body: user,
    json: true
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
