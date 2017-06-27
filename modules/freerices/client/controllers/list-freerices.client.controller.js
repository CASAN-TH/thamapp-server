(function () {
  'use strict';

  angular
    .module('freerices')
    .controller('FreericesListController', FreericesListController);

  FreericesListController.$inject = ['FreericesService'];

  function FreericesListController(FreericesService) {
    var vm = this;

    vm.freerices = FreericesService.query();
  }
}());
