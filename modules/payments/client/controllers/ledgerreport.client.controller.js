(function() {
  'use strict';

  angular
    .module('payments')
    .controller('LedgerreportController', LedgerreportController);

  LedgerreportController.$inject = ['$scope'];

  function LedgerreportController($scope) {
    var vm = this;

    // Ledgerreport controller logic
    // ...

    init();

    function init() {
    }
  }
})();
