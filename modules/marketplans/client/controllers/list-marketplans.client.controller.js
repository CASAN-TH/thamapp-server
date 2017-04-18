(function () {
  'use strict';

  angular
    .module('marketplans')
    .controller('MarketplansListController', MarketplansListController);

  MarketplansListController.$inject = ['MarketplansService', '$scope'];

  function MarketplansListController(MarketplansService, $scope) {
    var vm = this;

    vm.marketplans = MarketplansService.query(function () {
      vm.marketplans.forEach(function (res) {


      });
    });

    $scope.textStart = function (startdate, enddate) {
      var date = new Date(enddate),
        start = new Date(startdate),
        locale = 'th',
        monthend = date.toLocaleString(locale, { month: 'long' }),
        datestart = start.getDate(),
        dateend = date.getDate();
      if (datestart < 10) {
        datestart = '0' + datestart;
      }
       if (dateend < 10) {
        datestart = '0' + dateend;
      }
      return datestart + ' - ' + dateend + ' ' + monthend;

    };
  }
}());
