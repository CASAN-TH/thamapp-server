(function() {
  'use strict';

  angular
    .module('payments')
    .controller('BalancereportController', BalancereportController);

  BalancereportController.$inject = ['$scope'];

  function BalancereportController($scope) {
    var vm = this;

    // Balancereport controller logic
    // ...

    init();

    function init() {
    }
  }
})();
