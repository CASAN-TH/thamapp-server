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
    $scope.titles = [];
    $scope.saleOfDays = [];
    $scope.averages = [];
    $scope.titleObj = {};
    var allAmount = [];
    var lastweek = new Date();
    $scope.startDay = new Date(lastweek.getFullYear(), lastweek.getMonth(), lastweek.getDate() - 29);
    $scope.endDay = new Date();

    vm.getDay = function (startDay, endDay) {
      $scope.titles = [];
      $scope.saleOfDays = [];
      $scope.averages = [];
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
          $scope.titles.push(res.date);
          $scope.saleOfDays.push(res.amount);
          $scope.averages.push(parseInt(response.avg[0].avg));
        });
        // console.log('saleOfday : ' + $scope.saleOfDays);
        // console.log('averages : ' + $scope.averages);
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

          // legend: {
          //   layout: 'x1',
          //   position: 'right',
          //   borderColor: 'transparent',
          //   marker: {
          //     borderRadius: 10,
          //     borderColor: 'transparent'
          //   }
          // },
          tooltip: {
            text: '%t'
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
        // /////////////
        $scope.chartOptions = {
          size: {
            width: 500
          },
          palette: 'bright',
          dataSource: percens,
          series: [
            {
              argumentField: 'text',
              valueField: 'values',
              label: {
                visible: true,
                connector: {
                  visible: true,
                  width: 1
                }
              }
            }
          ],
          // title: 'สรุปยอดการขายรายสินค้า',
          tooltip: {
            enabled: true,
            // format: 'currency',
            customizeTooltip: function () {
              return { text: this.argumentText + '<br>' + this.valueText + '%' };
            }
          }
          // ,
          // onPointClick: function (e) {
          //   var point = e.target;

          //   toggleVisibility(point);
          // },
          // onLegendClick: function (e) {
          //   var arg = e.target;

          //   toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
          // }
        };

        // function toggleVisibility(item) {
        //   if (item.isVisible()) {
        //     item.hide();
        //   } else {
        //     item.show();
        //   }
        // }
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
