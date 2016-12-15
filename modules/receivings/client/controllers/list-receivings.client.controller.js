(function () {
  'use strict';

  angular
    .module('receivings')
    .controller('ReceivingsListController', ReceivingsListController);

  ReceivingsListController.$inject = ['ReceivingsService'];

  function ReceivingsListController(ReceivingsService) {
    var vm = this;

    vm.receivings = ReceivingsService.query();
  }
}());
