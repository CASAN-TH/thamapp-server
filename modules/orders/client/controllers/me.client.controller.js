(function () {
  'use strict';

  angular
    .module('orders')
    .controller('MeController', MeController);

  MeController.$inject = ['$scope', 'Authentication', 'OrdersService'];

  function MeController($scope, Authentication, OrdersService) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.tabname = '1';
    $scope.allQty = 0;
    vm.history = OrdersService.query();
    vm.cancelOrder = cancelOrder;
    // Me controller logic
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
          status:'cancel',
          datestatus: new Date()
        };
        item.historystatus.push(historystatus);

      }
      item.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

  }
})();
