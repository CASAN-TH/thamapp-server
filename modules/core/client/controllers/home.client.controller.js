'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','ProductsService',
  function ($scope, Authentication, product) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.products = product.query();
    // Some example string
    $scope.helloText = 'ร้านค้า ธรรมธุรกิจ';
    $scope.descriptionText = 'แหล่งรวมสินค้า อาหาร ธรรมชาติ';

  }
]);
