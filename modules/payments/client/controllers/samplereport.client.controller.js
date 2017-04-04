(function () {
  'use strict';

  angular
    .module('payments')
    .controller('SamplereportController', SamplereportController);

  SamplereportController.$inject = ['$scope', '$http', 'PaymentsService', 'Authentication'];

  function SamplereportController($scope, $http, PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.listsample = [];

    $scope.endDay = new Date();
    var lastweek = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    console.log($scope.startDay);
    vm.getDay = function (startDay, endDay) {
      $http.get('api/ledgers/' + startDay + '/' + endDay).success(function (response) {
        vm.listsample = response;
        // console.log(vm.listsample);

        vm.allbfsumdebit = 0;
        vm.allbfsumcredit = 0;
        vm.allsumdebit = 0;
        vm.allsumcredit = 0;
        vm.allatsumdebit = 0;
        vm.allatsumcredit = 0;
        vm.listsample.accounts.forEach(function (sample) {

          vm.allbfsumdebit += sample.bfsumdebit - sample.bfsumcredit;
          vm.allbfsumcredit += sample.bfsumcredit - sample.bfsumdebit;
          vm.allsumdebit += sample.sumdebit;
          vm.allsumcredit += sample.sumcredit;
          vm.allatsumdebit += sample.bfsumdebit + sample.sumdebit;
          vm.allatsumcredit += sample.bfsumcredit + sample.sumcredit;

        });
      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);

    $scope.searchForCal = function (search) {
      $scope.resultOfallatsumdebit = 0;
      $scope.resultOfallatsumcredit = 0;
      $scope.resultOfallsumdebit = 0;
      $scope.resultOfallsumcredit = 0;
      $scope.resultOfallbfsumdebit = 0;
      $scope.resultOfallbfsumcredit = 0;

      vm.listsample.accounts.forEach(function (samp) {
        samp.trns.forEach(function (trn) {
          var trnId = trn.trnsno.substr(0, search.length);
          if (trnId.toString() === search.toString().toUpperCase()) {
            $scope.resultOfallatsumdebit += samp.bfsumdebit + samp.sumdebit;
            $scope.resultOfallatsumcredit += samp.bfsumcredit + samp.sumcredit;
            // $scope.resultOfallbfsumdebit += samp.bfsumdebit - samp.bfsumcredit;
            
            $scope.resultOfallbfsumcredit += samp.bfsumcredit - samp.bfsumdebit;
            $scope.resultOfallsumdebit += samp.sumdebit;
            $scope.resultOfallsumcredit += samp.sumcredit;

            $scope.resultOfallbfsumdebit += $scope.resultOfallatsumdebit - $scope.resultOfallsumdebit;
            
          }
        });
      });
    };

  }
})();
