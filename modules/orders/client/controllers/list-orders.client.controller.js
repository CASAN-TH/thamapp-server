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
    vm.confirmedOrders = [];
    vm.pendingOrders = [];
    vm.paidOrders = [];
    vm.sentOrders = [];
    vm.completeOrders = [];
    vm.closeOrders = [];

    function statusConfirmed() {
      vm.orders = OrdersService.query(function () {
        angular.forEach(vm.orders, function (order) {
          if (order.deliverystatus === 'confirmed')
            vm.confirmedOrders.push(order);
        });
      });
    }

    function statusPending() {
      vm.orders = OrdersService.query(function () {
        angular.forEach(vm.orders, function (order) {
          if (order.deliverystatus === 'pending')
            vm.pendingOrders.push(order);
        });
      });
    }

    function statusPaid() {
      vm.orders = OrdersService.query(function () {
        angular.forEach(vm.orders, function (order) {
          if (order.deliverystatus === 'paid')
            vm.paidOrders.push(order);
        });
      });
    }

    function statusSent() {
      vm.orders = OrdersService.query(function () {
        angular.forEach(vm.orders, function (order) {
          if (order.deliverystatus === 'sent')
            vm.sentOrders.push(order);
        });
      });
    }

    function statusComplete() {
      vm.orders = OrdersService.query(function () {
        angular.forEach(vm.orders, function (order) {
          if (order.deliverystatus === 'complete')
            vm.completeOrders.push(order);
        });
      });
    }

    function statusClose() {
      vm.orders = OrdersService.query(function () {
        angular.forEach(vm.orders, function (order) {
          if (order.deliverystatus === 'close')
            vm.closeOrders.push(order);
        });
      });
    }

    function init() {
      vm.statusConfirmed();
      vm.statusPending();
      vm.statusPaid();
      vm.statusSent();
      vm.statusComplete();
      vm.statusClose();
    }
  }
} ());
