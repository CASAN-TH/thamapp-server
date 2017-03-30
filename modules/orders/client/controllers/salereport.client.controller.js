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
        // console.log(response);
        if (response.orders.length === 0) {
          alert('ไม่พบข้อมูล');
        }
        vm.listOrders = response.orders;
        vm.saleday = response.saleday;
        vm.saleprod = response.saleprod;
        vm.max = 0;
        vm.min = 0;
        vm.avg = 0;
        if (response.avg.length > 0) {
          vm.max = response.avg[0].max.max;
          vm.min = response.avg[0].min.min;
          vm.avg = response.avg[0].avg;
        }
        var percens = [];
        var countpercen = 0;
        var other = {
          text: 'other',
          values: []
        };
        response.percens.forEach(function (percen) {
          var dataPercen = {
            values: []
          };
          other = {
            text: 'other',
            values: []
          };
          if (percen.percen < 20) {
            other.values = [];
            countpercen += percen.percen;
            other.values.push(countpercen);
          } else {
            dataPercen.text = percen.product.item.product.name;
            dataPercen.values.push(percen.percen);
          }
          if (dataPercen.text) {
            percens.push(dataPercen);
          }
        });
        percens.push(other);
        var labels = [];
        if (vm.saleday.length > 0) {
          vm.saleday.forEach(function (res) {
            var data = {};
            data.date = res.date.substr(6, 2);
            data.sales = res.amount;
            data.average = response.avg[0].avg.toFixed(2);
            // $scope.titles.push(res.date);
            // $scope.saleOfDays.push(res.amount);
            // $scope.averages.push(parseInt(response.avg[0].avg));
            allAmount.push(data);
          });
        } else {
          allAmount = [];
        }
        // console.log('titles : ' + $scope.titles);
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
            }, date: {
              axis: 'x',
              label: true
            }
          }
        };
        $scope.instance = null;
        $scope.myJson = {
          globals: {
            shadow: false,
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
              text: '%npv%',
              fontSize: '15px',
              textAlpha: 1,
            }
          },
          series: percens
        };
        // /////////////
        // $scope.chartOptions = {
        //   size: {
        //     width: 500
        //   },
        //   palette: 'bright',
        //   dataSource: percens,
        //   series: [
        //     {
        //       argumentField: 'text',
        //       valueField: 'values'
        //       // label: {
        //       //   visible: true,
        //       //   connector: {
        //       //     visible: true,
        //       //     width: 1
        //       //   }
        //       // }
        //     }
        //   ],
        //   // title: 'สรุปยอดการขายรายสินค้า',
        //   tooltip: {
        //     enabled: true,
        //     // format: 'currency',
        //     customizeTooltip: function () {
        //       return { text: this.argumentText + '<br>' + this.valueText + ' %' };
        //     }
        //   }
        //   // ,
        //   // onPointClick: function (e) {
        //   //   var point = e.target;

        //   //   toggleVisibility(point);
        //   // },
        //   // onLegendClick: function (e) {
        //   //   var arg = e.target;

        //   //   toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
        //   // }
        // };

        // // function toggleVisibility(item) {
        // //   if (item.isVisible()) {
        // //     item.hide();
        // //   } else {
        // //     item.show();
        // //   }
        // // }
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


    // filter date
    $scope.sendDate = function (itm) {
      // console.log(itm);
      $scope.itmSearchprod = '';
      $scope.totalAmountResult = 0;

      $scope.itmSearch = itm.substr(0, 4) + '-' + itm.substr(4, 2) + '-' + itm.substr(6, 2);
      $scope.calFilterdate(itm);
    };
    $scope.calFilterdate = function (itm) {
      $scope.totalAmountResultdate = 0;
      var filterOrders = [];

      vm.listOrders.forEach(function (order) {
        var date = new Date(order.created);
        var dd = itm.substr(6, 2);
        var MM = itm.substr(4, 2);
        var yyyy = itm.substr(0, 4);
        var day = date.getDate();
        if (day <= 9) {

          day = '0' + day;
        }
        var month = date.getMonth() + 1;
        if (month > 9) {
        } else {
          month = '0' + month;
        }
        var year = date.getFullYear();
        if (yyyy.toString() === year.toString()) {
          if (MM.toString() === month.toString()) {
            if (dd.toString() === day.toString()) {
              filterOrders.push(order);
            }
          }
        }
      });
      filterOrders.forEach(function (forder) {
        // console.log(forder);
        forder.items.forEach(function (itm) {
          $scope.totalAmountResultdate += (itm.product.retailerprice || 0) * (itm.qty || 0);
        });
      });
    };

    // filter  product
    $scope.sendprod = function (itm) {
      $scope.itmSearchprod = itm;
      $scope.itmSearch = '';
      $scope.totalAmountResultdate = 0;
      $scope.calFilter($scope.itmSearchprod);
    };

    $scope.calFilter = function (nameprod) {
      $scope.totalAmountResult = 0;
      $scope.filterOrdersreport = [];
      vm.listOrders.forEach(function (order) {
        order.items.forEach(function (itm) {
          if (itm.product.name === nameprod) {
            $scope.filterOrdersreport.push({
              docno: order.docno,
              items: {
                product: {
                  name: itm.product.name,
                  retailerprice: itm.product.retailerprice
                },
                qty: itm.qty
              }
            });
          }
        });
      });
      $scope.filterOrdersreport.forEach(function (forder) {
        $scope.totalAmountResult += (forder.items.product.retailerprice || 0) * (forder.items.qty || 0);
      });
    };

    $scope.hidediv = false;
    $scope.showdiv = false;
    $scope.hidedate = function (days) {
      $scope.dayTime = days.substr(6, 2) + '/' + days.substr(4, 2) + '/' + days.substr(0, 4);
      // $scope.dayTime = days;
      $scope.showdiv = true;
      $scope.hidediv = true;
    };
    $scope.hidesearch = function () {
      $scope.hidediv = false;
      $scope.showdiv = false;
    };
    $scope.hideprod = function () {
      $scope.showdiv = false;
      $scope.hidediv = true;
    };

    $scope.showname = function () {
      $scope.shownameprod = true;
      $scope.hidediv = true;
      $scope.showdiv = false;
    };

    $scope.sendNull = function () {
      $scope.itmSearchprod = '';
      $scope.itmSearch = '';
      $scope.totalAmountResultdate = '';
      $scope.totalAmountResult = '';
      $scope.showdiv = false;
      $scope.hidediv = false;
    };
  }
})();
