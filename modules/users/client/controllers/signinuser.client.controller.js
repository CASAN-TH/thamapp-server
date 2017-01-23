(function () {
  'use strict';

  angular
    .module('users')
    .controller('SigninuserController', SigninuserController);

  SigninuserController.$inject = ['$scope', '$http', '$state', 'Authentication'];

  function SigninuserController($scope, $http, $state, Authentication) {
    var vm = this;
    $scope.authentication = Authentication;
    // Signinuser controller logic
    // ...
    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      $scope.credentials.password = 'Usr#Pass1234';
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
})();
