'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','ProductsService',
  function ($scope, Authentication, product) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.products = product.query();
    // Some example string
    $scope.helloText = 'โครงการยักษ์จับมือโจน ส่งถึงบ้าน';
    $scope.descriptionText = 'แหล่งรวมสินค้า อาหาร ธรรมชาติ';

  }
]);
