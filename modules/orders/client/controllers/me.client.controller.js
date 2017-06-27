(function () {
  'use strict';

  angular
    .module('orders')
    .controller('MeController', MeController);

  MeController.$inject = ['$scope', 'Authentication', 'OrdersService', '$http'];

  function MeController($scope, Authentication, OrdersService, $http) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.tabname = '1';
    $scope.allQty = 0;
    // vm.history = OrdersService.query();
    vm.cancelOrder = cancelOrder;
    // Me controller logic


    $http.get('/api/orders').success(function (response) {
      vm.history = response;
      // console.log(vm.history);
    }).error(function (err) {
      console.log(err);
    });
    // ...
    init();

    function init() {
    }
    $scope.click = function (num) {
      vm.tabname = num;
    };

    function cancelOrder(item) {
      if (item.deliverystatus === 'confirmed' || item.deliverystatus === 'wait deliver') {
        item.deliverystatus = 'cancel';
        var historystatus = {
          status: 'cancel',
          datestatus: new Date()
        };
        item.historystatus.push(historystatus);

      }
      var itm = new OrdersService(item);
      itm.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

  }
})();
