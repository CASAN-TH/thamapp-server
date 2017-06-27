(function () {
  'use strict';

  angular
    .module('freerices')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('freerices', {
        abstract: true,
        url: '/freerices',
        template: '<ui-view/>'
      })
      .state('freerices.list', {
        url: '',
        templateUrl: 'modules/freerices/client/views/list-freerices.client.view.html',
        controller: 'FreericesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Freerices List'
        }
      })
      .state('freerices.create', {
        url: '/create',
        templateUrl: 'modules/freerices/client/views/form-freerice.client.view.html',
        controller: 'FreericesController',
        controllerAs: 'vm',
        resolve: {
          freericeResolve: newFreerice
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Freerices Create'
        }
      })
      .state('freerices.edit', {
        url: '/:freericeId/edit',
        templateUrl: 'modules/freerices/client/views/form-freerice.client.view.html',
        controller: 'FreericesController',
        controllerAs: 'vm',
        resolve: {
          freericeResolve: getFreerice
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Freerice {{ freericeResolve.name }}'
        }
      })
      .state('freerices.view', {
        url: '/:freericeId',
        templateUrl: 'modules/freerices/client/views/view-freerice.client.view.html',
        controller: 'FreericesController',
        controllerAs: 'vm',
        resolve: {
          freericeResolve: getFreerice
        },
        data: {
          pageTitle: 'Freerice {{ freericeResolve.name }}'
        }
      });
  }

  getFreerice.$inject = ['$stateParams', 'FreericesService'];

  function getFreerice($stateParams, FreericesService) {
    return FreericesService.get({
      freericeId: $stateParams.freericeId
    }).$promise;
  }

  newFreerice.$inject = ['FreericesService'];

  function newFreerice(FreericesService) {
    return new FreericesService();
  }
}());
