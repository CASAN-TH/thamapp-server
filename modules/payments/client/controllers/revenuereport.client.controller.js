(function () {
  'use strict';

  angular
    .module('payments')
    .controller('RevenuereportController', RevenuereportController);

  RevenuereportController.$inject = ['$scope', '$http', 'PaymentsService', 'Authentication'];

  function RevenuereportController($scope, $http, PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.listrevenue = [];

    $scope.endDay = new Date();
    var lastweek = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    // console.log($scope.startDay);
    vm.getDay = function (startDay, endDay) {
      vm.listrevenue = [];
      $http.get('api/revenues/' + startDay + '/' + endDay).success(function (response) {
        // response.accounts.forEach(function (revenue) {
        //   if (revenue.account.accountno.substr(0, 1) === '4') {
        //     vm.listrevenue.push(revenue);
        //   }
        // });
        vm.listrevenue = response.accounts;
        // console.log(vm.listrevenue);
        vm.sumrevenue = 0;
        vm.listrevenue.forEach(function (sumall) {
          vm.sumrevenue += sumall.sumcredit - sumall.sumdebit;
        });

      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);

  }
})();
