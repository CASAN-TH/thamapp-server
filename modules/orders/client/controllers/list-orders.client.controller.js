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

    vm.confirmed = function (item) {
      return item.deliverystatus === 'confirmed' || item.deliverystatus === 'wait deliver';
    };
  }
}());
