(function () {
  'use strict';

  angular
    .module('payments')
    .controller('SamplereportController', SamplereportController);

  SamplereportController.$inject = ['$scope', '$http', 'PaymentsService', 'Authentication'];

  function SamplereportController($scope, $http, PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    $scope.topsearch = '';
    vm.listsample = [];

    $scope.endDay = new Date();
    var lastweek = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    console.log($scope.startDay);
    vm.getDay = function (startDay, endDay) {
      $http.get('api/ledgers/' + startDay + '/' + endDay).success(function (response) {
        vm.listsample = response;
        $scope.summaryOfSearch();
      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);

    $scope.summaryOfSearch = function () {
      $scope.resultOfallatsumdebit = 0;
      $scope.resultOfallatsumcredit = 0;
      $scope.resultOfallsumdebit = 0;
      $scope.resultOfallsumcredit = 0;
      $scope.resultOfallbfsumdebit = 0;
      $scope.resultOfallbfsumcredit = 0;

      vm.listsample.accounts.forEach(function (samp) {
        var search = $scope.topsearch;
        var trnId = samp.account.accountno.substr(0, search.length);
        if (trnId.toString() === search.toString().toUpperCase()) {
          $scope.resultOfallatsumdebit += samp.bfsumdebit + samp.sumdebit;
          $scope.resultOfallatsumcredit += samp.bfsumcredit + samp.sumcredit;

          $scope.resultOfallsumdebit += samp.sumdebit;
          $scope.resultOfallsumcredit += samp.sumcredit;

          $scope.resultOfallbfsumcredit += samp.bfsumcredit;
          $scope.resultOfallbfsumdebit += samp.bfsumdebit;
          console.log($scope.resultOfallbfsumdebit);

        }
      });
    };

  }
})();
