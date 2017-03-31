(function () {
  'use strict';

  angular
    .module('payments')
    .controller('LedgerreportController', LedgerreportController);

  LedgerreportController.$inject = ['$scope', '$http', 'PaymentsService', 'Authentication'];

  function LedgerreportController($scope, $http, PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.listpayment = [];
    $scope.testday = new Date();

    $scope.endDay = new Date();
    var lastweek = new Date();
    // var getendMonth = $scope.endDay.getMonth()+1;
    // var getendYear = $scope.endDay.getFullYear();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    console.log($scope.startDay);
    vm.getDay = function (startDay, endDay) {
      $http.get('api/ledgers/' + startDay + '/' + endDay).success(function (response) {
        vm.listpayment = response;
        console.log(vm.listpayment);
        // if (response.orders.length === 0) {
        //   alert('ไม่พบข้อมูล');
        // }
      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);

    // Ledgerreport controller logic
    // ...
  }
})();
