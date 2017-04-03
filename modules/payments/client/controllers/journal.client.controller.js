(function() {
  'use strict';

  angular
    .module('payments')
    .controller('JournalController', JournalController);

  JournalController.$inject = ['$scope'];

  function JournalController($scope) {
    var vm = this;

    // Journal controller logic
    // ...

    init();

    function init() {
    }
  }
})();
