(function () {
  'use strict';

  angular
    .module('payments')
    .controller('BalancereportController', BalancereportController);

  BalancereportController.$inject = ['$scope', '$http', 'PaymentsService', 'Authentication'];

  function BalancereportController($scope, $http, PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.listbalances = [];

    $scope.endDay = new Date();
    var lastweek = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    console.log($scope.startDay);
    vm.getDay = function (startDay, endDay) {
      vm.listbalances = [];
      $http.get('api/balance/' + startDay + '/' + endDay).success(function (response) {
        // response.accounts.forEach(function (expenser) {
        //   if (expenser.account.accountno.substr(0, 1) === '5') {
        //     vm.listexpenser.push(expenser);
        //   }
        // });
        vm.listbalances = response.data;
        // vm.sumexpense = 0;
        // vm.listexpenser.forEach(function (sumall) {
        //   vm.sumexpense += sumall.sumdebit - sumall.sumcredit;
        // });

      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);
  }
})();
