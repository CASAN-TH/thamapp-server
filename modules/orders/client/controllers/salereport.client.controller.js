(function () {
  'use strict';

  angular
    .module('orders')
    .controller('SalereportController', SalereportController);

  SalereportController.$inject = ['$scope', '$http', 'OrdersService', 'Authentication'];

  function SalereportController($scope, $http, OrdersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.listOrders = [];
    var lastweek = new Date();
    $scope.startDay = new Date(lastweek.getFullYear(), lastweek.getMonth(), lastweek.getDate() - 6);
    $scope.endDay = new Date();

    vm.getDay = function (startDay, endDay) {
      $http.get('api/salereports/' + startDay + '/' + endDay).success(function (response) {
        vm.listOrders = response.orders;
      }).error(function (err) {
        console.log(err);
      });
    };
    
    vm.getDay($scope.startDay, $scope.endDay);

    vm.sumalltotal = function () {
      var result = 0;
      vm.listOrders.forEach(function(order){
        order.items.forEach(function(itm){
          result += ((((itm.price || 0) * (itm.qty || 0)) - ((itm.product.retailerprice || 0) * (itm.qty || 0))) + (itm.deliverycost || 0)) + (itm.product.retailerprice || 0) * (itm.qty || 0);
        });
      });
      return result;
    };

    vm.sumalldelicost = function () {
      var result = 0;
      vm.listOrders.forEach(function(order){
        order.items.forEach(function(itm){
          result += (((itm.price || 0) * (itm.qty || 0)) - ((itm.product.retailerprice || 0) * (itm.qty || 0))) + (itm.deliverycost || 0);
        });
      });
      return result;
    };

    vm.sumallamount = function () {
      var result = 0;
      vm.listOrders.forEach(function(order){
        order.items.forEach(function(itm){
          result += (itm.product.retailerprice || 0) * (itm.qty || 0);
        });
      });
      return result;
    };    

    vm.getsumamount = function (order) {
      var result = 0;
      order.items.forEach(function (itm) {
        result += (itm.product.retailerprice || 0) * (itm.qty || 0);
      });
      return result;
    };

    vm.getsumcost = function (order) {
      var result = 0;
      order.items.forEach(function (itm) {
        result += (((itm.price || 0) * (itm.qty || 0)) - ((itm.product.retailerprice || 0) * (itm.qty || 0))) + (itm.deliverycost || 0);
      });
      return result;
    };

    vm.getsumall = function (order) {
      var result = 0;
      order.items.forEach(function (itm) {
        result += ((((itm.price || 0) * (itm.qty || 0)) - ((itm.product.retailerprice || 0) * (itm.qty || 0))) + (itm.deliverycost || 0)) + (itm.product.retailerprice || 0) * (itm.qty || 0);
      });
      return result;
    };
  }
})();
