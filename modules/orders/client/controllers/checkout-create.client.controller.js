(function() {
  'use strict';

  angular
    .module('orders')
    .controller('CheckoutCreateController', CheckoutCreateController);

  CheckoutCreateController.$inject = ['$scope'];

  function CheckoutCreateController($scope) {
    var vm = this;

    // Checkout create controller logic
    // ...

    init();

    function init() {
    }
  }
})();
