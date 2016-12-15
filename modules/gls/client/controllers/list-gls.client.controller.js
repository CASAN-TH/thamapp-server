(function () {
  'use strict';

  angular
    .module('gls')
    .controller('GlsListController', GlsListController);

  GlsListController.$inject = ['GlsService'];

  function GlsListController(GlsService) {
    var vm = this;

    vm.gls = GlsService.query();
  }
}());
