(function () {
  'use strict';

  angular
    .module('returnorders')
    .controller('ReportreturnorderController', ReportreturnorderController);

  ReportreturnorderController.$inject = ['$scope', '$http', 'Authentication', 'ReturnordersService', 'Admin'];

  function ReportreturnorderController($scope, $http, Authentication, ReturnordersService, Admin) {
    var vm = this;
    vm.authentication = Authentication;

    Admin.query(function (data) {
      $scope.listtran = [];
      data.forEach(function (data) {
        if (data.roles[0] === 'transporter') {
          $scope.listtran.push(data);
        }
      });
    });
    vm.listreturn = [];

    $scope.endDay = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    vm.getDay = function (startDay, endDay) {
      $http.get('api/reportreturnorder/' + startDay + '/' + endDay).success(function (response) {
        vm.listreturn = response;
      }).error(function (err) {
        console.log(err);
      });
    };
  }
})();
