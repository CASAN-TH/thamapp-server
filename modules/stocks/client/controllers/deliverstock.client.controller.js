(function() {
  'use strict';

  angular
    .module('stocks')
    .controller('DeliverstockController', DeliverstockController);

  DeliverstockController.$inject = ['$scope'];

  function DeliverstockController($scope) {
    var vm = this;

    // Deliverstock controller logic
    // ...

    init();

    function init() {
    }
  }
})();
