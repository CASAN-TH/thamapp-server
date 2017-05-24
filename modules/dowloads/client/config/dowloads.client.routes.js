(function () {
  'use strict';

  angular
    .module('dowloads')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dowloads', {
        abstract: true,
        url: '/dowloads',
        template: '<ui-view/>'
      })
      .state('dowloads.list', {
        url: '',
        templateUrl: 'modules/dowloads/client/views/list-dowloads.client.view.html',
        controller: 'DowloadsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dowloads List'
        }
      })
      .state('dowloads.create', {
        url: '/create',
        templateUrl: 'modules/dowloads/client/views/form-dowload.client.view.html',
        controller: 'DowloadsController',
        controllerAs: 'vm',
        resolve: {
          dowloadResolve: newDowload
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Dowloads Create'
        }
      })
      .state('dowloads.edit', {
        url: '/:dowloadId/edit',
        templateUrl: 'modules/dowloads/client/views/form-dowload.client.view.html',
        controller: 'DowloadsController',
        controllerAs: 'vm',
        resolve: {
          dowloadResolve: getDowload
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Dowload {{ dowloadResolve.name }}'
        }
      })
      .state('dowloads.view', {
        url: '/:dowloadId',
        templateUrl: 'modules/dowloads/client/views/view-dowload.client.view.html',
        controller: 'DowloadsController',
        controllerAs: 'vm',
        resolve: {
          dowloadResolve: getDowload
        },
        data: {
          pageTitle: 'Dowload {{ dowloadResolve.name }}'
        }
      });
  }

  getDowload.$inject = ['$stateParams', 'DowloadsService'];

  function getDowload($stateParams, DowloadsService) {
    return DowloadsService.get({
      dowloadId: $stateParams.dowloadId
    }).$promise;
  }

  newDowload.$inject = ['DowloadsService'];

  function newDowload(DowloadsService) {
    return new DowloadsService();
  }
}());
