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
    // Me controller logic
    // ...
    init();

    function init() {
    }
    $scope.click = function (num) {
      vm.tabname = num;
    };

  }
})();
