(function () {
  'use strict';

  angular
    .module('payments')
    .controller('JournalController', JournalController);

  JournalController.$inject = ['$scope', '$http', 'PaymentsService', 'Authentication'];

  function JournalController($scope, $http, PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.listjournal = [];

    $scope.endDay = new Date();
    var lastweek = new Date();
    // var getendMonth = $scope.endDay.getMonth()+1;
    // var getendYear = $scope.endDay.getFullYear();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    console.log($scope.startDay);
    vm.getDay = function (startDay, endDay) {
      $http.get('api/journals/' + startDay + '/' + endDay).success(function (response) {
        vm.listjournal = response;
        // console.log(vm.listjournal);
        // if (response.orders.length === 0) {
        //   alert('ไม่พบข้อมูล');
        // }
      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);

    $scope.searchForCal = function (search) {
      $scope.resultOfSearchCredit = 0;
      $scope.resultOfSearchDebit = 0;
      vm.listjournal.journals.forEach(function (jour) {
        jour.trns.forEach(function (trn) {
          var trnId = trn.trnsno.substr(0, search.length);
          if (trnId.toString() === search.toString().toUpperCase()) {
            $scope.resultOfSearchCredit += trn.debit;
            $scope.resultOfSearchDebit += trn.credit;
          }
        });
      });
    };



  }
})();
