(function () {
  'use strict';

  angular
    .module('adjusts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adjusts', {
        abstract: true,
        url: '/adjusts',
        template: '<ui-view/>'
      })
      .state('adjusts.list', {
        url: '',
        templateUrl: 'modules/adjusts/client/views/list-adjusts.client.view.html',
        controller: 'AdjustsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Adjusts List'
        }
      })
      .state('adjusts.create', {
        url: '/create',
        templateUrl: 'modules/adjusts/client/views/form-adjust.client.view.html',
        controller: 'AdjustsController',
        controllerAs: 'vm',
        resolve: {
          adjustResolve: newAdjust
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Adjusts Create'
        }
      })
      .state('adjusts.edit', {
        url: '/:adjustId/edit',
        templateUrl: 'modules/adjusts/client/views/form-adjust.client.view.html',
        controller: 'AdjustsController',
        controllerAs: 'vm',
        resolve: {
          adjustResolve: getAdjust
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Adjust {{ adjustResolve.name }}'
        }
      })
      .state('adjusts.view', {
        url: '/:adjustId',
        templateUrl: 'modules/adjusts/client/views/view-adjust.client.view.html',
        controller: 'AdjustsController',
        controllerAs: 'vm',
        resolve: {
          adjustResolve: getAdjust
        },
        data: {
          pageTitle: 'Adjust {{ adjustResolve.name }}'
        }
      });
  }

  getAdjust.$inject = ['$stateParams', 'AdjustsService'];

  function getAdjust($stateParams, AdjustsService) {
    return AdjustsService.get({
      adjustId: $stateParams.adjustId
    }).$promise;
  }

  newAdjust.$inject = ['AdjustsService'];

  function newAdjust(AdjustsService) {
    return new AdjustsService();
  }
}());
