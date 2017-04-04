(function () {
  'use strict';

  angular
    .module('payments')
    .controller('StatementincomereportController', StatementincomereportController);

  StatementincomereportController.$inject = ['$scope', '$http', 'PaymentsService', 'Authentication'];

  function StatementincomereportController($scope, $http, PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.listsample = [];
    vm.fourones = [];
    vm.fourtwos = 0;
    vm.fivezeros = [];
    vm.fiveones = 0;
    vm.fivetwos = 0;
    $scope.endDay = new Date();
    var lastweek = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    console.log($scope.startDay);
    vm.getDay = function (startDay, endDay) {
      vm.fourtwos = 0;
      vm.fiveones = 0;
      vm.fivetwos = 0;
      vm.sumfourone = 0;
      vm.sumfivezero = 0;
      $http.get('api/ledgers/' + startDay + '/' + endDay).success(function (response) {
        vm.listsample = response;
        vm.listsample.accounts.forEach(function (sample) {
          if (sample.account.accountno.substr(0, 2).toString() === '41') {
            vm.sumfourone += sample.sumcredit - sample.sumdebit;
          } else if (sample.account.accountno.substr(0, 2) === '42') {
            vm.fourtwos += sample.sumcredit - sample.sumdebit;
          } else if (sample.account.accountno.substr(0, 2) === '50') {
            var datafivezero = {
              bf: 0,
              period: 0,
            };
            datafivezero.bf += sample.bfsumdebit - sample.bfsumcredit;
            datafivezero.period += sample.bfsumdebit - sample.bfsumcredit;
            vm.sumfivezero += datafivezero.period - datafivezero.bf;
          } else if (sample.account.accountno.substr(0, 2) === '51') {
            vm.fiveones += sample.sumdebit - sample.sumcredit;
          } else if (sample.account.accountno.substr(0, 2) === '52') {
            vm.fivetwos += sample.sumdebit - sample.sumcredit;
          }
        });
      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);
  }
})();
