(function () {
  'use strict';

  angular
    .module('requestorders')
    .controller('ReportrequestorderController', ReportrequestorderController);

  ReportrequestorderController.$inject = ['$scope', 'Authentication'];

  function ReportrequestorderController($scope, Authentication) {
    var vm = this;
    vm.authentication = Authentication;


    // $scope.endDay = new Date();
    // var lastweek = new Date();
    // $scope.startDay = new Date($scope.endDay.getFullYear(), $scope.endDay.getMonth(), '01');
    // vm.getDay = function (startDay, endDay) {
    //   $http.get('api/ledgers/' + startDay + '/' + endDay).success(function (response) {
    
    //   }).error(function (err) {
    //     console.log(err);
    //   });
    // };
  }
})();
