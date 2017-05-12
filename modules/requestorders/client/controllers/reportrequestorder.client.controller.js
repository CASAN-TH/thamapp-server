(function () {
  'use strict';

  angular
    .module('requestorders')
    .controller('ReportrequestorderController', ReportrequestorderController);

  ReportrequestorderController.$inject = ['$scope', '$http', 'Authentication', 'RequestordersService', 'Admin'];

  function ReportrequestorderController($scope, $http, Authentication, RequestordersService, Admin) {
    var vm = this;
    vm.authentication = Authentication;
    Admin.query(function (data) {
      $scope.listtran = [];
      $scope.listtranbyid = [];
      data.forEach(function (data) {
        if (data.roles[0] === 'transporter') {
          $scope.listtran.push(data);
          if (data._id === vm.authentication.user._id) {
            $scope.listtranbyid.push(data);
          }
        }
      });
    });

    vm.listrequest = [];

    $scope.endDay = new Date();
    $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    vm.getDay = function (startDay, endDay) {
      $http.get('api/reportrequestorder/' + startDay + '/' + endDay).success(function (response) {
        vm.listrequest = response;
      }).error(function (err) {
        console.log(err);
      });
    };
    vm.getDay($scope.startDay, $scope.endDay);
  }
})();
