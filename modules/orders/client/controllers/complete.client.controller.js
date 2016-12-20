(function() {
  'use strict';

  angular
    .module('orders')
    .controller('CompleteController', CompleteController);

  CompleteController.$inject = ['$scope'];

  function CompleteController($scope) {
    var vm = this;

    // Complete controller logic
    // ...

    init();

    function init() {
    }
  }
})();
