(function() {
  'use strict';

  angular
    .module('orders')
    .controller('CartviewController', CartviewController);

  CartviewController.$inject = ['$scope'];

  function CartviewController($scope) {
    var vm = this;

    // Cartview controller logic
    // ...

    init();

    function init() {
    }
  }
})();
