(function() {
  'use strict';

  angular
    .module('users')
    .controller('DeliverController', DeliverController);

  DeliverController.$inject = ['$scope'];

  function DeliverController($scope) {
    var vm = this;

    // Deliver controller logic
    // ...

    init();

    function init() {
    }
  }
})();
