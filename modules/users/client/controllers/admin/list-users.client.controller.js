// 'use strict';

// angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', 'Authentication',
//   function ($scope, $filter, Admin, Authentication) {
//      var vm = this;
//      vm.authentication = Authentication;
//      vm.users = Admin.query();
//      console.log(vm.users);

//      vm.listuser = function(user){
//        console.log(user.roles[0]);
//        if(user.roles[0] === 'user'){
//         return true;
//        }
//      }
//     // Admin.query(function (data) {
//     //   $scope.users = data;
//     //   $scope.buildPager();
//     // });

//     // $scope.buildPager = function () {
//     //   $scope.pagedItems = [];
//     //   $scope.itemsPerPage = 15;
//     //   $scope.currentPage = 1;
//     //   $scope.figureOutItemsToDisplay();
//     // };

//     // $scope.figureOutItemsToDisplay = function () {
//     //   $scope.filteredItems = $filter('filter')($scope.users, {
//     //     $: $scope.search
//     //   });
//     //   $scope.filterLength = $scope.filteredItems.length;
//     //   var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
//     //   var end = begin + $scope.itemsPerPage;
//     //   $scope.pagedItems = $scope.filteredItems.slice(begin, end);
//     // };

//     // $scope.pageChanged = function () {
//     //   $scope.figureOutItemsToDisplay();
//     // };
//   }
// ]);

(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', 'Admin', '$filter', 'Authentication'];

  function UserListController($scope, Admin, $filter, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.users = Admin.query();

   

  }
})();