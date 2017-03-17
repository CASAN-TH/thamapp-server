(function() {
  'use strict';

  angular
    .module('orders')
    .controller('SalereportController', SalereportController);

  SalereportController.$inject = ['$scope'];

  function SalereportController($scope) {
    var vm = this;

    // Salereport controller logic
    // ...

    init();

    function init() {
    }
  }
})();
