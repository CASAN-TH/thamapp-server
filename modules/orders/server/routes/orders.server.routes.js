'use strict';

/**
 * Module dependencies
 */
var ordersPolicy = require('../policies/orders.server.policy'),
  orders = require('../controllers/orders.server.controller');
var users = require('../../../users/server/controllers/users.server.controller');


module.exports = function (app) {
  // Orders Routes
  app.route('/api/orders')//.all(ordersPolicy.isAllowed)
    .get(ordersPolicy.isAllowed, orders.list)
    // .get(ordersPolicy.isAllowed, orders.confirmed, orders.confirmedNearBy, orders.wait, orders.accept, orders.reject, orders.rejectNearBy, orders.complete, orders.cancel, orders.listorderv2)
    // .post(users.requiresLoginToken, ordersPolicy.isAllowed, orders.adminCreate, orders.findOldDeliver, orders.nearByKm, orders.nearByPostCode, orders.nearByDistrict, orders.create);
    .post(users.requiresLoginToken, ordersPolicy.isAllowed, orders.create);

  app.route('/api/listorder')//.all(ordersPolicy.isAllowed)
    .get(ordersPolicy.isAllowed, orders.listorder);

  app.route('/api/listorder/v2')//.all(ordersPolicy.isAllowed)
    .get(ordersPolicy.isAllowed, orders.confirmed, orders.confirmedNearBy, orders.wait, orders.accept, orders.reject, orders.rejectNearBy, orders.complete2, orders.cancel, orders.listorderv2);

  app.route('/api/listorder/v3/:lat/:lng')//.all(ordersPolicy.isAllowed)
    .get(ordersPolicy.isAllowed, orders.confirmed, orders.wait, orders.accept, orders.reject, orders.checkNearBy, orders.listorderv3);

  app.route('/api/listorder/web')//.all(ordersPolicy.isAllowed)
    .get(ordersPolicy.isAllowed, orders.confirmed, orders.confirmedNearBy, orders.wait, orders.accept, orders.reject, orders.rejectNearBy, orders.complete, orders.cancel, orders.listorderweb)
    // .post(users.requiresLoginToken, ordersPolicy.isAllowed, orders.adminCreate, orders.findOldDeliver, orders.nearByKm, orders.nearByPostCode, orders.nearByDistrict, orders.create);
    .post(users.requiresLoginToken, ordersPolicy.isAllowed, orders.create);
  // หลังจาก adminCreate = > orders.checkDeliver, orders.findOldDeliver
  app.route('/api/listorder/web/:orderId')//.all(ordersPolicy.isAllowed)
    .get(ordersPolicy.isAllowed, orders.read)
    .put(users.requiresLoginToken, ordersPolicy.isAllowed, orders.update)
    .delete(users.requiresLoginToken, ordersPolicy.isAllowed, orders.delete);

  app.route('/api/orders/:orderId')//.all(ordersPolicy.isAllowed)
    .get(ordersPolicy.isAllowed, orders.read)
    .put(users.requiresLoginToken, ordersPolicy.isAllowed, orders.update)
    .delete(users.requiresLoginToken, ordersPolicy.isAllowed, orders.delete);

  app.route('/api/salereports/:startdate/:enddate')//.all(ordersPolicy.isAllowed)
    .get(orders.salereport);

  app.route('/api/checkPostcode/:postcode')//.all(ordersPolicy.isAllowed)
    .get(orders.resultpostcode);

  app.route('/api/updateinvestors')//.all(ordersPolicy.isAllowed)
    .get(ordersPolicy.isAllowed, orders.findinvestor, orders.updateusertoinvestor, orders.updateinvestor);

  app.route('/api/orderbridge')//.all(ordersPolicy.isAllowed)
    .post(orders.cookingBridge, orders.createBridge);

  // Finish by binding the Order middleware
  app.param('postcode', orders.postcode);
  app.param('orderId', orders.orderByID);
  app.param('startdate', function (req, res, next, startdate) {
    req.startdate = startdate;
    next();
  });
  app.param('lat', function (req, res, next, lat) {
    req.lat = lat;
    next();
  });
  app.param('enddate', orders.startdate);
  app.param('lng', orders.lng);
};
