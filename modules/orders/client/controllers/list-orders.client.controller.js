(function () {
  'use strict';

  angular
    .module('orders')
    .controller('OrdersListController', OrdersListController);

  OrdersListController.$inject = ['OrdersService', 'Authentication'];

  function OrdersListController(OrdersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.orders = OrdersService.query();
    vm.init = init;
    vm.statusConfirmed = statusConfirmed;
    vm.statusPending = statusPending;
    vm.statusPaid = statusPaid;
    vm.statusSent = statusSent;
    vm.statusComplete = statusComplete;
    vm.statusClose = statusClose;
    vm.readReject = readReject;
    vm.readAccept = readAccept;
    vm.statusCancel = statusCancel;
    vm.confirmedOrders = [];
    vm.confirmedPost = [];
    vm.confirmedDeli = [];
    vm.pendingOrders = [];
    vm.pendingPost = [];
    vm.pendingDeli = [];
    vm.paidOrders = [];
    vm.paidPost = [];
    vm.paidDeli = [];
    vm.sentOrders = [];
    vm.sentPost = [];
    vm.sentDeli = [];
    vm.completeOrders = [];
    vm.completePost = [];
    vm.completeDeli = [];
    vm.closeOrders = [];
    vm.closePost = [];
    vm.closeDeli = [];
    vm.acceptDeli = [];
    vm.rejectDeli = [];
    vm.cancelOrders = [];
    vm.cancelPost = [];
    vm.cancelDeli = [];

    function init() {
      vm.statusConfirmed();
      vm.statusPending();
      vm.statusPaid();
      vm.statusSent();
      vm.statusComplete();
      vm.statusClose();
      vm.readReject();
      vm.readAccept();
      vm.statusCancel();
    }

    function statusConfirmed() {
      vm.listConfirmed = OrdersService.query(function () {
        angular.forEach(vm.listConfirmed, function (order) {
          if (order.deliverystatus === 'confirmed') {
            vm.confirmedOrders.push(order);
          }
          if (order.delivery.deliveryid === '1' && order.deliverystatus === 'confirmed') {
            vm.confirmedPost.push(order);
          } else if (order.delivery.deliveryid === '0' && order.deliverystatus === 'confirmed' || order.deliverystatus === 'wait deliver') {
            vm.confirmedDeli.push(order);
          }
        });
      });
    }

    function statusPending() {
      vm.listPending = OrdersService.query(function () {
        angular.forEach(vm.listPending, function (order) {
          if (order.deliverystatus === 'pending') {
            vm.pendingOrders.push(order);
          }
          if (order.delivery.deliveryid === '1' && order.deliverystatus === 'pending') {
            vm.pendingPost.push(order);
          } else if (order.delivery.deliveryid === '0' && order.deliverystatus === 'pending') {
            vm.pendingDeli.push(order);
          }
        });
      });
    }

    function statusPaid() {
      vm.listPaid = OrdersService.query(function () {
        angular.forEach(vm.listPaid, function (order) {
          if (order.deliverystatus === 'paid') {
            vm.paidOrders.push(order);
          }
          if (order.delivery.deliveryid === '1' && order.deliverystatus === 'paid') {
            vm.paidPost.push(order);
          } else if (order.delivery.deliveryid === '0' && order.deliverystatus === 'paid') {
            vm.paidDeli.push(order);
          }
        });
      });
    }

    function statusSent() {
      vm.listSent = OrdersService.query(function () {
        angular.forEach(vm.listSent, function (order) {
          if (order.deliverystatus === 'sent') {
            vm.sentOrders.push(order);
          }
          if (order.delivery.deliveryid === '1' && order.deliverystatus === 'sent') {
            vm.sentPost.push(order);
          } else if (order.delivery.deliveryid === '0' && order.deliverystatus === 'sent') {
            vm.sentDeli.push(order);
          }
        });
      });
    }

    function statusComplete() {
      vm.listComplete = OrdersService.query(function () {
        angular.forEach(vm.listComplete, function (order) {
          if (order.deliverystatus === 'complete') {
            vm.completeOrders.push(order);
          }
          if (order.delivery.deliveryid === '1' && order.deliverystatus === 'complete') {
            vm.completePost.push(order);
          } else if (order.delivery.deliveryid === '0' && order.deliverystatus === 'complete') {
            vm.completeDeli.push(order);
          }
        });
      });
    }

    function statusClose() {
      vm.listClose = OrdersService.query(function () {
        angular.forEach(vm.listClose, function (order) {
          if (order.deliverystatus === 'close') {
            vm.closeOrders.push(order);
          }
          if (order.delivery.deliveryid === '1' && order.deliverystatus === 'close') {
            vm.closePost.push(order);
          } else if (order.delivery.deliveryid === '0' && order.deliverystatus === 'close') {
            vm.closeDeli.push(order);
          }
        });
      });
    }

    function statusCancel() {
      vm.listCancel = OrdersService.query(function () {
        angular.forEach(vm.listCancel, function (order) {
          if (order.deliverystatus === 'cancel') {
            vm.cancelOrders.push(order);
          }
          if (order.delivery.deliveryid === '1' && order.deliverystatus === 'cancel') {
            vm.cancelPost.push(order);
          } else if (order.delivery.deliveryid === '0' && order.deliverystatus === 'cancel') {
            vm.cancelDeli.push(order);
          }
        });
      });
    }

    function readAccept() {
      vm.listAccept = OrdersService.query(function () {
        angular.forEach(vm.listAccept, function (order) {
          if (order.delivery.deliveryid === '0' && order.deliverystatus === 'accept') {
            vm.acceptDeli.push(order);
          }
        });
      });
    }

    function readReject() {
      vm.listReject = OrdersService.query(function () {
        angular.forEach(vm.listReject, function (order) {
          if (order.delivery.deliveryid === '0' && order.deliverystatus === 'reject') {
            vm.rejectDeli.push(order);
          }
        });
      });
    }
  }
} ());
