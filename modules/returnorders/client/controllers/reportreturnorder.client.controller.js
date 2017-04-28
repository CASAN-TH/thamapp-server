(function () {
  'use strict';

  angular
    .module('returnorders')
    .controller('ReportreturnorderController', ReportreturnorderController);

  ReportreturnorderController.$inject = ['$scope', '$http', 'Authentication', 'ReturnordersService', 'Admin'];

  function ReportreturnorderController($scope, $http, Authentication, ReturnordersService, Admin) {
    var vm = this;
    vm.authentication = Authentication;
    vm.listreturn = [];

    $scope.listtran = [];
    Admin.query(function (data) {
      data.forEach(function (data) {
        if (data.roles[0] === 'transporter') {
          $scope.listtran.push(data);
        }
      });
      vm.listreturn = data;
    });

    $scope.endDay = new Date();
    // var lastweek = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    vm.getDay = function (startDay, endDay) {
      $http.get('api/reportreturnorder/' + startDay + '/' + endDay).success(function (response) {
        vm.listreturn = response;
        console.log(vm.listreturn);
      }).error(function (err) {
        console.log(err);
      });
    };
  }
})();
