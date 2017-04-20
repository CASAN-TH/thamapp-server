(function () {
  'use strict';

  angular
    .module('payments')
    .controller('ExpensereportController', ExpensereportController);

  ExpensereportController.$inject = ['$scope', '$http', 'PaymentsService', 'Authentication'];

  function ExpensereportController($scope, $http, PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.listexpenser = [];

    $scope.endDay = new Date();
    var lastweek = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    // console.log($scope.startDay);
    vm.getDay = function (startDay, endDay) {
      vm.listexpenser = [];
      $http.get('api/expenses/' + startDay + '/' + endDay).success(function (response) {
        // response.accounts.forEach(function (expenser) {
        //   if (expenser.account.accountno.substr(0, 1) === '5') {
        //     vm.listexpenser.push(expenser);
        //   }
        // });
        vm.listexpenser = response.accounts;
        vm.sumexpense = 0;
        vm.listexpenser.forEach(function (sumall) {
          vm.sumexpense += sumall.sumdebit - sumall.sumcredit;
        });

      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);
  }
})();
