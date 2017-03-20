(function () {
  'use strict';

  angular
    .module('orders')
    .controller('SalereportController', SalereportController);

  SalereportController.$inject = ['$scope', '$http', 'OrdersService', 'Authentication'];

  function SalereportController($scope, $http, OrdersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    // vm.orders = OrdersService.query();
    var lastweek = new Date();
    $scope.startDay = new Date(lastweek.getFullYear(), lastweek.getMonth(), lastweek.getDate() - 6);
    $scope.endDay = new Date();
    $http.get('api/salereports/' + $scope.startDay + '/' + $scope.endDay).success(function (response) {
      vm.orders = response.orders;
    }).error(function (err) {
      console.log(err);
    });

    vm.getDay = function (startDay, endDay) {
      console.log(startDay + ':' + endDay);
      $http.get('api/salereports/' + startDay + '/' + endDay).success(function (response) {
        vm.orders = response.orders;
      }).error(function (err) {
        console.log(err);
      });
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
        result += (itm.deliverycost || 0);
      });
      return result;
    };
    vm.getsumall = function (order) {
      var result = 0;
      order.items.forEach(function (itm) {
        result += ((itm.product.retailerprice || 0) * (itm.qty || 0)) + (itm.deliverycost || 0);
      });
      return result;
    };
  }
})();
