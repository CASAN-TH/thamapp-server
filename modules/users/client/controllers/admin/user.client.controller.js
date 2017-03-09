'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve', 'PostcodesService','$http',
  function ($scope, $state, Authentication, userResolve, PostcodesService,$http) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;
    $scope.postcodeQuery = PostcodesService.query();
    $scope.postcode = $scope.postcodeQuery;

    $scope.callback = function (postcode) {
      $scope.checkAutocomplete(postcode);
    };

    $scope.checkAutocomplete = function (postcode) {
      if (postcode) {
        $scope.user.address.district = postcode.district;
        $scope.user.address.subdistrict = postcode.subdistrict;
        $scope.user.address.province = postcode.province;
      } else {
        $scope.user.address.district = '';
        $scope.user.address.province = '';
        $scope.user.address.subdistrict = '';
      }
    };
    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      console.log('new : ' + $scope.user.address);
      var user = $scope.user;

      user.$update(function (res) {
        $scope.user = res;
        $state.go('admin.users');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
