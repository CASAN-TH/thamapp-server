(function () {
  'use strict';

  angular
    .module('downloads')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('downloads', {
        abstract: true,
        url: '/downloads',
        template: '<ui-view/>'
      })
      .state('downloads.list', {
        url: '',
        templateUrl: 'modules/downloads/client/views/list-downloads.client.view.html',
        controller: 'DownloadsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Downloads List'
        }
      })
      .state('downloads.create', {
        url: '/create',
        templateUrl: 'modules/downloads/client/views/form-download.client.view.html',
        controller: 'DownloadsController',
        controllerAs: 'vm',
        resolve: {
          downloadResolve: newDownload
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Downloads Create'
        }
      })
      .state('downloads.edit', {
        url: '/:downloadId/edit',
        templateUrl: 'modules/downloads/client/views/form-download.client.view.html',
        controller: 'DownloadsController',
        controllerAs: 'vm',
        resolve: {
          downloadResolve: getDownload
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Download {{ downloadResolve.name }}'
        }
      })
      .state('downloads.view', {
        url: '/:downloadId',
        templateUrl: 'modules/downloads/client/views/view-download.client.view.html',
        controller: 'DownloadsController',
        controllerAs: 'vm',
        resolve: {
          downloadResolve: getDownload
        },
        data: {
          pageTitle: 'Download {{ downloadResolve.name }}'
        }
      });
  }

  getDownload.$inject = ['$stateParams', 'DownloadsService'];

  function getDownload($stateParams, DownloadsService) {
    return DownloadsService.get({
      downloadId: $stateParams.downloadId
    }).$promise;
  }

  newDownload.$inject = ['DownloadsService'];

  function newDownload(DownloadsService) {
    return new DownloadsService();
  }
}());
