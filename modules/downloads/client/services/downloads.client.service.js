// Downloads service used to communicate Downloads REST endpoints
(function () {
  'use strict';

  angular
    .module('downloads')
    .factory('DownloadsService', DownloadsService);

  DownloadsService.$inject = ['$resource'];

  function DownloadsService($resource) {
    return $resource('api/downloads/:downloadId', {
      downloadId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
