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
    vm.ones = [];
    vm.sumone = 0;
    vm.twos = [];
    vm.threes = [];
    vm.sumthree = 0;
    vm.sumtwo = 0;
    vm.fivetwoarray = [];
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
      vm.sumone = 0;
      vm.sumtwo = 0;
      vm.fourones = [];
      vm.fivetwoarray = [];
      vm.ones = [];
      vm.twos = [];
      vm.threes = [];
      vm.sumthree = 0;
      var sumfivezeros = [];
      $http.get('api/ledgers/' + startDay + '/' + endDay).success(function (response) {
        vm.listsample = response;
        vm.listsample.accounts.forEach(function (sample) {
          if (sample.account.accountno.substr(0, 2).toString() === '41') {
            vm.fourones.push(sample);
            vm.sumfourone += sample.sumcredit - sample.sumdebit;
          } else if (sample.account.accountno.substr(0, 2) === '42') {
            vm.fourtwos += sample.sumcredit - sample.sumdebit;
          } else if (sample.account.accountno.substr(0, 2) === '50') {
            vm.fivetwoarray.push(sample);
          } else if (sample.account.accountno.substr(0, 2) === '51') {
            vm.fiveones += sample.sumdebit - sample.sumcredit;
          } else if (sample.account.accountno.substr(0, 2) === '52') {
            vm.fivetwos += sample.sumdebit - sample.sumcredit;
          } else if (sample.account.accountno.substr(0, 1) === '1') {
            vm.ones.push(sample);
          } else if (sample.account.accountno.substr(0, 1) === '2') {
            vm.twos.push(sample);
          } else if (sample.account.accountno.substr(0, 1) === '3') {
            vm.threes.push(sample);
          }
        });

        vm.fivetwoarray.forEach(function (sample) {
          var datafivezero = {
            bf: 0,
            period: 0,
          };
          datafivezero.bf += sample.bfsumdebit - sample.bfsumcredit;
          datafivezero.period += sample.bfsumdebit - sample.bfsumcredit;
          sumfivezeros.push(datafivezero);
        });

        sumfivezeros.forEach(function (datafivezero) {
          // if (datafivezero.bf < 0 || datafivezero.period < 0) {
          vm.sumfivezero += datafivezero.period + datafivezero.bf;
          // } else {
          //   vm.sumfivezero += datafivezero.period + datafivezero.bf;
          // }
        });

        vm.ones.forEach(function (one) {
          vm.sumone += one.bfsumdebit - one.bfsumcredit;
        });

        vm.twos.forEach(function (two) {
          vm.sumtwo += two.bfsumdebit - two.bfsumcredit;
        });

        vm.threes.forEach(function (three) {
          vm.sumthree += three.bfsumdebit - three.bfsumcredit;
        });
      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);
  }
})();
