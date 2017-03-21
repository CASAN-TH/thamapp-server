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
        vm.saleday = response.saleday;
        vm.saleprod = response.saleprod;
        var labels = [];
        var data = [];
        vm.saleday.forEach(function (res) {
          labels.push(res.date);
          data.push(res.amount);
        });
        $scope.labels = labels;
        $scope.series = ['Series A'];
        $scope.data = data;
        $scope.onClick = function (points, evt) {
          console.log(points, evt);
        };
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
        $scope.options = {
          scales: {
            yAxes: [
              {
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left'
              }
            ]
          }
        };
      }).error(function (err) {
        console.log(err);
      });
    };

    vm.getDay($scope.startDay, $scope.endDay);

    vm.sumallamount = function () {
      var result = 0;
      vm.listOrders.forEach(function (order) {
        order.items.forEach(function (itm) {
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

  }
})();
