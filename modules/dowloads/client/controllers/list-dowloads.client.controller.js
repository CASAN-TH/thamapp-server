(function () {
  'use strict';

  angular
    .module('dowloads')
    .controller('DowloadsListController', DowloadsListController);

  DowloadsListController.$inject = ['DowloadsService', 'Authentication'];

  function DowloadsListController(DowloadsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.dowloads = DowloadsService.query();
  }
}());
