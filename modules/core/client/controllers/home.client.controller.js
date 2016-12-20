'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    // Some example string
    $scope.helloText = 'ร้านค้า ธรรมธุรกิจ';
    $scope.descriptionText = 'แหล่งรวมสินค้า อาหาร ธรรมชาติ';

  }
]);
