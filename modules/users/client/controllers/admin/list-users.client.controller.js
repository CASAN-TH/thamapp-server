'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
     var vm = this;
     vm.users = Admin.query();

      vm.listuser = function (user) {
      if (vm.authentication.user.roles[0] === 'admin') {
        if (data.arstatus === 'confirmed') {
          return true;
        }
      }
    };
     vm.listuser = function(user){
       console.log(user.roles[0]);
       if(user.roles[0] === 'user'){
        return true;
       }
     }
    // Admin.query(function (data) {
    //   $scope.users = data;
    //   $scope.buildPager();
    // });

    // $scope.buildPager = function () {
    //   $scope.pagedItems = [];
    //   $scope.itemsPerPage = 15;
    //   $scope.currentPage = 1;
    //   $scope.figureOutItemsToDisplay();
    // };

    // $scope.figureOutItemsToDisplay = function () {
    //   $scope.filteredItems = $filter('filter')($scope.users, {
    //     $: $scope.search
    //   });
    //   $scope.filterLength = $scope.filteredItems.length;
    //   var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
    //   var end = begin + $scope.itemsPerPage;
    //   $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    // };

    // $scope.pageChanged = function () {
    //   $scope.figureOutItemsToDisplay();
    // };
  }
]);
