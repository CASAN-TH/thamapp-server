// Accuralreceipts service used to communicate Accuralreceipts REST endpoints
(function () {
  'use strict';

  angular
    .module('accuralreceipts')
    .factory('AccuralreceiptsService', AccuralreceiptsService);

  AccuralreceiptsService.$inject = ['$resource'];

  function AccuralreceiptsService($resource) {
    return $resource('api/accuralreceipts/:accuralreceiptId', {
      accuralreceiptId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
