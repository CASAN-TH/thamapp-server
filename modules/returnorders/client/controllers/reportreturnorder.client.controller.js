(function () {
  'use strict';

  angular
    .module('returnorders')
    .controller('ReportreturnorderController', ReportreturnorderController);

  ReportreturnorderController.$inject = ['$scope', 'Authentication'];

  function ReportreturnorderController($scope, Authentication) {
    var vm = this;
    vm.authentication = Authentication;


  }
})();
