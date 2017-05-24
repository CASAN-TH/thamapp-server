(function () {
  'use strict';

  angular
    .module('dowloads')
    .controller('DowloadsListController', DowloadsListController);

  DowloadsListController.$inject = ['DowloadsService'];

  function DowloadsListController(DowloadsService) {
    var vm = this;

    vm.dowloads = DowloadsService.query();
  }
}());
