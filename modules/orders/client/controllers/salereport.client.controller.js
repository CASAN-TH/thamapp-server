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
    var allAmount = [];
    var lastweek = new Date();
    $scope.startDay = new Date(lastweek.getFullYear(), lastweek.getMonth(), lastweek.getDate() - 29);
    $scope.endDay = new Date();

    vm.getDay = function (startDay, endDay) {
      allAmount = [];
      $http.get('api/salereports/' + startDay + '/' + endDay).success(function (response) {
        vm.listOrders = response.orders;
        vm.saleday = response.saleday;
        vm.saleprod = response.saleprod;
        vm.max = response.avg[0].max.max;
        vm.min = response.avg[0].min.min;
        vm.avg = response.avg[0].avg;
        var percens = [];
        response.percens.forEach(function (percen) {
          var dataPercen = {
            values: []
          };
          dataPercen.text = percen.product.item.product.name;
          dataPercen.values.push(parseInt(percen.percen));
          percens.push(dataPercen);
        });
        var labels = [];
        vm.saleday.forEach(function (res) {
          var data = {};
          data.sales = res.amount;
          data.average = (parseInt(response.avg[0].avg));
          data.date = res.date;
          allAmount.push(data);
        });
        $scope.options = {
          data: allAmount,
          dimensions: {
            sales: {
              axis: 'y',
              type: 'spline'
            }, average: {
              axis: 'y',
              type: 'spline'
            }
          }
        };
        $scope.instance = null;
        $scope.myJson = {
          globals: {
            shadow: true,
            fontFamily: 'Verdana',
            fontWeight: '100'
          },
          type: 'pie',
          backgroundColor: '#fff',
          tooltip: {
            text: '%v % %t'
          },
          plot: {
            refAngle: '-90',
            borderWidth: '0px',
            valueBox: {
              placement: 'in',
              text: '%npv  %',
              fontSize: '15px',
              textAlpha: 1,
            }
          },
          series: percens
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
