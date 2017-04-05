(function () {
  'use strict';

  angular
    .module('payments')
    .controller('StatementincomereportController', StatementincomereportController);

  StatementincomereportController.$inject = ['$scope', '$http', 'PaymentsService', 'Authentication'];

  function StatementincomereportController($scope, $http, PaymentsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    $scope.endDay = new Date();
    var lastweek = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    vm.getDay = function (startDay, endDay) {
      
      $http.get('api/statementincomes/' + startDay + '/' + endDay).success(function (response) {
        vm.liststatementincomes = response.data;
      }).error(function (err) {
        console.log(err);
      });
      
    };
    vm.getDay($scope.startDay, $scope.endDay);
  }
})();
