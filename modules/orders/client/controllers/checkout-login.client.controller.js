(function() {
  'use strict';

  angular
    .module('orders')
    .controller('CheckoutLoginController', CheckoutLoginController);

  CheckoutLoginController.$inject = ['$scope'];

  function CheckoutLoginController($scope) {
    var vm = this;

    // Checkout login controller logic
    // ...

    init();

    function init() {
    }
  }
})();
