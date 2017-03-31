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

    var lastweek = new Date();
    $scope.startDay = new Date(lastweek.getFullYear(), lastweek.getMonth(), lastweek.getDate() - 29);
    $scope.endDay = new Date();

    vm.getDay = function (startDay, endDay) {
      $http.get('api/ledgers/' + startDay + '/' + endDay).success(function (response) {
        console.log(response);
        // console.log(response);
        // if (response.orders.length === 0) {
        //   alert('ไม่พบข้อมูล');
        // }
      }).error(function (err) {
        console.log(err);
      });
    };

    // Ledgerreport controller logic
    // ...
  }
})();
