(function () {
  'use strict';

  angular
    .module('users')
    .controller('DeliverController', DeliverController);

  DeliverController.$inject = ['$scope', 'PostcodesService', '$http'];

  function DeliverController($scope, PostcodesService, $http) {
    var vm = this;
    vm.readPostcode = readPostcode;
    vm.signup = signup;


    // Deliver controller logic
    // ...


    // function init() {
    // }
    function readPostcode() {
      vm.postcode = PostcodesService.query();
      //console.log(vm.postcode.length);   
    }

    function signup() {
      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.user = response;
      }).error(function (response) {

      });
    }

  }
})();
